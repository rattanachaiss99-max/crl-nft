<script setup lang="ts">
// ไม่ต้องใช้ตัวแปรอะไรเป็นพิเศษสำหรับหน้าตานี้ ยกเว้นจะรับ Props
</script>

<template>
  <div class="hero-banner-wrapper mt-6 mb-8">    
    <v-card class="hero-card rounded-xl" elevation="0">      
        <div class="content-container d-flex flex-column align-center justify-center text-center w-100">
            <h1 class="hero-title text-white font-weight-black mb-2">HIDDEN GEMS</h1>
            <p class="hero-subtitle text-grey-lighten-1 mb-0">
            กิจกรรมสร้างวีดีโอด้วย MCP และฐานข้อมูล RAG เพื่อเร่งผลงานต้นแบบบนโซเชียลมีเดีย
            </p>
        </div>

      <div class="floating-item item-1">💀</div>
      <div class="floating-item item-2">⚡</div>
      <div class="floating-item item-3">❤️</div>
      <div class="floating-item item-4">🪙</div>
      <div class="floating-item item-5">💣</div>

      <div class="characters-container">
        <div class="placeholder-characters">
          <img src="@/assets/Thailand_forrest.png"> 
        </div>
      </div>

      <div class="action-container">
        <v-btn 
          color="white" 
          class="text-black font-weight-bold px-8 rounded-pill hover-scale" 
          size="x-large"
          elevation="4"
        >
          เริ่มการสร้าง
        </v-btn>
      </div>

    </v-card>
  </div>
</template>

<style scoped>
/* 🎨 คอนเทนเนอร์หลัก พร้อมพื้นหลังไล่สี */
.hero-card {
  position: relative;
  width: 100%;
  min-height: 450px;
  background: radial-gradient(circle at 50% 120%, rgba(139, 184, 0, 0.4) 0%, #161616 60%);
  
  /* 🌟 บังคับความหนาของเส้นขอบ และความโค้งให้ชัดเจน ห้ามใครทับ! */
  border: 1px solid rgba(255, 255, 255, 0.1) !important; 
  border-radius: 24px !important; 
  
  overflow: hidden;
}

/* 🎨 ส่วนข้อความด้านบน */
.content-container {
  position: relative;
  z-index: 10;
  padding-top: 48px;
}

.powered-text {
  color: #ff9800; /* สีส้ม */
  letter-spacing: 1px;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem); /* ขยาย/ย่ออัตโนมัติตามขนาดจอ */
  letter-spacing: 0px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 🎨 ส่วนปุ่มด้านล่าง */
.action-container {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20; /* ให้อยู่หน้าสุด ทับรูปตัวละคร */
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

/* 🎨 ส่วนตัวละครตรงกลางด้านล่าง */
.characters-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
}

.character-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.placeholder-characters {
  width: 400px;
  height: 200px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 100px 100px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🎨 เอฟเฟกต์ของลอยตัว (Floating Elements) */
.floating-item {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

/* ตั้งค่าตำแหน่งและการหน่วงเวลาแอนิเมชันให้แต่ละชิ้นไม่พร้อมกัน */
.item-1 { top: 20%; left: 15%; animation-delay: 0s; font-size: 2.5rem; }
.item-2 { top: 15%; right: 20%; animation-delay: 1s; font-size: 3rem; }
.item-3 { top: 50%; left: 25%; animation-delay: 0.5s; font-size: 3rem; }
.item-4 { top: 60%; right: 25%; animation-delay: 1.5s; font-size: 2.5rem; }
.item-5 { bottom: 25%; right: 15%; animation-delay: 0.8s; }

/* Keyframes สำหรับให้ลอยขึ้น-ลง */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

/* Responsive สำหรับมือถือ */
@media (max-width: 600px) {
  .floating-item { font-size: 1.5rem !important; }
  .item-1 { left: 5%; }
  .item-2 { right: 5%; }
  .item-3 { left: 10%; top: 40%; }
  .item-4 { right: 10%; top: 50%; }
}
</style>