<template>
  <nav class="bottom-nav-container">
    <div class="nav-menu-wrapper">
      <button 
      v-for="item in menuItems"
      :key="item.id"
      class="nav-item"
      :class="{ 'active': modelValue === item.id }"
      @click="$emit('update:modelValue', item.id)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();
defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
const menuItems = [
  { id: 'message', label: 'ข้อความ', icon: '💬' },
  { id: 'home', label: 'เรนเดอร์', icon: '📦' },
  { id: 'music', label: 'LoRA', icon: '🔮' },
  { id: 'rewards', label: 'ค้นหา', icon: '🔍' },
  { id: 'dashboard', label: 'แอนิเมชั่น', icon: '🎬' },
  { id: 'blog', label: 'โรงผลิต', icon: '📰' },
];
</script>

<style scoped>
.bottom-nav-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(17, 24, 39, 0.8); /* สี Dark โทนเดิม */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); /* ซัพพอร์ต iOS Safari */
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 16px;
  z-index: 9999; /* มั่นใจว่าลอยอยู่เหนือทุกสิ่ง */
  display: flex;
  justify-content: center;
}

/* 📦 ควบคุมแถวปุ่มกด */
.nav-menu-wrapper {
  display: flex;
  flex-direction: row; /* การันตีแนวนอนทุกหน้าจอ */
  justify-content: space-around;
  width: 100%;
  max-width: 540px; /* บีบขนาดบนเดสก์ท็อปไม่ให้ปุ่มยืดห่างกันจนน่าเกลียด */
  gap: 8px;
}

/* ✨ ปุ่มเมนูแต่ละตัว */
.nav-item {
  display: flex;
  flex-direction: column; /* ไอคอนอยู่บน ตัวหนังสืออยู่ล่าง */
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
}

/* ไอคอน */
.nav-icon {
  font-size: 20px;
  transition: transform 0.2s ease;
}

/* ตัวหนังสือ */
.nav-label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

/* 🕹️ Hover State (เฉพาะบน Desktop) */
@media (min-width: 768px) {
  .nav-item:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-2px); /* ลูกเล่นลอยขึ้นเล็กน้อย */
  }
}

/* 🔵 Active State (เมื่อหน้านั้นถูกเปิดอยู่) */
.nav-item.active {
  color: #3b82f6; /* สีฟ้าสไตล์ Web3Auth */
  background: rgba(59, 130, 246, 0.08); /* พื้นหลังฟ้าจางๆ */
}

.nav-item.active .nav-icon {
  transform: scale(1.1); /* ขยายไอคอนให้เด่นขึ้นนิดหน่อย */
}

/* 📱 ปรับแต่งเล็กน้อยสำหรับจอมือถือขนาดเล็กมาก */
@media (max-width: 375px) {
  .nav-label {
    font-size: 10px; /* ลดขนาดฟอนต์ลงหากจอมือถือแคบเกินไป */
  }
  .nav-item {
    padding: 6px 8px;
  }
}
</style>