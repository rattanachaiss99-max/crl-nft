<template>
  <div class="redeem-section-card">
    <div class="section-header">      
      <span class="gift-icon">🎁</span>
      <h3>Shop & Redeem Rewards</h3>      
    </div>

    <div class="network-switcher-wrapper">
      <SwitchNetwork />
    </div>

    <div class="exchange-rate-info-box">
      <div class="info-icon">💱</div>
      <div class="info-text">
        <p class="rate-highlight">
          1 {{ displayUnit }} = {{ currentRateFormatted }} THB
        </p>
        <p class="rate-date">
          *อัตราแลกเปลี่ยนอ้างอิง ณ วันที่: <strong>{{ lastUpdatedDate }}</strong>
        </p>
      </div>
    </div>

    <div class="rewards-shop-grid">
      <div v-for="item in rewardItems" :key="item.id" class="shop-item-card">
        <div class="item-thumbnail">{{ item.image }}</div>
        
        <div class="item-details">
          <h4 class="item-title">{{ item.name }}</h4>
          <p class="item-desc">{{ item.description }}</p>
          
          <div class="stock-status" :class="{ 'out-of-stock': item.stock === 0 }">
            {{ item.stock > 0 ? `คงเหลือ: ${item.stock} ชิ้น` : '🔴 สินค้าหมดชั่วคราว' }}
          </div>
        </div>

        <div class="item-action-area">
          <div class="price-tag">
            <span class="price-num">{{ getConvertedPrice(item.priceTHB) }}</span>
            <span class="price-unit">{{ displayUnit }}</span>
          </div>
          <div class="base-price-hint">
            (มูลค่า {{ item.priceTHB.toLocaleString() }} THB)
          </div>
          
          <button 
            @click="handleRedeem(item)" 
            class="btn-redeem"
            :disabled="isProcessing || item.stock === 0 || checkInsufficientBalance(item.priceTHB)"
          >
            {{ checkInsufficientBalance(item.priceTHB) ? 'ยอดไม่พอ' : '🎟️ แลกรางวัล' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isProcessing" class="loading-overlay">
      <div class="spinner"></div>
      <p>กำลังตรวจสอบสิทธิ์และตัดยอด...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { supabase } from '@/utils/supabase';
import { useAccount } from '@wagmi/vue'; 
import SwitchNetwork from './SwitchNetwork.vue'; 

const props = defineProps({
  userAddress: { type: String, required: true },
  globalPoints: { type: Number, default: 0 } // ยอดคงเหลือในกระเป๋าของผู้ใช้
});

const emit = defineEmits(['redeem-success']);
const isProcessing = ref<boolean>(false);
const { chain } = useAccount();

// ----------------------------------------------------
// ⚙️ ตั้งค่าเรทราคาอ้างอิง (แก้ไขตัวเลขและวันที่ตรงนี้ได้เลย)
// ----------------------------------------------------
const lastUpdatedDate = "7 มิถุนายน 2026";
const exchangeRates: Record<string, number> = {
  'ETH': 57000,
  'BNB': 21000,
  'MATIC': 3.6,
  'USDT': 36,
  'PTS': 1 // 1 แต้ม PTS = 1 บาท (ค่าเริ่มต้นกรณีไม่ได้ต่อเป๋า)
};

// ----------------------------------------------------
// 🧠 Logic คำนวณต่างๆ
// ----------------------------------------------------
const displayUnit = computed(() => {
  return chain.value?.nativeCurrency?.symbol || 'PTS';
});

// ดึงเรทราคาของเหรียญที่กำลังเลือกอยู่
const currentRate = computed(() => {
  return exchangeRates[displayUnit.value] || exchangeRates['PTS'];
});

const currentRateFormatted = computed(() => {
  return currentRate.value.toLocaleString();
});

// ฟังก์ชันแปลงเงินบาท (THB) เป็นจำนวนเหรียญคริปโต
const getConvertedPrice = (priceTHB: number) => {
  const cryptoAmount = priceTHB / currentRate.value;
  
  // จัดรูปแบบทศนิยม: เหรียญแพงๆ (เช่น ETH) ให้โชว์ทศนิยม 4-5 ตำแหน่ง เหรียญถูกๆ โชว์แค่ 2 ตำแหน่ง
  if (cryptoAmount < 0.01) return cryptoAmount.toFixed(5);
  if (cryptoAmount < 1) return cryptoAmount.toFixed(4);
  return cryptoAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// เช็กว่ายอดในกระเป๋าพอจ่ายหรือไม่
const checkInsufficientBalance = (priceTHB: number) => {
  const requiredAmount = priceTHB / currentRate.value;
  return props.globalPoints < requiredAmount;
};

// ----------------------------------------------------
// 🎁 ข้อมูลของรางวัล (เปลี่ยนมาใช้ base price เป็น THB)
// ----------------------------------------------------
interface RewardItem {
  id: number;
  name: string;
  description: string;
  priceTHB: number; // ✨ เปลี่ยนตัวแปรให้ชัดเจนว่าเป็นราคาตั้งต้นแบบบาท
  stock: number;
  image: string; 
}

const rewardItems = ref<RewardItem[]>([
  { id: 1, name: 'Steam Wallet 50 THB', description: 'โค้ดเติมเงินระบบ Steam', priceTHB: 60, stock: 12, image: '🎮' },
  { id: 2, name: 'สิทธิ์เลือกเกมสตรีมถัดไป', description: 'โหวตเลือกเกมในไลฟ์ถัดไป', priceTHB: 150, stock: 99, image: '🎬' },
  { id: 3, name: 'Exclusive Discord Role', description: 'ยศพิเศษสีทองในดิสคอร์ด', priceTHB: 300, stock: 50, image: '👑' },
  { id: 4, name: 'เสื้อยืด Limited Edition', description: 'เสื้อยืดสกรีนลายพิเศษ', priceTHB: 590, stock: 0, image: '👕' },
]);

// ----------------------------------------------------
// 🔒 ลอจิกการทำธุรกรรม
// ----------------------------------------------------
const handleRedeem = async (item: RewardItem) => {
  if (!props.userAddress) {
    alert('❌ กรุณาเชื่อมต่อกระเป๋าเงินก่อน');
    return;
  }

  const exactCryptoCost = item.priceTHB / currentRate.value;

  if (props.globalPoints < exactCryptoCost) {
    alert(`❌ ยอด ${displayUnit.value} ของคุณไม่เพียงพอ`);
    return;
  }

  const confirmMsg = `ยืนยันการแลก "${item.name}"\nจ่ายด้วย: ${getConvertedPrice(item.priceTHB)} ${displayUnit.value}\n(เทียบเท่า ${item.priceTHB} บาท)`;
  if (!confirm(confirmMsg)) return;

  isProcessing.value = true;

  try {
    const { data, error } = await supabase.rpc('secure_redeem_points', {
      row_wallet: props.userAddress.toLowerCase(),
      // ⚠️ ส่งยอด Crypto ที่หักจริงไปยัง Database (แนะนำให้ปรับ Backend ให้รับค่าเป็น Float/Decimal ด้วย)
      cost_amount: exactCryptoCost, 
      token_symbol: displayUnit.value // ส่งหน่วยไปเก็บบันทึกด้วย
    });

    if (error) throw error;

    alert(`🎉 แลกรางวัลสำเร็จ! ทีมงานจะรีบจัดส่งให้ครับ`);
    item.stock--;
    emit('redeem-success');

  } catch (error: any) {
    console.error('Redeem system failure:', error);
    alert('เกิดข้อผิดพลาดในการหักยอด');
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.exchange-rate-info-box {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  font-size: 24px;
}

.rate-highlight {
  margin: 0;
  font-weight: bold;
  color: #fff;
  font-size: 1.1rem;
}

.rate-date {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.base-price-hint {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 4px;
  margin-bottom: 8px;
  text-align: center;
}

.redeem-section-card {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 20px;
  color: #ffffff;
  position: relative;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  border-bottom: 1px solid #374151;
  padding-bottom: 10px;
}
.section-header h3 { margin: 0; font-size: 16px; font-weight: 700; }

/* 🧱 จัดผังกล่องของรางวัลเรียงต่อกันเป็นคอลัมน์แนวตั้ง เลื่อนดูง่าย */
.rewards-shop-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px; /* จำกัดความสูงเปิด Scroll ภายในตัวเองได้ */
  overflow-y: auto;
  padding-right: 6px;
}

/* ดีไซน์แถบการ์ดของรางวัลแต่ละชิ้น */
.shop-item-card {
  display: flex;
  align-items: center;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 12px;
  padding: 12px;
  gap: 16px;
  transition: border-color 0.2s;
}
.shop-item-card:hover { border-color: #4b5563; }

.item-thumbnail {
  font-size: 32px;
  background: #1f2937;
  padding: 10px;
  border-radius: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-details { flex: 1; }
.item-title { margin: 0 0 4px 0; font-size: 14px; color: #ffffff; font-weight: 600; }
.item-desc { margin: 0 0 6px 0; font-size: 11.5px; color: #9ca3af; line-height: 1.3; }

.stock-status { font-size: 11px; color: #10b981; font-weight: bold; }
.stock-status.out-of-stock { color: #ef4444; }

/* โซนราคารวมถึงปุ่มกด */
.item-action-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.price-tag { display: flex; align-items: baseline; gap: 4px; }
.price-num { font-size: 18px; font-weight: 800; color: #f59e0b; } /* สีทองอร่าม */
.price-unit { font-size: 10px; color: #9ca3af; font-weight: bold; }

.btn-redeem {
  background: #10b981;
  color: white;
  border: none;
  padding: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-redeem:hover:not(:disabled) { background: #059669; }
.btn-redeem:disabled { background: #4b5563; color: #9ca3af; cursor: not-allowed; opacity: 0.6; }

/* ⏳ สไตล์หน้าต่าง Loading บังไม่ให้กดปุ่มอื่นตอนรันลอจิกค้าง */
.loading-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(17, 24, 39, 0.85);
  border-radius: 16px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; font-size: 13px; color: #9ca3af;
}
.spinner {
  width: 32px; height: 32px; border: 4px solid #374151; border-top-color: #10b981;
  border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>