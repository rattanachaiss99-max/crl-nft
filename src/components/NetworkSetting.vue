<template>  
    <div class="stack">      
      <div class="settings-card network-section">
        <div class="card-badge">เครื่อข่ายที่ใช้งาน</div>
        <div class="network-details">
          <div class="network-status-line">
            <!-- <div class="network-indicator-dot"></div> -->
            <span class="network-name">
              {{ currentChainName }}
            </span>
          </div>
          <div class="network-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Chain ID</span>
              <span class="meta-value">{{ chainId }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Currency</span>
              <span class="meta-value">{{ currentChainTicker }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="error" class="error">{{ error.message }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChainId, useSwitchChain } from '@wagmi/vue';

const chainId = useChainId();
const { chains, error, switchChain } = useSwitchChain();
const currentChainName = computed(() => {
  const activeChain = chains.value.find(c => c.id === chainId.value);
  return activeChain ? activeChain.name : `Unknown Network (${chainId.value})`;
});
const currentChainTicker = computed(() => {
  const activeChain = chains.value.find(c => c.id === chainId.value);
  return activeChain?.nativeCurrency?.symbol || 'ETH';
});
</script>

<style scoped>
/* 🌌 จัดเลย์เอาต์หลักสไตล์ Dark Theme */
.container {
  display: block; 
  width: 100%;
  background: none !important; /* 🟢 ลบพื้นหลังสีเข้มชั้นนอกสุดทิ้ง */
  padding: 0 !important;       /* 🟢 ลบระยะขอบนอกออกเพื่อให้ขนานคู่กับ Balance */
  min-height: auto;
}

/* 📦 ปรับปรุงกล่องครอบเนื้อหาด้านใน */
.stack {
  /* 🟢 1. เปลี่ยนมาใช้พื้นหลังสีเดียวกับ Balance เพื่อความนวลตา */
  background-color: #0f172a; 
  border: 1px solid #475569; /* เส้นขอบหนาและสีเดียวกับกล่องยอดเงิน */
  border-radius: 12px;       /* ความโค้งเท่ากันที่ 12px */
  padding: 24px;
  
  /* 🟢 2. ปลดล็อกความกว้างสูงสุดทิ้งไป (ลบ max-width: 50% อันเดิมออก) */
  width: 100% !important;
  max-width: 100% !important;
  
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  margin: 0;                 /* 🟢 ลบ margin 15px 0px ออก ไม่ให้เยื้องแนวตั้ง */
  height: 100%;              /* 🟢 ยืดความสูงให้เท่ากับ Balance ข้างๆ */
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 💳 ปรับแต่งการ์ดแสดงสถานะ Network ด้านใน */
.settings-card {
  position: relative;
  /* 🟢 3. ถอด border และ background ซ้ำซ้อนออก เพราะ .stack คุมไว้สวยแล้ว */
  background-color: transparent; 
  border: none;
  padding: 12px 0 0 0;  /* เว้นพื้นที่ด้านบนให้ตัว Badge เล็กน้อย */
  box-sizing: border-box;
  width: 100%;
}

/* 🏷️ ปรับตำแหน่ง Badge "Network" ให้ลอยสวยๆ พอดีกล่องใหม่ */
.card-badge {
  position: absolute;
  top: -22px; /* ขยับตำแหน่งขึ้นด้านบนให้พ้นขอบเนื้อหา */
  left: 0;    /* ชิดขอบซ้ายในระนาบเดียวกับชื่อเครือข่าย */
  background-color: #38bdf8; 
  color: #0f172a;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 🟢 ปรับดีไซน์จุดไฟสถานะให้ขนาดและออร่าเท่ากันกับฝั่งยอดเงิน */
.network-indicator-dot {
  width: 10px;
  height: 10px;
  background-color: #4ade80; 
  border-radius: 50%;
  box-shadow: 0 0 12px #4ade80;
}

h2 {
  color: #f8fafc;
  margin: 0 0 20px 0;
  font-size: 1.4rem;
  font-weight: 600;
}

/* 💳 ตกแต่งการ์ดแสดงสถานะ Network (โครงสร้างที่คุณส่งมา) */
.settings-card {
  position: relative;
  background-color: #0f172a;
  border-radius: 12px;
  padding: 20px 16px 16px 16px;  
  box-sizing: border-box;
}

.card-badge {
  position: absolute;
  top: -10px;
  left: 16px;
  background-color: #38bdf8; /* สีฟ้าเรืองแสง */
  color: #0f172a;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.network-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
}

.network-status-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.network-indicator-dot {
  width: 10px;
  height: 10px;
  background-color: #4ade80; /* เขียวสว่าง */
  border-radius: 50%;
  box-shadow: 0 0 12px #4ade80;
}

.network-name {
  color: #f8fafc;
  font-size: 1.15rem;
  font-weight: 600;
}

/* ตารางแสดงข้อมูลรายละเอียด Grid */
.network-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  border-top: 1px solid #334155;
  padding-top: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  color: #64748b; /* เทาจาง */
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 600;
}

/* 🗂️ โซนปุ่มกดเปลี่ยนเครือข่าย */
.switch-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
}

.set {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  background-color: #0f172a;
  color: #cbd5e1;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  box-sizing: border-box;
  width: 100%;
}

.card:hover:not(:disabled) {
  background-color: #1e293b;
  border-color: #38bdf8;
  color: #38bdf8;
  transform: translateY(-1px);
}

/* เมื่อเชื่อมต่อเครือข่ายนี้อยู่แล้ว */
.card:disabled {
  background-color: #1e293b;
  border-color: rgba(74, 222, 128, 0.3);
  color: #4ade80; /* เปลี่ยนเป็นสีเขียว */
  cursor: not-allowed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card:disabled::after {
  content: "✓ Connected";
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(74, 222, 128, 0.1);
  padding: 2px 8px;
  border-radius: 20px;
}

.error {
  margin-top: 16px;
  padding: 10px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.8rem;
}
</style>