<script setup lang="ts">
import iesImage from '@/assets/IES_Features.png';
</script>

<template>
  <v-card class="ies-banner-card rounded-xl overflow-hidden my-8" elevation="10">
    <div class="banner-gradient-bg">
      <v-row class="ma-0 h-100 align-center">
        
        <!-- 🎯 ฝั่งซ้าย: ข้อความและปุ่ม Call to Action -->
        <v-col cols="12" md="6" class="pa-8 pa-md-12 content-side">
          
          <h2 class="text-white text-h3 text-md-h2 font-weight-black mb-4 line-height-tight">
            พร้อมการจัดแสงสมจริง.<br>
            <span class="text-teal-accent-3">ในทุกๆโมเดล 3D</span>
          </h2>
          
          <p class="text-grey-lighten-2 text-body-1 mb-8 max-w-sm">
            เพิ่มประสิทธิภาพโมเดลให้สมจริงด้วย <strong>IES โปรไฟล์สำเร็จรูป</strong> บันทึกแพทเทิร์นแสงสว่างจากการกระจายแสงของโคมไฟจริงล่วงหน้าบนโมเดล
          </p>          
          <!-- <v-btn 
            color="white" 
            class="text-black font-weight-bold text-none rounded-lg px-6 try-btn" 
            height="48" 
            prepend-icon="mdi-flare" 
            elevation="4"
          >
            สำรวจห้องสมุด IES
          </v-btn> -->
        </v-col>

        <!-- 🎯 ฝั่งขวา: ภาพกราฟิกและ UI ลอยตัว (Glassmorphism) -->
        <v-col cols="12" md="6" class="position-relative pa-0 d-none d-md-flex justify-center align-center h-100">
          
          <div class="graphic-container">
            <!-- 🌟 ใส่รูปภาพ IES ของคุณตรงนี้ -->
            <v-img
              :src=iesImage
              class="ies-main-img rounded-xl elevation-10"
              cover              
            ></v-img>

            <!-- 💬 ป้าย UI ลอยตัว (จำลองแบบภาพอ้างอิง) -->
            <div class="floating-badge glass-panel badge-1">
              <v-icon icon="mdi-check-circle" color="#ccff00" size="small" class="mr-2"></v-icon>
              IES ถูกใช้งาน
            </div>
            
            <div class="floating-badge glass-panel badge-2">
              <v-icon icon="mdi-wall" color="#00E676" size="small" class="mr-2"></v-icon>
              วอลวอช เอฟเฟค
            </div>
            
            <div class="cursor-pointer-mock">
              <v-icon icon="mdi-cursor-default" color="white" size="large"></v-icon>
            </div>
          </div>

        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped>
.ies-banner-card {
  background: #041E34;
    margin: 20px;
}

/* 🎨 ไล่สีพื้นหลังแบบพรีเมียม (Teal to Dark Navy) */
.banner-gradient-bg {
  background: linear-gradient(120deg, #017B74 0%, #033659 45%, #011424 100%);
  position: relative;
  width: 100%;
  height: 100%;

}

.line-height-tight {
  line-height: 1.1 !important;
  letter-spacing: -1px;
}

.max-w-sm {
  max-width: 480px;
}

.content-side {
  position: relative;
  z-index: 2;
}

.try-btn {
  transition: transform 0.2s ease;
}
.try-btn:hover {
  transform: translateY(-2px);
}

/* 🎬 ฝั่งกราฟิกและแอนิเมชัน */
.graphic-container {
  position: relative;
  width: 85%;
  max-width: 550px;
  transform: perspective(1000px) rotateY(-8deg) rotateX(4deg);
  transition: transform 0.5s ease;
}

.graphic-container:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.ies-main-img {
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
  background-color: #000;
}

/* 💠 เอฟเฟกต์กระจกขุ่น (Glassmorphism) */
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 8px 20px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  position: absolute;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

/* 🎈 แอนิเมชันลอยไปมา */
.badge-1 {
  top: -20px;
  left: -20px;
  animation: float 4s ease-in-out infinite;
}

.badge-2 {
  bottom: -20px;
  right: -20px;
  animation: float 5s ease-in-out infinite reverse;
}

.cursor-pointer-mock {
  position: absolute;
  bottom: 30%;
  right: -40px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
  animation: float 3.5s ease-in-out infinite 1s;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}
</style>