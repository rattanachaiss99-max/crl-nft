<template>
  <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
    <div class="text-center mb-8 position-relative">
      <v-chip text-color="white" class="mb-4">
        <v-icon icon="mdi-white-balance-sunny" size="small" class="mr-2"></v-icon>การใช้ LoRA
      </v-chip>
      
      <h2 class="text-orange text-h4 font-weight-black text-uppercase mb-2" style="letter-spacing: -0.5px;">
        สร้างรูปภาพรถจากการฝึก
      </h2>

      <p class="text-caption text-grey-lighten-1 mt-1" style="line-height: 1.5; margin: 0;">
        เส้นทางการสอน AI: Cyberpunk Neon Drift
      </p>
    </div>

    <div class="mb-5">
      <p class="text-caption text-grey-lighten-1 font-weight-bold tracking-wider mb-2 d-flex align-center">
        <v-icon icon="mdi-folder-image" size="14" class="mr-1"></v-icon> ชุดภาพต้นฉบับที่ใช้สอน AI (Training Dataset)
      </p>
      <div class="dataset-gallery">
        <div v-for="(img, index) in imageItems" :key="index" class="gallery-item">
          <v-img :src="img.thumbnail" cover class="rounded aspect-square"></v-img>
        </div>
        <div class="gallery-item more-images d-flex align-center justify-center rounded bg-grey-darken-4">
          <span class="text-caption font-weight-bold text-grey-lighten-1">+15 รูป</span>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4" style="border-top: 1px dashed rgba(255,255,255,0.1);">
      <button 
        @click="generateLoraRenderDirectly" 
        :disabled="isLoading" 
        class="custom-html-render-btn w-100 d-flex justify-center align-center"
      >
        <v-progress-circular v-if="isLoading" indeterminate size="20" class="mr-2" color="white"></v-progress-circular>
        <v-icon v-else icon="mdi-magic-staff" class="mr-2"></v-icon>
        {{ isLoading ? 'กำลังดึงมิติรถ 3D และแปลงภาพขั้นสูง...' : 'เสกสไตล์นี้ลงบนรถ 3D ของฉันทันที!' }}
      </button>
        <p class="text-caption text-grey-lighten-1 mt-1" style="line-height: 1.5; margin: 0;">
        รูปภาพใช้เวลา 2-5 นาที ในการเรนเดอร์
      </p>      

    </div>

    <v-expand-transition>
      <div v-if="aiRenderedImage" class="w-100 d-flex flex-column align-center mt-5 pt-4" style="border-top: 1px solid rgba(16, 185, 129, 0.2);">
        <v-card
          variant="flat"
          class="w-100 pa-4 rounded-xl border"
          style="background: linear-gradient(to bottom, rgba(16, 185, 129, 0.04), transparent); border-color: rgba(16, 185, 129, 0.2) !important;"
        >
          <p class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center" style="color: #10b981;">
            <v-icon icon="mdi-check-decagram" class="mr-2"></v-icon>
            ผลลัพธ์ภาพรถที่พ่นทับด้วย Custom LoRA ของคุณ:
          </p>
          <div class="mx-auto" style="max-width: 700px; width: 100%;">
            <v-img
              :src="aiRenderedImage"
              class="rounded-lg shadow-2xl border"
              style="border-color: #1e293b;"
              alt="Custom LoRA Masterpiece"
            ></v-img>
          </div>
        </v-card>
      </div>
    </v-expand-transition>

  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'

const userCredits = ref(0)
const isLoading = ref(false)
const aiRenderedImage = ref(null)
const triggerWord = 'CyberStyle'
const loraFileName = 'xrag_style'
const isWatchingAd = ref(false)
const countdown = ref(30)
const isRewardReady = ref(false)
let timerInterval = null
const imageItems = ref([
  { id: 1, thumbnail: '/Model/car_1.png' },
  { id: 2, thumbnail: '/Model/car_2.png' },
  { id: 3, thumbnail: '/Model/car_3.png' },
  { id: 6, thumbnail: '/Model/car_4.png' },
]);

onMounted(() => {
  const adScript = document.createElement('script')
  adScript.type = 'text/javascript'
  adScript.async = true
  adScript.setAttribute('data-cfasync', 'false')
  adScript.src = 'https://pl29800239.effectivecpmnetwork.com/b2e903c6caf317aeae948a9ccfa94a24/invoke.js'
  document.head.appendChild(adScript)
})

const startRewardAdTimer = () => {
  isWatchingAd.value = true
  isRewardReady.value = false
  countdown.value = 30 

  // 🚀 1. ใช้เทคนิคสร้างแท็ก script ชั่วคราวเพื่อรันและกระตุ้นโฆษณา Direct Link ของพี่ทันที
  const triggerScript = document.createElement('script')
  triggerScript.type = 'text/javascript'
  triggerScript.src = 'https://pl29800238.effectivecpmnetwork.com/fe/c9/ee/fec9eede1a6599214ce87248bf89d09f.js'
  document.head.appendChild(triggerScript)

  // 🌎 2. สั่งเปิดหน้าต่างสำรองเผื่อไว้ เพื่อให้มั่นใจว่าหน้าโฆษณาเด้งและระบบนับยอดแน่นอน
  window.open('https://www.effectivecpmnetwork.com/w7mgfvn4v?key=ebf950be52fddde599d1ed0410e6a0b5', '_blank')

  // ⏳ 3. เริ่มนับถอยหลัง 30 วินาทีบนหน้าเว็บเรา
  timerInterval = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--
    } else {
      clearInterval(timerInterval)
      isRewardReady.value = true 
    }
  }, 1000)
}

const claimRewardCredit = () => {
  userCredits.value += 1 
  isWatchingAd.value = false 
  isRewardReady.value = false
  alert('ขอบคุณที่สนับสนุนเราครับพี่! ได้รับเครดิตเสกภาพรถซิ่งเพิ่ม 1 สิทธิ์แล้วครับ 🏎️💨')
}

const generateLoraRenderDirectly = async () => {
  isLoading.value = true
  aiRenderedImage.value = null 

  try {
    const finalPrompt = `A stunning cinematic photograph of a custom sports car, ${triggerWord}, dark neon city background, wet road reflecting lights, highly detailed, 8k resolution, masterpiece, <lora:${loraFileName}:0.8>`
    const payload = {
      prompt: finalPrompt
    }

    const response = await fetch('https://rattana99-cyber-car-lora.hf.space/api/generate-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const result = await response.json()
      aiRenderedImage.value = result.ai_image_url
    } else {
      console.error("🚨 เซิร์ฟเวอร์ประมวลผลล้มเหลว")
    }

  } catch (err) {
    console.error("🚨 เกิดปัญหาในการยิง API:", err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.reward-ad-box {
  background-color: #1a1a1a;
  border-color: #333 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); box-shadow: 0 0 15px #28a745; }
  100% { transform: scale(1); }
}
.animate-pulse {
  animation: pulse 1.5s infinite;
}
.video-scroll-container {
  display: flex;
  overflow-x: hidden;
  gap: 8px;
  padding-bottom: 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.video-scroll-container::-webkit-scrollbar {
  display: none;
}
.aspect-square { aspect-ratio: 9 / 16; }
.dataset-gallery { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.gallery-item { position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); transition: transform 0.2s ease; }
.gallery-item:hover { transform: scale(1.05); border-color: #10b981; z-index: 10; }
.more-images { border: 1px dashed rgba(255, 255, 255, 0.2); }
</style>