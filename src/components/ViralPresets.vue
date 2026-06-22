<script setup lang="ts">
import { ref } from 'vue';

// 🌟 Mock Data: รายการแท็บตัวกรอง
const filterTags = ref([
  'BASEBALL GAME', 'DRIFT RACING', 'CGI BREAKDOWN', 'FOOTBALL INVADER', 
  'SUMMER HAZE', 'KUNG FU HIT', 'FINAL SERVE', 'ANDROID ASSEMBLE', 
  '3D RENDER', 'STORM GIANT', 'BLUE DEPTH'
]);

// ตัวแปรเก็บค่าแท็บที่ถูกเลือก (Default คือ 0 หรือแท็บแรก)
const selectedTag = ref(0);

// 🌟 Mock Data: รายการวิดีโอ (ใช้รูปแนวตั้ง 9:16 แทนชั่วคราว)
const videoItems = ref([
  { id: 1, thumbnail: 'https://picsum.photos/seed/vid1/400/700' },
  { id: 2, thumbnail: 'https://picsum.photos/seed/vid2/400/700' },
  { id: 3, thumbnail: 'https://picsum.photos/seed/vid3/400/700' },
  { id: 4, thumbnail: 'https://picsum.photos/seed/vid4/400/700' },
  { id: 5, thumbnail: 'https://picsum.photos/seed/vid5/400/700' },
  { id: 6, thumbnail: 'https://picsum.photos/seed/vid6/400/700' },
]);
</script>

<template>
  <div class="viral-presets-wrapper py-6">    
    <div class="mb-4">
      <h2 class="neon-title">ไวรัลเร่งด่วนสำเร็จรูป</h2>
      <p class="text-grey-lighten-1 text-body-2 mt-1">
        เทคนิคพิเศษสุดอลังการ งบประมาณมหาศาล ตั้งแต่ระเบิดไปจนถึงการแปลงร่างเหนือจริง
      </p>
    </div>

    <div class="video-scroll-container">
      <v-card
        v-for="video in videoItems"
        :key="video.id"
        class="video-card mx-1"
        elevation="0"
        color="transparent"
      >
        <v-img
          :src="video.thumbnail"
          aspect-ratio="9/16"
          cover
          class="rounded-xl video-image"
        ></v-img>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.viral-presets-wrapper {
  width: 95%;
  overflow: hidden; /* ป้องกันไม่ให้แกน X ล้นจนหน้าเว็บพัง */
  margin-left: 20px;
  margin-right: 20px;
  padding: 0px;
}

/* 🎨 ตกแต่งหัวข้อสีสะท้อนแสง */
.neon-title {
  color: #ccff00; /* สีเหลืองอมเขียวสะท้อนแสงตามรูปภาพ */
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

/* 🎨 ตกแต่งปุ่ม Filter (Chip) */
.filter-chip {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #9e9e9e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.chip-active {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

/* 🎨 ตกแต่งแกลลอรี่วิดีโอแบบเลื่อนแนวนอน */
.video-scroll-container {
  display: flex;
  overflow-x: hidden;
  gap: 8px; /* ระยะห่างระหว่างวิดีโอ */
  padding-bottom: 12px;
  scrollbar-width: none; /* สำหรับ Firefox */
  -ms-overflow-style: none;  /* สำหรับ IE/Edge */
}

.video-scroll-container::-webkit-scrollbar {
  display: none; /* สำหรับ Chrome, Safari และ Opera */
}

.video-card {
  flex: 0 0 auto; /* บังคับไม่ให้รูปโดนบีบขนาด */
  width: 240px; /* กำหนดความกว้างของแต่ละวิดีโอ (ปรับขนาดได้ตามต้องการ) */
  cursor: pointer;
  transition: transform 0.2s ease;
}

.video-card:hover .video-image {
  transform: scale(1.02); /* เอฟเฟกต์ซูมเข้าเล็กน้อยตอนเอาเมาส์ชี้ */
  transition: transform 0.3s ease;
}

.video-image {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Override ปุ่มลูกศรของ v-slide-group ให้เข้ากับตีมมืด */
:deep(.v-slide-group__next),
:deep(.v-slide-group__prev) {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  min-width: 32px;
  height: 32px;
  margin-top: auto;
  margin-bottom: auto;
}
</style>