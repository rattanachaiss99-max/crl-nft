<template>
  <div class="agent-dashboard-card">
    <div class="office-header-row">
      <div class="title-with-pulse">
        <span class="live-pulse"></span>
        <h4>📡ห้องแผนกการเงิน</h4>
      </div>
      <span class="cam-id-tag">CCTV_CAM_01 // LIVE_FEED</span>
    </div>

    <div class="image-viewport">
      <img src="@/assets/KeY7qN.gif" alt="AI Agent Office" class="office-img" />      
      <div class="overlay-scanline"></div>
      <div class="overlay-text-neon">SYSTEM_LOG: CAPTAIN MEOW IS RUNNING ON CHAIN...</div>
    </div>

    <div class="agent-meta-grid">
      <div class="meta-item">
        <span class="meta-label">Agent Executive</span>
        <span class="meta-value agent-name">🐱 Captain Meow</span>
      </div>
      <div class="meta-item text-right">
        <span class="meta-label">Task Status</span>
        <span class="meta-value text-green">🟢 Monitoring dApp</span>
      </div>
    </div>

    <div class="agent-tools-vertical">
      <div class="tool-status-bar">
        <span class="status-icon">☕</span>
        <div class="tool-text">
          <h4>Coffee Machine Resource</h4>
          <p>98% Fuel - อัตราการตื่นตัวของบ็อตเสถียร</p>
        </div>
        <span class="tool-value-tag highlight-blue">READY</span>
      </div>

      <div class="tool-status-bar">
        <span class="status-icon">🖥️</span>
        <div class="tool-text">
          <h4>Pinata IPFS Node logs</h4>
          <p>Syncing IPFS Cluster & Supabase Hooks</p>
        </div>
        <span class="tool-value-tag highlight-green">100% OK</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
const isLoading = ref<boolean>(false);
const logsContainer = ref<HTMLElement | null>(null);

interface LogItem {
  id: number;
  timestamp: Date;
  type: 'info' | 'success' | 'error';
  message: string;
  cid?: string;
}

const logs = ref<LogItem[]>([
  { id: 1, timestamp: new Date(Date.now() - 600000), type: 'info', message: 'Agent initialized with Pinata SDK' },
  { id: 2, timestamp: new Date(Date.now() - 300000), type: 'success', message: 'Successfully published tweet #89' },
  { id: 3, timestamp: new Date(Date.now() - 290000), type: 'success', message: 'Pinned tweet payload to IPFS', cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco' },
]);

const scrollToBottom = async () => {
  await nextTick();
  if (logsContainer.value) {
    logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
  }
};

const fetchAgentStatus = async () => {
  isLoading.value = true;
  try {
    console.log('Fetching agent status...');
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

let pollInterval: any = null;
onMounted(() => {
  fetchAgentStatus();
  scrollToBottom();
  pollInterval = setInterval(fetchAgentStatus, 10000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.agent-dashboard-card {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 10px;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.office-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-right: 90px;
}

.title-with-pulse {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-with-pulse h4 {
  margin: 0;
  font-size: 15px;
  color: #ffffff;
  font-weight: 700;
}

.cam-id-tag {
  font-family: monospace;
  font-size: 11px;
  color: #4b5563;
}

.live-pulse {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: blinkRate 1s infinite alternate;
}

@keyframes blinkRate {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

.image-viewport {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #000000;
  aspect-ratio: 16 / 9;
}

.office-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  transition: transform 0.3s ease;
}

.image-viewport:hover .office-img {
  transform: scale(1.03);
}

.overlay-scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

.overlay-text-neon {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(17, 24, 39, 0.9);
  padding: 4px 10px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 11px;
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.agent-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  padding: 14px;
  border-radius: 12px;
  margin-top: 16px;
  border: 1px solid rgba(255, 255, 255, 0.02);
}

.meta-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-right {
  align-items: flex-end;
}

.meta-label {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.meta-value {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.agent-name {
  color: #3b82f6; /* สีฟ้าสไตล์เดียวกับค่ากระเป๋าเงิน */
}

.text-green {
  color: #10b981;
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.agent-tools-vertical {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-status-bar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 12px;
  border-radius: 12px;
  box-sizing: border-box;
}

.status-icon {
  font-size: 18px;
}

.tool-text {
  flex: 1;
}

.tool-text h4 {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.tool-text p {
  font-size: 11px;
  color: #6b7280;
  margin: 2px 0 0 0;
}

.tool-value-tag {
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
}

.highlight-blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.highlight-green {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
</style>