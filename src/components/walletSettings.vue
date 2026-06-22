<script setup>
import { computed } from 'vue';
import SwitchNetwork from './SwitchNetwork.vue';

const props = defineProps({
  address: {
    type: String,
    default: '0x0000000000000000000000000000000000000000'
  }
});

defineEmits(['disconnect']);

const formattedAddress = computed(() => {
  if (!props.address) return '';
  return `${props.address.slice(0, 6)}...${props.address.slice(-4)}`;
});

const copyAddress = () => {
  navigator.clipboard.writeText(props.address);
  alert("คัดลอกที่อยู่กระเป๋าสำเร็จแล้ว!");
};
</script>

<template>
  <div class="settings-page-wrapper">
    <div class="settings-grid-container">
      <div class="settings-column-left">
        <div class="settings-card">
          <div class="card-badge">บัญชี</div>
          <div class="profile-main">
            <div class="avatar-circle"></div>
            <div class="profile-info">
              <div class="address-display-row">
                <span class="wallet-address">{{ formattedAddress }}</span>
                <button class="icon-copy-btn" @click="copyAddress" title="Copy Address">📋</button>
              </div>
              <span class="connection-tag">เชื่อมต่อโดยโซเชียล</span>
            </div>
          </div>
          <button class="disconnect-action-btn" @click="$emit('disconnect')">
            <span>ตัดการเชื่อมต่อ</span>
          </button>
        </div>
        <div class="settings-card" style="margin-top: 16px;">
          <div class="meta-item">
            <SwitchNetwork />
          </div>
        </div>
      </div>
      <div class="settings-card agent-office-card">
        <div class="office-header">
          <div class="title-with-pulse">
            <span class="live-pulse"></span>
            <h4>📡 Pinata AI Agent Office (CCTV Live)</h4>
          </div>
          <span class="cam-id">CAM_01 // SYSTEM_LIVE</span>
        </div>
        <div class="image-viewport">
          <img src="@/assets/image_d8f93f.png" alt="AI Agent Office" class="office-img" />
          
          <div class="overlay-scanline"></div>
          <div class="overlay-text">STATUS: CAPTAIN MEOW IS MONITORING dAPP...</div>
        </div>
        <div class="office-footer-details">
          <div class="detail-stat">
            <span class="stat-icon">🐱</span>
            <div>
              <strong>Agent Boss</strong>
              <p>Captain Meow</p>
            </div>
          </div>
          <div class="detail-stat">
            <span class="stat-icon">☕</span>
            <div>
              <strong>Coffee Status</strong>
              <p>98% Hot Coffee</p>
            </div>
          </div>
          <div class="detail-stat">
            <span class="stat-icon">🖥️</span>
            <div>
              <strong>Server Logs</strong>
              <p>All Nodes Normal</p>
            </div>
          </div>
        </div>        
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🎨 ผสมผสานสไตล์เดิมของคุณ และเพิ่มสไตล์ของ Layout ใหม่เข้าไป */
.settings-page-wrapper {
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
}

/* 🧱 ระบบโครงสร้าง Grid แบ่งส่วนหน้าจอ */
.settings-grid-container {
  display: grid;
  grid-template-columns: 1fr 1.4fr; /* ให้สัดส่วนภาพห้องทำงานฝั่งขวากว้างกว่าฝั่งซ้ายเล็กน้อย */
  gap: 20px;
  align-items: flex-start;
  min-height: 0;
}

.settings-column-left {
  display: flex;
  flex-direction: column;
}

.settings-card { 
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px;
}

.card-badge { position: absolute; top: 16px; right: 16px; font-size: 10px; font-weight: 700; color: #4b5563; text-transform: uppercase;}
.profile-main { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.avatar-circle { width: 48px; height: 48px; background: linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%); border-radius: 50%; }
.address-display-row { display: flex; align-items: center; gap: 8px; }
.wallet-address { font-family: monospace; font-size: 16px; font-weight: 700; color: #ffffff; }
.icon-copy-btn { background: transparent; border: none; cursor: pointer; font-size: 14px; }
.connection-tag { font-size: 12px; color: #9ca3af; display: block; }

.disconnect-action-btn { 
  width: 100%; 
  background: rgba(239, 68, 68, 0.06); 
  border: 1px solid rgba(239, 68, 68, 0.2); 
  border-radius: 12px; 
  color: #ef4444; 
  padding: center; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.2s;
}
.disconnect-action-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.4);
}

/* คลาสย่อยอื่นๆ ของคุณคงไว้ใช้สนับสนุนโครงสร้าง */
.network-status-line { display: flex; align-items: center; gap: 10px; }
.network-indicator-dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
.network-name { font-size: 15px; font-weight: 600; color: #ffffff; }
.network-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: rgba(255, 255, 255, 0.02); padding: 12px; border-radius: 8px; }
.meta-item { display: flex; flex-direction: column; }
.meta-label { font-size: 11px; color: #6b7280; }
.meta-value { font-size: 14px; font-weight: 700; color: #3b82f6; }

/* 🐱 ส่วนตกแต่งหน้าต่างส่องห้องทำงานบอต (CCTV Area) ที่เพิ่มเข้ามา */
.agent-office-card {
  display: flex;
  flex-direction: column;
}

.office-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.title-with-pulse { display: flex; align-items: center; gap: 8px; }
.title-with-pulse h4 { margin: 0; font-size: 14px; color: #ffffff; font-weight: 600; }
.cam-id { font-family: monospace; font-size: 11px; color: #4b5563; }

.live-pulse {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: blink 1s infinite alternate;
}
@keyframes blink { from { opacity: 0.3; } to { opacity: 1; } }

/* 🖼️ กล่องควบคุมกรอบภาพสัดส่วนรูปห้องทำงาน */
.image-viewport {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #000000;
  aspect-ratio: 16 / 10; /* ล็อกมิติภาพนิ่งให้แสดงผลสมมาตรไม่ล้นทะลุจอ */
}

.office-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* บีบสเกลภาพให้พอดียืดหยุ่นตามความกว้างจอคอมพิวเตอร์ */
  image-rendering: pixelated; /* ลูกเล่นทำให้ภาพสไตล์ Pixel Art คมชัด ไม่เบลอ */
}

.overlay-scanline {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

.overlay-text {
  position: absolute; bottom: 12px; left: 12px;
  background: rgba(17, 24, 39, 0.85);
  padding: 4px 10px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 11px;
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* แถบไอคอนดีเทลเกมมิ่งด้านล่าง */
.office-footer-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}
.detail-stat {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.stat-icon { font-size: 18px; }
.detail-stat strong { display: block; font-size: 12px; color: #ffffff; }
.detail-stat p { margin: 2px 0 0 0; font-size: 11px; color: #6b7280; }

/* 📱 รองรับการสลับเป็นคอลัมน์เดี่ยวบนหน้าจอมือถือ */
@media (max-width: 768px) {
  .settings-grid-container {
    grid-template-columns: 1fr;
  }
}
</style>