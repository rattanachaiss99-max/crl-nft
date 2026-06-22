<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    location="left"
    width="100"
    color="#111827"
    class="web3-sidebar"
  >
    <div class="sidebar-brand">
      <span class="brand-icon">💎</span>
      <span class="brand-text">AGENTS <span class="gradient-text">PORTAL</span></span>
    </div>

    <div class="agents-monitor-container">      
      <div class="agent-wrapper">
        <div class="operator-tag">
          <span class="pulse-dot"></span>
          <span>AGENT SYSTEM // CAM_01</span>
        </div>
        <AgentDashboard />
      </div>
      <div class="agent-wrapper">
        <div class="operator-tag text-amber">
          <span class="pulse-dot bg-amber"></span>
          <span>AGENT SYSTEM // CAM_02</span>
        </div>
        <AgentDashboard /> 
      </div>
    </div>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
import AgentDashboard from './AgentDashboard.vue';

// รับค่าสถานะ ยุบ/กาง จากหน้าหลักอย่างเดียว ไม่ต้องยุ่งเกี่ยวกับแท็บหน้าเว็บแล้วครับ
defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped>
.web3-sidebar {
  background-color: #111827 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
  
  width: 125px !important;
  min-width: 100px !important;
  max-width: 125px !important;
  
  overflow-y: auto !important; 
  overflow-x: hidden !important; /* 🟢 ห้ามคอนเทนต์ลูกทะลักออกมาด้านข้างเด็ดขาด */
}

/* ซ่อนแถบสกอร์บาร์ขยะให้ดูเนียนตาสไตล์แอปพลิเคชันล้ำยุค */
.web3-sidebar::-webkit-scrollbar {
  width: 4px;
}
.web3-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.sidebar-brand {
  padding: 24px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  position: sticky; /* ล็อกหัวข้อให้อยู่กับที่เวลาเลื่อนดูบ็อตด้านล่าง */
  top: 0;
  background: #111827;
  z-index: 2;
}

.brand-text {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #ffffff;
}

.gradient-text {
  background: linear-gradient(45deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 🎨 จัดระยะกล่องกริดแนวตั้งสำหรับบรรจุกลุ่มบ็อต */
.agents-monitor-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.agent-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ดีไซน์แท็กหัวข้อของแต่ละกล่องมอนิเตอร์ */
.operator-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: monospace;
  font-size: 10px;
  color: #4b5563;
  font-weight: 700;
  padding-left: 4px;
}

.pulse-dot {
  width: 5px;
  height: 5px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
}

/* สไตล์สีธีมเสริมเผื่อไว้แยกประเภทช่องสัญญาณบ็อต */
.text-amber { color: #d97706; }
.bg-amber { background: #d97706; box-shadow: 0 0 6px rgba(217, 119, 6, 0.5); }

.text-purple { color: #7c3aed; }
.bg-purple { background: #7c3aed; box-shadow: 0 0 6px rgba(124, 58, 237, 0.5); }
</style>