<script setup lang="ts">
import { useChainId, useSwitchChain } from '@wagmi/vue';
const chainId = useChainId();
const { chains, error, switchChain } = useSwitchChain();
</script>

<template>
  <div class="stack">
    <div v-if="chains && chains.length > 0">
      <div class="scroll-container">
        <button
        v-for="targetChain in chains"
        :key="targetChain.id"
        :disabled="chainId === targetChain.id"
        @click="switchChain({ chainId: targetChain.id })"
        type="button"
        class="card"
        >
        {{ targetChain.name }}
        </button>
      </div>      
    </div>
    <div v-else class="loading-text">
      🔄 กำลังดึงข้อมูลเครือข่ายที่ dApp รองรับ...
    </div>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>  
</template>

<style scoped>
.scroll-container {
  flex-direction: row; 
  gap: 10px;
  overflow-x: auto;
}

.container {
  display: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: #0f172a;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

h2 {
  color: #f8fafc; /* สีขาวนวล */
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.text {
  color: #94a3b8; /* สีเทาสว่าง */
  margin: 0 0 20px 0;
  font-size: 0.95rem;
  font-weight: 400;
}

.chain-id {
  color: #38bdf8;
  font-weight: bold;
}

.set {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  gap: 10px;
  background-color: #0f172a;
  color: #e2e8f0;
  border: 1px solid #475569;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: left;
}

/* ✨ เอฟเฟกต์ตอนเอาเมาส์ไปวาง (Hover) */
.card:hover:not(:disabled) {
  background-color: #1e293b;
  border-color: #38bdf8; /* เปล่งแสงขอบสีฟ้า */
  color: #38bdf8;
  transform: translateY(-1px);
}

/* 🔒 สถานะปุ่มที่ถูกกดอยู่/เชื่อมต่อแล้ว (Disabled) */
.card:disabled {
  background-color: #334155; /* สีเทาทึบ */
  border-color: #1e293b;
  color: #64748b; /* ตัวอักษรสีจางลง */
  cursor: not-allowed;
  position: relative;
  box-sizing: border-box;  
}

/* เพิ่มเครื่องหมายติ๊กถูกเล็กๆ หลังปุ่มที่ถูกเลือกอยู่ */
.card:disabled::after {
  font-size: 0.75rem;
  color: #4ade80; /* สีเขียวสว่าง (Green 400) */
  background: rgba(74, 222, 128, 0.1);
  padding: 0px 4px;
  border-radius: 14px;
  margin-left: 12px;
  white-space: nowrap;
}

/* ⚠️ กล่องแจ้งเตือน Error */
.error {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.1); /* สีแดงโปร่งแสง */
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.85rem;
  line-height: 1.4;
}
</style>