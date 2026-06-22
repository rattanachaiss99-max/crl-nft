<template>
  <div class="youtube-quest-card">
    <div class="section-header">
      <div class="header-title-group">
        <span class="quest-icon">🔮</span>
        <h3>Crystal Vision (Watch & Earn)</h3>
      </div>
    </div>

    <div class="video-container">
      <div v-if="!isPlayerReady" class="loading-overlay">
        <div class="spinner"></div>
        <p>กำลังเชื่อมต่อสัญญาณ...</p>
      </div>
      <div id="youtube-player"></div>
    </div>

    <div class="quest-status-panel">
      
      <div class="status-indicator" :class="{ 'is-playing': isPlaying }">
        <span class="status-dot"></span>
        <span class="status-text">{{ playerStateText }}</span>
      </div>

      <div class="reward-counter">
        <span class="label">พลังงานที่รวบรวมได้</span>
        <div class="points-display">
          <span class="points-num kart-pranakorn-text">{{ points.toLocaleString() }}</span>
          <span class="points-unit">PTS</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const points = ref(0);
const playerStateText = ref('รอการโหลด...');
const isPlaying = ref(false);
const isPlayerReady = ref(false);

let player: any = null;
let pointInterval: any = null;

onMounted(() => {
  // ตรวจสอบว่าเคยโหลด Script YouTube มาแล้วหรือยัง (ป้องกันโหลดซ้ำ)
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

  // กำหนดฟังก์ชันเริ่มต้นเมื่อ API โหลดเสร็จ
  (window as any).onYouTubeIframeAPIReady = initPlayer;

  // ถ้า YT โหลดเสร็จไปก่อนหน้านี้แล้ว (เช่น เปิดกลับมาหน้านี้ใหม่) ให้เรียกใช้เลย
  if ((window as any).YT && (window as any).YT.Player) {
    initPlayer();
  }
});

const initPlayer = () => {
  player = new (window as any).YT.Player('youtube-player', {
    // ปรับเป็น 100% เพื่อให้ตัว CSS container เป็นตัวคุมสัดส่วน 16:9 แทน
    height: '100%',
    width: '100%',
    videoId: 'dQw4w9WgXcQ', 
    playerVars: {
      'autoplay': 0,
      'rel': 0, // ไม่แนะนำวิดีโอช่องอื่นตอนจบ
      'modestbranding': 1 // ซ่อนโลโก้ Youtube
    },
    events: {
      'onReady': () => { isPlayerReady.value = true; },
      'onStateChange': onPlayerStateChange
    }
  });
};

const onPlayerStateChange = (event: any) => {
  // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
  if (event.data === (window as any).YT.PlayerState.PLAYING) {
    isPlaying.value = true;
    playerStateText.value = 'กำลังรับชม (รับแต้ม)';
    startEarningPoints();
  } else {
    isPlaying.value = false;
    playerStateText.value = event.data === (window as any).YT.PlayerState.PAUSED 
      ? 'หยุดพักชั่วคราว' 
      : 'สัญญาณสิ้นสุด';
    stopEarningPoints();
  }
};

const startEarningPoints = () => {
  if (pointInterval) return;
  pointInterval = setInterval(() => {
    points.value += 1; 
    // 💡 ในงานจริง ควรเก็บเวลาที่ดู (Watch Time) แล้วค่อยยิง API ไปบันทึกที่ Supabase ทุกๆ 30 วินาที 
    // เพื่อป้องกันคนแฮ็กแก้ค่าตัวแปร points.value บนหน้าเว็บ
  }, 1000);
};

const stopEarningPoints = () => {
  if (pointInterval) {
    clearInterval(pointInterval);
    pointInterval = null;
  }
};

// เคลียร์ค่าต่างๆ เมื่อผู้ใช้ปิดหน้านี้หรือสลับแท็บ ป้องกัน Memory Leak
onUnmounted(() => {
  stopEarningPoints();
  if (player && typeof player.destroy === 'function') {
    player.destroy();
  }
});
</script>

<style scoped>
.youtube-quest-card {
  background: rgba(11, 15, 25, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header ของการ์ด */
.section-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
}

.header-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quest-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
}

.header-title-group h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
  letter-spacing: 0.5px;
}

/* 📺 ตัวครอบวิดีโอ 16:9 */
.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; /* บังคับสัดส่วนให้เป็นวิดีโอมาตรฐาน */
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) inset;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* หน้าต่างโหลดตอนดึง API */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 📊 แผงสถานะด้านล่าง */
.quest-status-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* ไฟสถานะ */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: #ef4444; /* สีแดงตอนหยุดพัก */
  border-radius: 50%;
  box-shadow: 0 0 8px #ef4444;
  transition: all 0.3s ease;
}

/* เปลี่ยนเป็นสีเขียวเรืองแสงตอนกำลังเล่น */
.status-indicator.is-playing {
  color: #10b981;
}

.status-indicator.is-playing .status-dot {
  background-color: #10b981;
  box-shadow: 0 0 12px #10b981, 0 0 20px #10b981;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

/* ส่วนแสดงแต้ม */
.reward-counter {
  text-align: right;
}

.reward-counter .label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.points-display {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.points-num {
  font-size: 1.8rem;
  color: #fbbf24; /* สีทอง/เหลือง */
  text-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
}

.points-unit {
  font-size: 0.9rem;
  color: #fbbf24;
  opacity: 0.8;
  font-weight: bold;
}

@media (max-width: 600px) {
  .quest-status-panel {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .reward-counter {
    text-align: left;
  }
}
</style>