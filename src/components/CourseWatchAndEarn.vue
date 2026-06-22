<template>
  <v-app style="background-color: #0b111e; min-height: 100vh;" class="text-white">
    <v-main class="d-flex flex-column align-center justify-start py-8 px-4">
      <div class="course-container w-100" style="max-width: 900px;">

        <div class="tabs-header">
          <div v-for="tab in ['ภาพรวมเนื้อหา', 'ไฟล์ต้นฉบับ', 'ใบประกาศ']" 
            :key="tab" 
            class="tab-item"
            :class="{ 'active': activeTab === tab }"
            @click="activeTab = tab">
            {{ tab }}
          </div>
        </div>

        <div v-show="activeTab === 'ภาพรวมเนื้อหา'" class="youtube-quest-card my-4">
          <div class="section-header d-flex justify-space-between align-center">
            <div class="header-title-group d-flex align-center">
              <span class="quest-icon mr-2">🔮</span>
              <h3 class="text-subtitle-1 font-weight-bold my-0">
                กำลังเรียน: <span style="color: #00ff9d;">{{ currentLessonTitle }}</span>
              </h3>
            </div>
            <div class="status-indicator" :class="{ 'is-playing': isPlaying }">
              <span class="status-dot"></span>
              <span class="status-text text-caption">{{ playerStateText }}</span>
            </div>
          </div>

          <div class="video-container position-relative">
            <div v-if="!isPlayerReady" class="loading-overlay d-flex flex-column align-center justify-center">
              <v-progress-circular indeterminate color="#00ff9d" class="mb-2"></v-progress-circular>
              <p class="text-caption mb-0">กำลังเชื่อมต่อสัญญาณ...</p>
            </div>
            
            <div id="youtube-player-container" style="width: 100%; height: 100%;">
              <div id="youtube-player"></div>
            </div>
          </div>

          <div class="quest-status-panel d-flex justify-space-between align-center pa-3 bg-grey-darken-4 rounded-b-lg">
            <div class="reward-counter">
              <span class="label text-grey text-caption d-block">พลังงานที่รวบรวมได้จากบทเรียนนี้</span>
              <div class="points-display d-flex align-baseline">
                <span class="points-num font-weight-bold text-h5 text-warning mr-1">{{ points.toLocaleString() }}</span>
                <span class="points-unit text-caption text-grey">PTS</span>
              </div>
            </div>
            <v-btn v-if="isPlaying" size="small" color="error" variant="outlined" @click="pauseVideo">
              <v-icon left>mdi-pause</v-icon> พักสายตา
            </v-btn>
          </div>
        </div>

        <div v-if="activeTab === 'ภาพรวมเนื้อหา'" key="content-tab">
          <p class="path-info mt-4">นี่คือเนื้อหาเกี่ยวกับ : <strong>Open Source LLMs </strong></p>
          
          <p class="description">
            กฎระเบียบด้านความเป็นส่วนตัวและความละเอียดอ่อนของข้อมูลมักเป็นอุปสรรคต่อการใช้บริการ AI บนระบบคลาวด์ของบริษัทต่างๆ...
            <span class="read-more" style="color: #00ff9d; cursor: pointer;">เพิ่มเติม</span>
          </p>

          <v-expansion-panels variant="accordion" class="custom-panels" multiple v-model="openedPanels">
            <v-expansion-panel 
              v-for="(lesson, index) in lessons" 
              :key="'lesson-' + index" 
              class="lesson-panel mb-3"
            >
              <v-expansion-panel-title class="main-header">
                <div class="d-flex align-center w-100">
                  <div class="lesson-number mr-4">{{ index + 1 }}</div>
                  <div>
                    <div class="text-body-1 font-weight-bold text-white">{{ lesson.title }}</div>
                    <div class="text-caption text-grey-lighten-1">{{ lesson.duration }}</div>
                  </div>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="pa-0">
                <div 
                  v-for="(sub, subIdx) in lesson.subLessons" 
                  :key="'sub-' + index + '-' + subIdx" 
                  class="sub-lesson-row d-flex justify-space-between align-center py-3 px-4"
                  :class="{ 'active-playing': currentVideoId === sub.youtubeId }"
                  @click="selectSubLesson(sub)"
                  style="cursor: pointer;"
                >
                  <div class="d-flex align-center">
                    <v-icon 
                      :icon="currentVideoId === sub.youtubeId ? 'mdi-pulse' : (sub.completed ? 'mdi-check-circle' : 'mdi-play-circle-outline')" 
                      :color="currentVideoId === sub.youtubeId ? '#ffc107' : (sub.completed ? '#00ff9d' : 'grey')"
                      class="mr-4"
                    ></v-icon>
                    <div>
                      <div class="text-body-2" :class="{'text-warning font-weight-bold': currentVideoId === sub.youtubeId}">
                        {{ sub.title }}
                      </div>
                      <div class="text-caption text-grey">{{ sub.duration }}</div>
                    </div>
                  </div>
                  <v-icon icon="mdi-dots-vertical" color="grey"></v-icon>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <div v-else key="other-tabs" class="text-center py-10 text-grey">
          เนื้อหาในส่วนของ {{ activeTab }} กำลังจัดเตรียมข้อมูลระบบสำรองออฟไลน์...
        </div>

      </div>
    </v-main>
  </v-app>   
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 📋 จัดการหน้าหลัก & แท็บ
const activeTab = ref('ภาพรวมเนื้อหา');
const openedPanels = ref([0]); 

// 💎 จัดการระบบ Watch & Earn คะแนนสะสม
const points = ref(0);
const playerStateText = ref('รอการเลือกบทเรียน...');
const isPlaying = ref(false);
const isPlayerReady = ref(false);

// 🚀 อัปเดตไอดีวิดีโอเริ่มต้นเป็นลิงก์ของพี่เรียบร้อยครับ (goZNfXWkENI)
const currentVideoId = ref('goZNfXWkENI'); 
const currentLessonTitle = ref('แนะนำวิดีโอเริ่มต้นบทเรียนสำคัญ');

let player: any = null;
let pointInterval: any = null;

// 📚 ชุดจำลองข้อมูลคอร์สเรียน (ผูกไอดีวิดีโอใหม่ของพี่ไว้ที่หัวข้อแรกด้วยครับ)
const lessons = ref([
  {
    title: 'ทำความเข้าใจ Llama คืออะไร',
    duration: '2 หัวข้อ • 45 นาที',
    subLessons: [
      { title: 'สำรวจการพัฒนาของ Llama', duration: '05:19 นาที', completed: false, youtubeId: 'goZNfXWkENI' },
      { title: 'เปรียบเทียบโมเดล Llama', duration: '30:15 นาที', completed: false, youtubeId: 'XqZsoesa55w' },
      { title: 'เตรียมความพร้อม', duration: '30:15 นาที', completed: false, youtubeId: 'XqZsoesa55w' }
    ]
  },
  {
    title: 'ใช้งาน Llama บนเครื่อง',
    duration: '2 หัวข้อ • 60 นาที',
    subLessons: [
      { title: 'ตั้งค่าการพัฒนา', duration: '25:00 นาที', completed: false, youtubeId: 'L_LUpnjgPso' },
      { title: 'ตัวอย่าง: ใช้งาน Llama กับ Ollama', duration: '35:00 นาที', completed: false, youtubeId: 't6R0_4r7d6U' }
    ]
  }
]);

// 🛠️ เพิ่ม Lifecycle Hooks เพื่อโหลดสคริปต์หลักและดักตัวแปรของ YouTube API
onMounted(() => {
  if (!(window as any).YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }
  }

  // ผูกตัวดักเมื่อ API โหลดไฟล์จากเน็ตเสร็จเรียบร้อย
  (window as any).onYouTubeIframeAPIReady = initPlayer;

  // ป้องกันเคสสลับแท็บไปมาแล้วสคริปต์โหลดเสร็จค้างไว้ก่อนหน้า
  if ((window as any).YT && (window as any).YT.Player) {
    initPlayer();
  }
});

onUnmounted(() => {
  stopEarningPoints();
  try {
    if (player && typeof player.destroy === 'function') {
      player.destroy();
      player = null;
    }
  } catch (e) {
    console.log('ป้องกันการเกิด InsertBefore ลื่นไหลเรียบร้อย');
  }
});

// 🛠️ ฟังก์ชันขึ้นโครงร่างสร้าง Player โฆษณา/เนื้อหา
const initPlayer = () => {
  if (!(window as any).YT || !(window as any).YT.Player) {
    console.warn('⚠️ YouTube API ยังไม่พร้อมใช้งาน ระบบจะลองใหม่อีกครั้งใน 500ms...');
    setTimeout(initPlayer, 500); 
    return;
  }

  let playerElement = document.getElementById('youtube-player');
  if (!playerElement) {
    const container = document.getElementById('youtube-player-container');
    if (container) {
      playerElement = document.createElement('div');
      playerElement.id = 'youtube-player';
      container.appendChild(playerElement);
    } else {
      return; 
    }
  }

  try {
    player = new (window as any).YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: currentVideoId.value, 
      playerVars: {
        'autoplay': 0, 
        'rel': 0,
        'modestbranding': 1,
        // ❌ ถอด 'origin': window.location.origin ออกเพื่อป้องกันเครื่อง Localhost บล็อกสัญญาน
        'enablejsapi': 1 // 🟢 บังคับเปิดใช้งาน JavaScript API ควบคุมเหตุการณ์แทน
      },
      events: {
        'onReady': () => { 
          isPlayerReady.value = true; 
        },
        'onStateChange': onPlayerStateChange
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดขณะสร้าง YouTube Player:', error);
  }
};

// 🖱️ ฟังก์ชันสลับวิดีโอเมื่อผู้ใช้จิ้มเลือกแถวบทเรียนย่อย
const selectSubLesson = (sub: any) => {
  currentVideoId.value = sub.youtubeId;
  currentLessonTitle.value = sub.title;
  
  if (player && typeof player.loadVideoById === 'function' && isPlayerReady.value) {
    try {
      player.loadVideoById(sub.youtubeId);
    } catch (e) {
      initPlayer();
    }
  } else {
    isPlayerReady.value = false;
    initPlayer();
  }
};

const pauseVideo = () => {
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
  }
};

const onPlayerStateChange = (event: any) => {
  // 1 = PLAYING (กำลังเล่น)
  if (event.data === (window as any).YT.PlayerState.PLAYING) {
    isPlaying.value = true;
    playerStateText.value = 'กำลังรับฟังความรู้ (รับแต้มพลังงาน)';
    startEarningPoints();
  } 
  // 0 = ENDED (ดูจบวิดีโอแล้ว 🏁)
else if (event.data === (window as any).YT.PlayerState.ENDED || event.data === 0) {
    isPlaying.value = false;
    playerStateText.value = '🎉 ยินดีด้วย! คุณเรียนจบหลักสูตรนี้แล้ว';
    stopEarningPoints();
    
    points.value += 500; // แจกโบนัสก้อนใหญ่ 500 แต้ม
    
    // 🚀 เรียกใช้งานฟังก์ชันเพื่อเปลี่ยนไอคอนเป็นติ๊กถูกสีเขียว
    markCurrentLessonAsCompleted(); 
  }
  // สถานะอื่นๆ เช่น กด Pause หรืดโหลดสตรีม
  else {
    isPlaying.value = false;
    playerStateText.value = event.data === (window as any).YT.PlayerState.PAUSED ? 'หยุดเรียนชั่วคราว' : 'สถานะสแตนด์บาย';
    stopEarningPoints();
  }
};
const markCurrentLessonAsCompleted = () => {
  lessons.value.forEach((lesson) => {
    const targetSub = lesson.subLessons.find(sub => sub.youtubeId === currentVideoId.value);
    // เช็กเงื่อนไขเพิ่ม: ถ้ามันยังไม่เป็น true ค่อยสั่งทำงาน ป้องกัน Logic วิ่งวนซ้ำซ้อนทุกวินาที
    if (targetSub && !targetSub.completed) {
      targetSub.completed = true; 
      points.value += 500; // มอบโบนัสเรียนจบก้อนใหญ่ 500 แต้ม
      playerStateText.value = '🎉 ยินดีด้วย! คุณเรียนจบหลักสูตรนี้แล้ว';
      console.log(`🏁 บันทึกสำเร็จ: หัวข้อ "${targetSub.title}" เรียนจบเรียบร้อย!`);
    }
  });
};
// 💰 กลไกนับรอบสะสมรางวัล
const checkVideoProgress = () => {
  if (player && typeof player.getCurrentTime === 'function' && isPlayerReady.value) {
    const currentTime = player.getCurrentTime(); // วินาทีปัจจุบันที่คลิปเล่นอยู่
    const duration = player.getDuration();       // ความยาวทั้งหมดของคลิป (วินาที)
    
    if (duration > 0) {
      // คำนวณเป็นเปอร์เซ็นต์ (ถ้าดูเกิน 95% ของคลิป ให้ถือว่าเรียนจบ)
      const progressPercent = (currentTime / duration) * 100;
      
      if (progressPercent >= 95) {
        // 🟢 เปลี่ยนจาก handleLessonCompleted() มาเรียกตัวนี้แทนครับพี่
        markCurrentLessonAsCompleted(); 
      }
    }
  }
};

// 💰 กลไกนับรอบสะสมรางวัล
const startEarningPoints = () => {
  if (pointInterval) return;
  pointInterval = setInterval(() => {
    points.value += 1; 
    
    // Run ตัวแอบเช็กความคืบหน้าคลิปเพื่อดักจับคนลากเวลา/ดูจบจริง ทุกๆ วินาที
    checkVideoProgress(); 
  }, 1000);
};
const stopEarningPoints = () => {
  if (pointInterval) {
    clearInterval(pointInterval);
    pointInterval = null;
  }
};
</script>

<style scoped>
/* 💅 สไตล์ที่จำเป็นเพิ่มเติมเพื่อความเนียนตาของ UI คอร์ส */
.tabs-header {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 10px;
}
.tab-item {
  color: #94a3b8;
  cursor: pointer;
  padding: 5px 10px;
  font-weight: 500;
  transition: all 0.3s;
}
.tab-item.active {
  color: #00ff9d;
  border-bottom: 2px solid #00ff9d;
}
.path-info {
  color: #64748b;
  font-size: 0.9rem;
}
.description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
}
.youtube-quest-card {
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  overflow: hidden;
}
.section-header {
  padding: 12px 16px;
  background: #1f2937;
  border-bottom: 1px solid #1e293b;
}
.video-container {
  width: 100%;
  padding-top: 56.25%; 
  background: #000;
}
#youtube-player-container,
#youtube-player {
  position: absolute;
  top: 0; left: 0;
  width: 100% !important;
  height: 100% !important;
}
.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(11, 17, 30, 0.9);
  z-index: 10;
}
.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-dot {
  width: 8px; height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
}
.status-indicator.is-playing .status-dot {
  background-color: #00ff9d;
  box-shadow: 0 0 8px #00ff9d;
  animation: blink 1.5s infinite;
}
@keyframes blink { 50% { opacity: 0.4; } }

.sub-lesson-row {
  border-bottom: 1px solid #1e293b;
  transition: background 0.2s;
}
.sub-lesson-row:hover {
  background: rgba(255, 255, 255, 0.03);
}
.sub-lesson-row.active-playing {
  background: rgba(0, 255, 157, 0.05);
  border-left: 3px solid #ffc107;
}
.lesson-panel {
  background: #111827 !important;
  border: 1px solid #1e293b !important;
}
.lesson-number {
  background: #1f2937;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  color: #00ff9d;
}
</style>