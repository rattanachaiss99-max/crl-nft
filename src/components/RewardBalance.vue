<template>
  <div class="reward-card">
    <div class="card-header">
      <div class="title-group">
        <span class="reward-icon">⚡</span>
        <span class="card-title">แต้มสะสมของคุณ</span>
      </div>
      <span class="tier-badge">Premium</span>
    </div>
    <div>
      <div v-if="isLoading" class="loading-display">
        <p>⏳ กำลังดึงข้อมูลแต้ม...</p>
      </div>
      
      <div v-else class="points-display">
        <h2 class="points-amount">
          {{ formatPoints(points) }}
          <span class="points-suffix">PTS</span>
        </h2>
        <p class="points-worth">≈ {{ (points * 0.01).toFixed(2) }} USD Worth</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { supabase } from '@/utils/supabase';

const props = defineProps({
  userAddress: {
    type: String,
    required: true
  }
});

const points = ref<number>(0); // 💡 ระบุ Generic Type ให้ชัดเจนว่าเป็นประเภทตัวเลข
const isLoading = ref<boolean>(false); // 💡 ระบุประเภทตัวแปร Boolean

const formatPoints = (val: number) => {
  return val.toLocaleString();
};

// 🆕 1. ย้ายฟังก์ชันสมัครสมาชิกใหม่อัตโนมัติขึ้นมาด้านบน (เพื่อให้ fetchUserPoints รู้จักตัวแปรล่วงหน้า)
const createNewUserRow = async () => {
  const { error } = await supabase
    .from('users') 
    .insert([{ 
      wallet_address: props.userAddress.toLowerCase(), 
      points: 0 
    }]);
  
  if (error) throw error; // 💡 ส่ง Error กลับไปให้ฟังก์ชันหลัก (fetchUserPoints) จัดการเคลียร์สถานะในบล็อกเดียว
  points.value = 0; 
};

// 🛰️ 2. ฟังก์ชันดึงแต้มสะสมหลัก
const fetchUserPoints = async () => {
  if (!props.userAddress) return;
  
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('users') 
      .select('points') 
      .eq('wallet_address', props.userAddress.toLowerCase()) 
      .single(); 

    if (error) {
      if (error.code === 'PGRST116') { 
        // หากไม่เจอชื่อในระบบ -> สั่งแอดแถวใหม่ทันที
        await createNewUserRow();
      } else {
        throw error;
      }
    } else if (data) {
      points.value = data.points; 
    }
  } catch (error: any) { // 💡 ระบุ Type เป็น any หรือ Error เพื่อป้องกัน TypeScript บ่นเรื่องพิมพ์ข้อมูล
    console.error('Error fetching or creating points:', error);
  } finally { 
    isLoading.value = false; 
  }
};
// 🔥 ส่งฟังก์ชันนี้ออกไปนอก Component เพื่อให้ไฟล์ RewardsAdsArea.vue สั่งเรียกใช้ได้แบบข้ามไฟล์
defineExpose({
  fetchUserPoints
});

// ดักฟังเผื่อผู้ใช้เปลี่ยนกระเป๋าเงิน ให้ดึงแต้มใหม่ทันที
watch(() => props.userAddress, () => {
  fetchUserPoints();
});

onMounted(() => {
  fetchUserPoints();
});
</script>

<style scoped>
.reward-card {
  background: linear-gradient(135deg, #2b1a0a 0%, #111827 100%);
  border: 1px solid rgba(245, 158, 11, 0.15); /* ขอบส้มทองจางๆ */
  border-radius: 16px;
  padding: 24px;
  color: #ffffff;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
  max-width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px; /* บังคับความสูงแนวตั้งให้พอดีและสมดุลกับการ์ดอื่นๆ */
  position: relative;
  overflow: hidden;
}

/* เพิ่มแสงออร่าเรืองๆ ที่มุมการ์ด */
.reward-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.reward-icon {
  font-size: 14px;
  animation: float 2s ease-in-out infinite;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #d97706; /* สีเหลืองอำพัน */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tier-badge {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.2);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
}

/* ส่วนแสดงตัวเลขแต้ม */
.points-display {
  display: flex;
  flex-direction: column;
}

.points-amount {
  font-size: 36px; /* ดันตัวเลขให้ใหญ่สะใจเวลามีคนสะสมแต้ม */
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
  background: linear-gradient(to right, #ffffff 60%, #fef08a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.points-suffix {
  font-size: 16px;
  font-weight: 700;
  color: #fbbf24;
  -webkit-text-fill-color: initial; 
}

.points-worth {
  font-size: 13px;
  color: #4b5563;
  margin: 2px 0 0 0;
  font-weight: 500;
}

/* ส่วนล่างของการ์ด (หลอดก้าวหน้าและแถบแอด) */
.card-footer {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading-bar-container {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #d97706, #fbbf24);
  border-radius: 10px;
  box-shadow: 0 0 8px #fbbf24;
}

.footer-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
}

.action-arrow {
  color: #fbbf24;
}

/* Animations */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
}
</style>