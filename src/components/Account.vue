<template>
  <div class="account-card">
    <div class="profile-section">
      <div class="avatar-wrapper">
        <img
          v-if="ensAvatar"
          alt="ENS Avatar"
          class="avatar-img"
          :src="ensAvatar"
        />
        <div v-else class="avatar-placeholder" :style="generateGradient(formattedAddress)"></div>
      </div>

      <div class="info-stack">
        <div class="name-address-row">
          <h3 v-if="ensName" class="ens-name">{{ ensName }}</h3>
          
          <div v-if="formattedAddress" class="address-container" @click="copyAddress" title="Click to copy">
            <span class="address-text">{{ truncateAddress(formattedAddress) }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="copy-icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span v-if="copied" class="tooltip">Copied!</span>
          </div>
        </div>
        
        <p class="connector-tag">
          <span class="dot"></span>
          Connected via {{ connector?.name || 'Web3Auth' }}
        </p>
      </div>
    </div>

    <div class="action-section">
      <button class="disconnect-button" @click="disconnect()" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="logout-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        Disconnect Wallet
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useAccount,
  useConfig,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from '@wagmi/vue';
import { computed, ref } from 'vue';

const config = useConfig();

const { address, connector } = useAccount();
const { disconnect } = useDisconnect();

// ปรับปรุงตรงนี้: ใช้ลูกศรฟังก์ชัน () => เพื่อดึงค่า reactive แบบไม่หลุดแทร็ก
const { data: ensName } = useEnsName({ 
  address: computed(() => address.value) 
});
const { data: ensAvatar } = useEnsAvatar({ 
  name: computed(() => ensName.value ?? undefined) 
});

const formattedAddress = computed(() => {
  if (!address.value) return null;
  return `${address.value}`;
});

const truncateAddress = (addr: string | null) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

// ส่วนจัดการสถานะ UI ของ Copy Button
const copied = ref(false);

const copyAddress = async () => {
  if (!formattedAddress.value) return;
  try {
    await navigator.clipboard.writeText(formattedAddress.value);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Failed to copy', err);
  }
};

const generateGradient = (addr: string | null) => {
  if (!addr) return 'background: #374151;';
  const hash = addr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 120) % 360;
  return `background: linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 80%, 40%));`;
};
</script>

<style scoped>
/* คุมโทนดีไซน์ Dark Mode */
.account-card { background: #111827; border: 1px solid rgba(255, 255, 255, 0.08);border-radius: 16px;padding: 16px;color: #ffffff;box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);max-width: 400px;font-family: -apple-system, BlinkMacSystemFont, sans-serif;height: 100%;display: flex;flex-direction: column;justify-content: space-between;margin: 0;}
.profile-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar-img, .avatar-placeholder {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.5);
  object-fit: cover;
}

.info-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.name-address-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ens-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #f3f4f6;
}

.address-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;
  position: relative;
  transition: background 0.2s;
}

.address-container:hover {
  background: rgba(255, 255, 255, 0.08);
}

.address-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  color: #9ca3af;
  font-weight: bold;
}

.copy-icon {
  color: #6b7280;
}

.address-container:hover .copy-icon {
  color: #3b82f6;
}

.tooltip {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  animation: fadeIn 0.2s ease-out;
}

.connector-tag {
  font-size: 12px;
  color: #6b7280;
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 6px #10b981;
}

.action-section {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.disconnect-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.disconnect-button:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, 5px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
</style>