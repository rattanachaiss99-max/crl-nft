<script setup lang="ts">
// ไม่ต้องใช้ตัวแปรพิเศษสำหรับ UI นี้
</script>

<template>
  <div class="feature-banner-wrapper py-6">
    <v-card class="banner-card overflow-hidden" elevation="0" style="border-radius: 24px !important;">      
      <v-row no-gutters class="fill-height">        
        <v-col cols="12" md="5" lg="6" class="d-flex flex-column justify-center pa-8 pa-md-12 banner-content-col">          
          <div class="feature-badge text-uppercase font-weight-bold mb-3 d-flex align-center">
            <span class="text-teal-accent-3 letter-spacing-1">ฟีเจอร์ใหม่</span>
          </div>          
          <h2 class="banner-title text-white font-weight-black mb-4">
            หนึ่งฐานข้อมูล.<br>เพื่อสร้างสรรค์ AI.
          </h2>          
          <p class="banner-subtitle text-white mb-8">
            รวบรวมไอเดีย สร้างเวิร์กโฟลว์ และแชร์กับทีมของคุณ<br class="d-none d-sm-block">ครบจบบนกระดานทำงานเดียว
          </p>          
          <div>
            <v-btn 
              class="font-weight-bold px-6 text-none" 
              size="large" 
              prepend-icon="mdi-creation"
              elevation="2"
              style="background-color: #ffffff !important; color: #000000 !important; border-radius: 8px !important;"
            >
              ล็อกอินตอนนี้
            </v-btn>
          </div>
          
        </v-col>

        <v-col cols="12" md="7" lg="6" class="d-none d-md-block position-relative">
          
          <div class="graphics-container h-100 w-100 position-relative">
            
            <div class="mock-element mock-sticky pa-3 elevation-4">
              <p class="text-caption text-black mb-0 font-weight-medium">
                มาสร้างวิดีโอที่ดึงดูดใจสำหรับแบรนด์ของเรากันเถอะ<br>@ADMIN กรุณาอัปโหลดรูปภาพ
              </p>
            </div>

            <div class="mock-element mock-text-ok font-weight-black">
              OK <v-icon icon="mdi-cursor-default" size="small" class="ml-1"></v-icon>
            </div>

            <div class="mock-element mock-img-card img-card-1 elevation-6 overflow-hidden">
              <div class="mock-header text-caption px-2 py-1 text-grey-lighten-1">
                <v-icon icon="mdi-image-outline" size="x-small"></v-icon> สร้างรูปภาพ
              </div>
              <v-img src="https://picsum.photos/seed/model1/300/400" cover class="h-100"></v-img>
            </div>

            <div class="mock-element mock-chat-gloria px-3 py-1 elevation-2">
              <span class="text-caption text-white font-weight-medium">ภาพนี้<br>นี่มันสุดยอดมาก!</span>
            </div>

            <div class="mock-element mock-img-card img-card-2 elevation-6 overflow-hidden">
              <div class="mock-header text-caption px-2 py-1 text-grey-lighten-1">
                <v-icon icon="mdi-video-outline" size="x-small"></v-icon> สร้างวีดีโอด้วย AI 
              </div>
              <v-img src="https://picsum.photos/seed/fashion2/300/200" cover class="h-100"></v-img>
            </div>

            <div class="mock-element mock-input px-4 py-2 elevation-4 d-flex align-center">
              <span class="text-caption text-white">Type something</span>
              <span class="cursor-blink ml-1">|</span>
            </div>

          </div>

        </v-col>

      </v-row>
    </v-card>
  </div>
</template>

<style scoped>
.feature-banner-wrapper {
    margin-left: 10px;
    margin-right: 10px;
    padding: 0px;
}
/* 🎨 พื้นหลังไล่สี (Gradient) */
.banner-card {
  background: linear-gradient(90deg, #017a8b 0%, #001a4d 100%) !important;
  min-height: 380px;
}

.banner-content-col {
  position: relative;
  z-index: 10;
}

/* 🎨 ส่วนข้อความ */
.letter-spacing-1 {
  letter-spacing: 1.5px;
}

.banner-title {
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.5px;
  margin: 0px;
}

.banner-subtitle {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.85;
}

/* 🎨 ระบบกราฟิกจำลองฝั่งขวา (UI Mockup Elements) */
.graphics-container {
  overflow: visible;
}

.mock-element {
  position: absolute;
  z-index: 5;
}

/* 🌟 ล็อกสีและโครงสร้าง UI แฟนซี ด้วย !important */

/* กระดาษโพสต์อิทสีฟ้า */
.mock-sticky {
  background-color: #8bb8fc !important;
  width: 180px;
  bottom: -20px;
  left: 10%;
  transform: rotate(-5deg);
  border-radius: 2px !important;
  box-shadow: 2px 4px 10px rgba(0,0,0,0.2);
}

/* คำว่า OK สีเขียว */
.mock-text-ok {
  color: #a0d84a !important;
  font-size: 2.5rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  top: 15%;
  left: 20%;
  transform: rotate(-10deg);
}

/* การ์ดรูปภาพแบบมีกรอบเขียว */
.mock-img-card {
  background-color: transparent !important;
  border: 4px solid #10b981 !important; /* บังคับกรอบสีเขียว */
  border-radius: 24px !important;
}

.mock-header {
  background-color: #001a4d !important;
}

/* การ์ดรูปแนวตั้ง (ซ้าย) */
.img-card-1 {
  width: 220px;
  height: 300px;
  top: 10%;
  left: 40%;
  z-index: 6;
}

/* การ์ดรูปแนวนอน (ขวา) */
.img-card-2 {
  width: 240px;
  height: 160px;
  top: 15%;
  right: -20px;
  z-index: 4;
}

/* แชทสีเขียว Gloria */
.mock-chat-gloria {
  background-color: #10b981 !important;
  border-radius: 24px !important;
  top: 25%;
  right: 15%;
  z-index: 7;
}

/* ช่องพิมพ์ข้อความ */
.mock-input {
  background-color: #3b82f6 !important;
  border-radius: 50px !important;
  bottom: 20%;
  right: 10%;
  z-index: 8;
  border: 1px solid rgba(255,255,255,0.2) !important;
}

/* เคอร์เซอร์กระพริบในช่องพิมพ์ */
.cursor-blink {
  color: white;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>