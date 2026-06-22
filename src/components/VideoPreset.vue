<script setup lang="ts">
import { ref, computed } from 'vue';
import evilDead from '@/assets/evilDead.mp4';
import jackGroovy from '@/assets/JackGroovy.mp4';
import narin from '@/assets/narin.mp4';
import rapan from '@/assets/rapan.mp4';

// 🌟 รายการแท็บตัวกรองกิจกรรม
const filterTags = ref([
  'ทั้งหมด', 'กิจกรรมล่าสุด','ไฮไลท์เด็ด','คอมมูนิตี้'
]);
const selectedTag = ref(0);

const videoItems = ref([
  { 
    id: 1, 
    category: 'กิจกรรมล่าสุด',
    title: 'วิญญาณตามติด', 
    description: 'ร่วมสนุกกับกิจกรรมใหม่ล่าสุด เคลียร์ภารกิจรับไอเทมสุดแรร์ทันทีแบบไม่มีเงื่อนไข!',
    thumbnailUrl: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeihfqmo7sdwl7aswx3g222mrtkxwfy5tqskcr6ugikuruwzteiqyxq', 
    videoUrl: evilDead
  },
  { 
    id: 2, 
    category: 'ไฮไลท์เด็ด',
    title: 'นักล่าสมบัติสุดมั่น', 
    description: 'ประกาศผลผู้โชคดีที่ได้รับรางวัลใหญ่ประจำสัปดาห์นี้ เช็คชื่อด่วน!',
    thumbnailUrl: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeicmzuqtavtila4pbyxzcc5ltkx7bl44aahiea5equie5qsotrhhhm', 
    videoUrl: jackGroovy
  },
  { 
    id: 3, 
    category: 'ไฮไลท์เด็ด',
    title: 'รินนักสำรวจ', 
    description: 'แอบดูฟีเจอร์ใหม่ที่กำลังจะเข้ามาในเดือนหน้า เตรียมตัวให้พร้อม!',
    thumbnailUrl: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeigt23pyztlrpwz66rlg6zgewc5ltz4mtru6w67rfbsuxqbplc5vsi',
    videoUrl: narin
  },
  { 
    id: 4, 
    category: 'ไฮไลท์เด็ด',
    title: 'พรานพจญภัย', 
    description: 'รวบรวมจังหวะสุดฮาและสุดเทพจากทางบ้าน ส่งคลิปของคุณมาร่วมสนุกได้เลย',
    thumbnailUrl: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeibd34wyi2wthfyzso4x2ixjrz37pe3twsash5jgjz2p5cjohmr7aa',
    videoUrl: rapan
  },
  { 
    id: 5, 
    category: 'คอมมูนิตี้',
    title: 'วีดีโอป่ามุมสูงในไทย', 
    description: 'เจาะลึกเบื้องหลังการออกแบบและใส่เอฟเฟกต์ให้กับตัวละครโปรดของคุณ',
    thumbnailUrl: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeif4tuz4c77dbpvcmvy2ybkqea5vo6vt63k26ertsudusicwnkyaxa',
    videoUrl: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeif4tuz4c77dbpvcmvy2ybkqea5vo6vt63k26ertsudusicwnkyaxa'
  }
]);

// 🌟 ฟังก์ชันสำหรับ Filter ข้อมูลตามแท็บที่เลือก
const filteredVideos = computed(() => {
  if (selectedTag.value === 0) return videoItems.value; // 'ทั้งหมด'
  const currentCategory = filterTags.value[selectedTag.value];
  return videoItems.value.filter(video => video.category === currentCategory);
});

// 🌟 ตัวแปรสำหรับคุม Modal
const isModalOpen = ref(false);
const activeVideo = ref<any>(null);

// ฟังก์ชันเปิด Modal พร้อมส่งข้อมูลวิดีโอเข้าไป
const openVideoModal = (video: any) => {
  activeVideo.value = video;
  isModalOpen.value = true;
};
// 🌟 [เพิ่มใหม่] ข้อมูลสำหรับปุ่มเลือกสัดส่วน (Aspect Ratio)
const selectedRatio = ref('9:16');
const ratios = ref([
  { value: '16:9', label: '16:9', icon: 'mdi-rectangle-outline' },
  { value: '1:1', label: '1:1', icon: 'mdi-square-outline' },
  { value: '9:16', label: '9:16', icon: 'mdi-cellphone' }
]);
</script>

<template>
  <div class="activities-wrapper py-6">    
    <div class="mb-4">
      <h2 class="fire-title d-flex align-center">
        กิจกรรมฮิตขณะนี้ <span class="fire-icon ml-2">🔥</span>
      </h2>
      <p class="text-grey-lighten-1 text-body-2 mt-1">
        Hidden Gems : เนื้อหาวีดีโอกิจกรรมเริ่มขึ้นแล้ว !!
      </p>
    </div>
    <div class="mb-4">
      <v-slide-group v-model="selectedTag" show-arrows class="custom-slide-group">
        <v-slide-group-item
          v-for="(tag, index) in filterTags"
          :key="index"
          v-slot="{ isSelected, toggle }"
        >
          <v-chip
            :class="['filter-chip mx-1', isSelected ? 'chip-active' : '']"
            variant="outlined"
            @click="toggle"
          >
            {{ tag }}
          </v-chip>
        </v-slide-group-item>
      </v-slide-group>
    </div>
    <div class="video-scroll-container">
      <div
        v-for="video in filteredVideos"
        :key="video.id"
        class="video-card mx-1"
        @click="openVideoModal(video)"
      >
        <video
          :src="video.thumbnailUrl"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
          class="rounded-xl video-thumbnail"
        ></video>
        
        <div class="video-overlay rounded-b-xl d-flex align-end pa-3">
          <span class="text-white text-caption font-weight-bold text-truncate">{{ video.title }}</span>
        </div>
      </div>
      
      <div v-if="filteredVideos.length === 0" class="w-100 text-center py-10 text-grey">
        ยังไม่มีกิจกรรมในหมวดหมู่นี้
      </div>
    </div>
    <v-dialog v-model="isModalOpen" max-width="900" transition="dialog-bottom-transition">
      <v-card class="modal-card rounded-xl overflow-hidden" color="#0a0a0a">        
        <v-btn
          icon="mdi-close"
          variant="text"
          color="grey-lighten-1"
          size="small"
          class="close-btn"
          @click="isModalOpen = false"
        ></v-btn>

        <v-row no-gutters>
          <v-col cols="12" md="5" class="bg-black d-none d-md-flex align-center justify-center modal-video-col">
            <video
              v-if="activeVideo"
              :src="activeVideo.videoUrl"
              autoplay
              loop
              controls
              class="full-video-player"
            ></video>
          </v-col>
          
          <v-col cols="12" md="7" class="pa-6 pa-md-8 d-flex flex-column right-panel">
            
            <div class="text-caption text-grey-darken-1 font-weight-bold text-uppercase mb-1">
              {{ activeVideo?.category || 'VIRAL' }}
            </div>
            
            <h2 class="text-white text-h4 font-weight-black text-uppercase mb-3" style="line-height: 1.1;">
              {{ activeVideo?.title }}
            </h2>
            
            <p class="text-grey-lighten-1 text-body-2 mb-6" style="line-height: 1.6;">
              {{ activeVideo?.description }}
            </p>

            <div class="upload-area rounded-xl d-flex flex-column align-center justify-center pa-8 mb-6 cursor-pointer">
              <div class="upload-icon-wrapper mb-3 d-flex align-center justify-center">
                <v-icon icon="mdi-image-outline" color="grey-lighten-1" size="20"></v-icon>
              </div>
              <h4 class="text-white font-weight-bold mb-1">Upload media</h4>
              <span class="text-grey-darken-1 text-caption">Drag & drop or click to upload</span>
            </div>

            <v-row class="mb-2 mx-n2">
              <v-col cols="4" class="px-2" v-for="ratio in ratios" :key="ratio.value">
                <div
                  class="ratio-card d-flex flex-column align-center justify-center py-4 rounded-lg cursor-pointer"
                  :class="{ 'ratio-active': selectedRatio === ratio.value }"
                  @click="selectedRatio = ratio.value"
                >
                  <v-icon 
                    :icon="ratio.icon" 
                    :color="selectedRatio === ratio.value ? '#ccff00' : 'grey-darken-1'" 
                    class="mb-2"
                  ></v-icon>
                  <span 
                    class="text-caption font-weight-bold" 
                    :style="{ color: selectedRatio === ratio.value ? '#ccff00' : '#757575' }"
                  >
                    {{ ratio.label }}
                  </span>
                </div>
              </v-col>
            </v-row>

            <v-spacer></v-spacer>

            <v-btn 
              block 
              color="#1a1a1a" 
              class="generate-btn text-grey-lighten-1 text-none font-weight-medium rounded-lg mt-6" 
              size="x-large"
              elevation="0"
            >
              ลองสร้าง <v-icon icon="mdi-creation" size="small" class="mx-1"></v-icon> 10
            </v-btn>
            
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.activities-wrapper {
  width: 95%;
  overflow: hidden;
  margin-left: 20px;
  margin-right: 20px;
  padding-top: 0px;
}

.fire-title {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
  /* สร้างเงาสีส้ม-แดง ซ้อนกันหลายชั้นให้เหมือนไฟ */
  text-shadow: 
    0 0 5px #fff,
    0 0 10px #ffc107,
    0 0 20px #ff9800,
    0 0 40px #ff5722,
    0 0 80px #e65100;
  /* แอนิเมชันให้ไฟกระพริบวูบวาบ */
  animation: fire-flicker 1.5s infinite alternate;
}

@keyframes fire-flicker {
  0% { opacity: 0.9; text-shadow: 0 0 5px #fff, 0 0 10px #ffc107, 0 0 20px #ff9800, 0 0 40px #ff5722; }
  100% { opacity: 1; text-shadow: 0 0 5px #fff, 0 0 15px #ffc107, 0 0 30px #ff9800, 0 0 50px #ff5722, 0 0 90px #e65100; }
}

.fire-icon {
  animation: bounce-flame 2s infinite;
}

@keyframes bounce-flame {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.1); }
}

/* 🎨 ตกแต่งปุ่ม Filter (Chip) */
.filter-chip {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #9e9e9e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 8px !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.chip-active {
  background-color: #ff5722 !important; /* เปลี่ยนเป็นสีส้มให้เข้ากับไฟ */
  color: #ffffff !important;
  border-color: #ff9800 !important;
}

/* 🎨 ตกแต่งแกลลอรี่วิดีโอแบบเลื่อนแนวนอน */
/* 🎨 ตกแต่งแกลลอรี่วิดีโอแบบเลื่อนแนวนอน */
.video-scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-radius: 16px;
}
.video-scroll-container::-webkit-scrollbar { display: none; }

.video-card {
  position: relative;
  flex: 0 0 auto;
  width: 220px; 
  aspect-ratio: 9/16;
  cursor: pointer;
  
  /* 🌟 บังคับการ์ดให้โปร่งใส ห้ามระบบ Build เติมสีดำ! */
  background-color: transparent !important; 
  background: none !important;
  
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important; /* 🌟 ล็อกความโค้งการ์ดไว้ด้วย */
  transition: transform 0.2s ease, border-color 0.2s;
}

.video-card:hover {
  transform: scale(1.03) translateY(-4px);
  border-color: #ff5722;
  box-shadow: 0 10px 20px rgba(255, 87, 34, 0.2);
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;  
  /* 🌟 บังคับให้วิดีโอไม่มีช่องว่างใดๆ รอบตัว */
  display: block !important; 
  border-radius: 24px !important; /* โค้งตามการ์ด */
}

/* เงาดำไล่ระดับด้านล่างการ์ด ให้อ่านตัวหนังสือออก */
.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%) !important; /* 🌟 ล็อกกันหาย */
  border-bottom-left-radius: 24px !important;
  border-bottom-right-radius: 24px !important;
}

/* 🎨 ตกแต่ง Modal */
.modal-card {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
}

.full-video-player {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}
</style>