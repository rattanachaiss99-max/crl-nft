<script setup lang="ts">
import { ref } from 'vue';
import sportVideo from '@/assets/sports_highlight.mp4';
import anim from '@/assets/anim.mp4';
import recraft from '@/assets/recraft.mp4'

const galleryItems = ref([
  {
    id: 1,
    title: 'ภาพกีฬามันส์ๆ ช็อตเด็ด',
    subtitle: 'เฉพาะที่ Previs ผ่าน Higgsfield',
    type: 'video', // ✨ กำหนดว่าเป็นวิดีโอ
    mediaUrl: sportVideo,
  },
  {
    id: 2,
    title: 'การปรับแสงผ่าน DAVINCI RESOLVE',
    subtitle: 'สร้างฟุตเทจในไทม์ไลน์ของคุณ วาดลงบนคลิปเพื่อแก้ไข และใช้เทคนิคที่สร้างโดย AI...',
    type: 'video', // ✨ กำหนดว่าเป็นวิดีโอ
    mediaUrl: anim,
  },
  {
    id: 3,
    title: 'เริ่มต้น RECRAFT 4.1',
    subtitle: 'เวกเตอร์คมชัด ความสวยงามประณีต ควบคุมสไตล์ได้อย่างสมบูรณ์แบบ',
    type: 'video', // ✨ กำหนดว่าเป็นวิดีโอ
    mediaUrl: recraft,
  },
  {
    id: 4,
    title: 'เทคนิคการทำ VFX ขั้นสูง',
    subtitle: 'ยกระดับงานวิดีโอของคุณด้วยเอฟเฟกต์ระดับภาพยนตร์ที่สร้างด้วย AI ภายในไม่กี่วินาที',
    type: 'video', // ✨ กำหนดว่าเป็นวิดีโอ
    mediaUrl: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeibkc7gej3cc565t5a4tlfj2fswfltidj4iuawrc3jmseqa2772gbu',
  },
  {
    id: 5,
    title: 'การสร้างแอนิเมชันตัวละคร 3 มิติ',
    subtitle: 'เรนเดอร์โมเดลสมจริง พร้อมกำหนดการเคลื่อนไหวที่เป็นธรรมชาติได้ง่ายกว่าที่เคย',
    type: 'video', // ✨ กำหนดว่าเป็นวิดีโอ
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // ใส่ URL วิดีโอ (.mp4, .webm)
  }
]);
</script>

<template>
  <div class="gallery-wrapper py-4">
    <div class="gallery-scroll-container">
      <div
        v-for="item in galleryItems"
        :key="item.id"
        class="cursor-pointer gallery-card"
      >
        <div class="media-container mb-3">          
          <video
            v-if="item.type === 'video'"
            :src="item.mediaUrl"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
            class="rounded-lg border-thin border-opacity-25 custom-media"
          ></video>
          <v-img
            v-else
            :src="item.mediaUrl"
            cover
            class="rounded-lg border-thin border-opacity-25 custom-media"
          ></v-img>
        </div>
        <div class="text-content px-1">
          <h3 class="gallery-title text-uppercase text-white text-truncate">
            {{ item.title }}
          </h3>
          <p class="gallery-subtitle text-grey-lighten-1 mt-1 text-truncate">
            {{ item.subtitle }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-media {
  width: 100%;
  aspect-ratio: 16 / 9; 
  object-fit: cover !important;
  display: block;
}

.gallery-wrapper {
  width: 95%;
  margin-left: 20px;
  overflow: hidden;
  padding-bottom: 0px;
  margin-top: 10px;
}

.gallery-scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 5px;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.gallery-scroll-container::-webkit-scrollbar {
  display: none;
}

.gallery-card {
  flex: 0 0 auto;
  width: 320px;
  background: transparent !important; /* ล็อกความโปร่งใสซ้อนอีกชั้น */
  transition: transform 0.2s ease;
}

.gallery-card:hover {
  transform: translateY(-2px); /* เพิ่มลูกเล่นเวลานำเมาส์ไปชี้ */
}

.gallery-card:hover .custom-media {
  opacity: 0.85;
}

.gallery-title {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 0px;
}

.gallery-subtitle {
  font-size: 0.8rem;
}

.neon-title {
  color: #ccff00;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}
</style>