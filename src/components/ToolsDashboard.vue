<script setup lang="ts">
import { ref } from 'vue';

const tools = ref([
  {
    id: 1,
    title: 'Nano Banana Pro',
    subtitle: 'สร้างภาพที่มีคุณภาพสูง',
    icon: 'mdi-alpha-g',
    badgeText: 'รูปภาพ',
    badgeIcon: 'mdi-image-outline',
    badgeType: 'subtle'
  },
  {
    id: 2,
    title: 'Seedance 2.0',
    subtitle: 'สร้างวิดีโอคุณภาพสูงได้ในไม่กี่วินาที',
    icon: 'mdi-chart-bar',
    badgeText: 'Video',
    badgeIcon: 'mdi-video-outline',
    badgeType: 'subtle'
  },
  {
    id: 3,
    title: 'Marketing Studio',
    subtitle: 'เริ่มแคมเปญเต็มรูปแบบได้จากข้อความเพียงครั้งเดียว',
    icon: 'mdi-presentation',
    badgeText: 'กำลังฮิต',
    badgeIcon: '',
    badgeType: 'trending'
  },
  {
    id: 4,
    title: 'MCP & CLI',
    subtitle: 'เปลี่ยน Claude ให้เป็นเครื่องจักรสร้างสรรค์',
    icon: 'mdi-star-four-points-outline',
    badgeText: 'ใหม่',
    badgeIcon: '',
    badgeType: 'new'
  },
  {
    id: 5,
    title: 'Higgsfield Canvas',
    subtitle: 'สร้างสรรค์สื่อที่น่าทึ่งด้วย AI Canvas',
    icon: 'mdi-palette-outline',
    badgeText: 'ใหม่',
    badgeIcon: '',
    badgeType: 'new'
  },
  {
    id: 6,
    title: 'Cinema Studio 3.5',
    subtitle: 'สร้างฉากภาพยนตร์ได้อย่างง่ายดาย',
    icon: 'mdi-filmstrip',
    badgeText: '',
    badgeIcon: '',
    badgeType: 'none'
  }
]);
</script>

<template>
  <div class="tools-dashboard-wrapper py-6">
    <v-row>      
      <v-col cols="12" md="4" class="d-flex flex-column">
        <v-card class="hero-card h-100 d-flex flex-column justify-space-between" elevation="0">          
          <div class="hero-content z-index-1">
            <div class="d-flex align-center mb-2">
              <h2 class="text-white font-weight-black text-h5 mb-0 mr-2">RAG</h2>
              <v-chip color="#ccff00" text-color="black" size="small" class="font-weight-bold px-2 rounded-sm" variant="flat">
                ใหม่
              </v-chip>
            </div>
            <p class="text-grey-lighten-1 text-body-2 pr-md-4">
              ค้นหาฐานข้อมูลไฟล์ เพื่อทดลองสร้างสรรค์ผลงาน
            </p>
          </div>
          <div class="z-index-1 mt-8">
            <v-btn 
              class="text-none font-weight-bold rounded-lg px-6" 
              height="44"
              style="background-color: #ffffff !important; color: #000000 !important;"
            >
              ทดลองตอนนี้ <v-icon icon="mdi-arrow-top-right" size="small" class="ml-1"></v-icon>
            </v-btn>
          </div>
          <div class="hero-bg-graphics"></div>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-row class="h-100">
          <v-col 
            v-for="tool in tools" 
            :key="tool.id" 
            cols="12" 
            sm="6" 
            md="4"
            class="d-flex flex-column"
          >
            <v-card class="tool-card h-100 cursor-pointer" elevation="0">              
              <div class="d-flex justify-space-between align-start mb-6">
                <v-icon :icon="tool.icon" color="white" size="28"></v-icon>                
                <v-chip v-if="tool.badgeType === 'new'" color="#ccff00" text-color="black" size="x-small" class="font-weight-bold rounded-sm px-2" variant="flat">
                  {{ tool.badgeText }}
                </v-chip>                
                <v-chip v-else-if="tool.badgeType === 'trending'" color="#ff007a" text-color="white" size="x-small" class="font-weight-bold rounded-sm px-2" variant="flat">
                  {{ tool.badgeText }}
                </v-chip>
                <v-chip v-else-if="tool.badgeType === 'subtle'" color="rgba(255, 255, 255, 0.1)" text-color="grey-lighten-1" size="small" class="rounded-md" variant="flat">
                  <v-icon v-if="tool.badgeIcon" :icon="tool.badgeIcon" size="small" class="mr-1"></v-icon>
                  <span class="text-caption font-weight-medium">{{ tool.badgeText }}</span>
                </v-chip>
              </div>
              <div>
                <h3 class="text-white text-body-1 font-weight-bold mb-1">{{ tool.title }}</h3>
                <p class="text-grey-darken-1 text-caption mb-0">{{ tool.subtitle }}</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.tools-dashboard-wrapper {
  margin-left: 10px;
  margin-right: 10px;
  padding: 0px;
}

/* 🌟 บังคับสีพื้นหลัง สีขอบ ความโค้ง และ **Padding** */
.hero-card {
  background-color: #1a1e23 !important; 
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 24px !important; 
  padding: 32px !important; /* 🌟 ล็อก Padding ให้กว้างเท่า Local (pa-6 ประมาณ 24-32px) */
  position: relative;
  overflow: hidden;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.hero-bg-graphics {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(204, 255, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(204, 255, 0, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.5;
  z-index: 0;
}

/* 🌟 บังคับสีและการ์ดเครื่องมือแต่ละอัน พร้อมล็อก Padding */
.tool-card {
  background-color: #161616 !important; 
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 24px !important; 
  padding: 24px !important; /* 🌟 ล็อก Padding ให้การ์ดเล็ก (pa-4 ประมาณ 16-24px) */
  transition: all 0.2s ease;
}

/* 🌟 บังคับสีเวลาเอาเมาส์ชี้ด้วย ไม่งั้นจะกระพริบกลับเป็นสีดำ */
.tool-card:hover {
  background-color: #1f1f1f !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-2px);
}

.rounded-sm {
  border-radius: 4px !important;
}
</style>