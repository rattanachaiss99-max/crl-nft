<template>
  <div class="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl my-10">
    <div v-if="isLoading" class="text-center py-20 text-gray-500 text-xl">
      กำลังโหลดข้อมูลสินค้า...
    </div>
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 aspect-square flex items-center justify-center">
          <img 
            :src="selectedSku ? selectedSku.pic_url : product.pic_url" 
            alt="Product Image" 
            class="w-full h-full object-cover transition-all duration-300"
          />
        </div>
        
        <div class="flex gap-2 overflow-x-auto">
          <div 
            v-for="(img, idx) in product.slider_pic_urls" 
            :key="idx"
            class="w-20 h-20 border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <div class="space-y-4">
          <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {{ product.recommend_hot ? '🔥 สินค้าขายดี' : 'สินค้าแนะนำ' }}
          </span>
          
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="text-gray-500 text-sm">{{ product.introduction }}</p>

          <div class="bg-gray-50 p-4 rounded-lg">
            <span class="text-sm text-gray-400 block">ราคา</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-blue-600">
                ฿{{ formatPrice(selectedSku ? selectedSku.price : product.price) }}
              </span>
              <span v-if="product.market_price" class="text-sm text-gray-400 line-through">
                ฿{{ formatPrice(product.market_price) }}
              </span>
            </div>
          </div>

          <div v-if="product.spec_type" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">เลือกรูปแบบสินค้า (ตัวเลือก):</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="sku in skuList"
                :key="sku.id"
                @click="selectSku(sku)"
                :class="[
                  'px-4 py-2 border rounded-lg text-sm font-medium transition-all',
                  selectedSku?.id === sku.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50',
                  sku.stock === 0 ? 'opacity-40 cursor-not-allowed bg-gray-100' : ''
                ]"
                :disabled="sku.stock === 0"
              >
                {{ sku.properties?.valueName || `รูปแบบที่ ${sku.id}` }} 
                <span class="text-xs text-gray-400 ml-1">(คงเหลือ {{ sku.stock }})</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 space-y-3">
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">จำนวน:</span>
            <div class="flex items-center border rounded-lg">
              <button @click="quantity > 1 ? quantity-- : null" class="px-3 py-1 bg-gray-100 rounded-l-lg hover:bg-gray-200">-</button>
              <span class="px-4 py-1 text-sm font-semibold">{{ quantity }}</span>
              <button @click="quantity++" class="px-3 py-1 bg-gray-100 rounded-r-lg hover:bg-gray-200">+</button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4">
            <button 
              @click="addToCart"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all"
            >
              🛒 เพิ่มลงตะกร้า
            </button>
            <button 
              @click="buyNow"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all"
            >
              ⚡ ซื้อทันที
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.ts' // ไฟล์ตั้งค่า Supabase SDK ของคุณ

const isLoading = ref(true)
const product = ref(null) // เก็บข้อมูล SPU หลัก
const skuList = ref([])   // เก็บรายการ SKU ทั้งหมดของสินค้านี้
const selectedSku = ref(null) // SKU ที่ลูกค้ากดเลือกอยู่ตอนนี้
const quantity = ref(1)

// สมมติ SPU ID ที่ต้องการดึงข้อมูล (ในงานจริงจะดึงมาจาก Route Param เช่น route.params.id)
const productId = 1 

// --- ฟังก์ชันแปลงราคาสตางค์เป็นบาท (เช่น 1000 สตางค์ = 10 บาท) ---
const formatPrice = (priceInCents) => {
  if (priceInCents === -1 || !priceInCents) return '0.00'
  return (priceInCents / 100).toFixed(2)
}

const fetchProductData = async () => {
  try {
    isLoading.value = true
    
    // 1. ดึงข้อมูลจากตาราง product_spu (เปลี่ยนจาก .single() เป็นใช้ .maybeSingle() หรือหยิบตัวแรกจากอาเรย์)
    const { data: spuData, error: spuError } = await supabase
      .from('product_spu')
      .select('*')
      .eq('id', productId)
      .maybeSingle() // ✨ ใช้ maybeSingle() แทน .single() จะไม่พังถ้าไม่พบข้อมูล (จะคืนค่าเป็น null แทน)

    if (spuError) throw spuError
    
    // บันทึกค่าลงตัวแปร product
    product.value = spuData

    // 2. ถ้าพบสินค้าหลัก ค่อยไปดึงข้อมูล SKU ลูกมาแสดงต่อ
    if (product.value) {
      const { data: skusData, error: skusError } = await supabase
        .from('product_sku')
        .select('*')
        .eq('spu_id', productId)
        .eq('deleted', false)

      if (skusError) throw skusError
      skuList.value = skusData

      if (skuList.value.length > 0 && !product.value.spec_type) {
        selectedSku.value = skuList.value[0]
      }
    }

  } catch (error) {
    console.error('Error fetching product:', error.message)
  } finally {
    isLoading.value = false
  }
}

// --- ฟังก์ชันเลือกตัวเลือกย่อยสินค้า ---
const selectSku = (sku) => {
  selectedSku.value = sku
}

// --- ฟังก์ชันกดเพิ่มลงตะกร้า ---
const addToCart = () => {
  if (product.value.spec_type && !selectedSku.value) {
    alert('กรุณาเลือกรูปแบบสินค้าก่อนครับ!')
    return
  }
  
  const cartItem = {
    spuId: product.value.id,
    skuId: selectedSku.value.id,
    name: product.value.name,
    price: selectedSku.value.price,
    quantity: quantity.value,
    picUrl: selectedSku.value.pic_url
  }
  
  console.log('หยิบใส่ตะกร้าสำเร็จ:', cartItem)
  alert(`เพิ่ม ${cartItem.name} จำนวน ${cartItem.quantity} ชิ้นลงตะกร้าแล้ว!`)
  // ตรงนี้สามารถยิง API ไประบบตะกร้าสินค้าในสเต็ปถัดไปได้เลย
}

const buyNow = () => {
  alert('กำลังพาท่านไปหน้าจ่ายเงิน (Checkout)...')
}

onMounted(() => {
  fetchProductData()
})
</script>