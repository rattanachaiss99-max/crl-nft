<script setup>
import { computed } from 'vue';
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
  <div class="agent-mini-card">
    <div class="mini-content-wrapper">      
      <div class="mini-viewport">
        <img src="@/assets/KeY7qN.gif" alt="Agent Cam" class="mini-img" />
        <div class="mini-scanline"></div>
      </div>
      <div class="mini-details">
        <div class="mini-header">
          <span class="mini-title">📡 เบเวอลี ฮิล</span>
          <span class="mini-status-dot"></span>
        </div>        
        <div class="mini-stats-row">
          <div class="stat-block">
            <span class="label">Executive</span>
            <span class="value text-blue">🐱 Captain Meow</span>
          </div>
          <div class="stat-block">
            <span class="label">System Logs</span>
            <span class="value">98% Hot Coffee // Normal</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-mini-card {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 5px;
}

.mini-content-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mini-viewport {
  position: relative;
  width: 80px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #000000;
  flex-shrink: 0;
}

.mini-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated; 
  opacity: 0.8;
  transition: opacity 0.2s;
}

.agent-mini-card:hover .mini-img {
  opacity: 1;
}

.mini-scanline {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

.mini-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mini-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mini-title {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  font-family: monospace;
}

.mini-status-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.mini-stats-row {
  display: flex;
  gap: 16px;
}

.stat-block {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 9px;
  color: #4b5563;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.value {
  font-size: 11.5px;
  font-weight: 600;
  color: #6b7280; /* ดรอปสีลงเป็นสีเทา */
  margin-top: 1px;
}

.text-blue {
  color: #4b5563; /* ใช้สีเทาเข้มขึ้นมาหน่อย แทนสีฟ้าสด */
}
</style>