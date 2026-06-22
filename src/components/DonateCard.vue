<template>
  <div class="donate-card">
    <div class="card-header">
      <span class="heart-icon">❤️</span>
      <h3>สนับสนุนช่อง YouTube ของฉัน</h3>
    </div>
    
    <div class="card-body">
      <p class="donate-desc">โดเนทผ่าน Web3 เงินเข้าสตรีมเมอร์โดยตรง 100% และรับแต้มโบนัสพิเศษ!</p>
      
      <div class="crypto-warning">
        <span class="warning-badge">18+</span>
        <p>การโดเนทด้วยคริปโตเคอเรนซี ผู้ทำรายการจำเป็นต้องมีอายุตั้งแต่ 18 ปีขึ้นไปตามระเบียบข้อบังคับในประเทศไทย</p>
      </div>
      
      <div class="quick-amounts">
        <button v-for="amt in quickAmounts" :key="amt" @click="amount = amt" :class="{ active: amount === amt }">
          ${{ amt }}
        </button>
      </div>

      <div class="input-group">
        <input type="number" v-model.number="amount" min="1" placeholder="ระบุจำนวนเงิน (USD)" />
        <span class="currency-label">USDT</span>
      </div>

      <div class="reward-estimate-wrapper">
        <div class="reward-estimate" :class="{ 'is-visible': amount > 0 }">
          🎉 คุณจะได้รับ <strong class="highlight">{{ amount ? amount * 100 : 0 }} PTS</strong> เป็นรางวัลสะสม!
        </div>
      </div>

      <button @click="handleDonate" class="btn-donate" :disabled="isProcessing || !amount || amount <= 0">
        {{ isProcessing ? '⏳ กำลังทำรายการบนบล็อกเชน...' : '🚀 ยืนยันการโดเนท' }}
      </button>

      <div class="line-support">
        <p>เข้าไม่ถึง Crypto? หรือกระเป๋าเงินมีปัญหา?</p>
        <a href="https://line.me/R/ti/p/@your_line_id" target="_blank" class="btn-line">
          <span class="line-icon">💬</span> ติดต่อโดเนทช่องทางปกติผ่าน LINE
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/utils/supabase';

const props = defineProps({
  userAddress: { type: String, required: true },
  streamerAddress: { type: String, default: '0xYourStreamerWalletAddress...' } // ✨ ใส่เลขกระเป๋าจริงของคุณตรงนี้
});

const emit = defineEmits(['donate-success']);

const amount = ref<number>(5); // ค่าเริ่มต้น 5 USDT
const isProcessing = ref<boolean>(false);
const quickAmounts = [5, 10, 20, 50];

const handleDonate = async () => {
  if (!props.userAddress) {
    alert('❌ กรุณาเชื่อมต่อกระเป๋าเงินก่อนทำการโดเนทครับ');
    return;
  }

  isProcessing.value = true;
  try {
    console.log(`กำลังส่งคำสั่งโอนเงินจำนวน ${amount.value} USDT ไปยัง ${props.streamerAddress}`);
    
    // 🔗 [จุดเชื่อมต่อบล็อกเชนจริงในอนาคต]
    // ตรงนี้เราจะใช้ ethers.js หรือ viem สั่งเปิดกระเป๋าของผู้ใช้ผ่าน Web3Auth Provider 
    // เพื่อเซ็นอนุมัติและโอนเหรียญ (เช่น USDT) ไปหากระเป๋าคุณจริงๆ
    // ตัวอย่างจำลองความล่าช้าของบล็อกเชน 3 วินาที:
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 🏆 เมื่อโอนเงินบนเชนสำเร็จ -> ยิงคำสั่งเพิ่มแต้มไปที่ Supabase
    // สมมติโดเนท $1 ได้ 100 แต้ม ให้คำนวณ: amount * 100
    const rewardPoints = amount.value * 100;
    
    const { error } = await supabase
      .rpc('increment_points', { 
        row_wallet: props.userAddress.toLowerCase(), 
        x: rewardPoints 
      });

    if (error) throw error;

    alert(`🙏 ขอบคุณมากครับสำหรับการสนับสนุนช่อง! คุณได้รับ ${rewardPoints} PTS แล้ว`);
    
    // สะกิดหน้าหลักให้อัปเดตข้อมูลการ์ดแต้ม
    emit('donate-success');
    amount.value = 5; // รีเซ็ตค่าชำระเงิน
    
  } catch (error) {
    console.error('Donate Error:', error);
    alert('เกิดข้อผิดพลาดในระหว่างการทำรายการโดเนท');
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
/* 🌟 กฎเหล็ก: ล็อกสัดส่วนกล่องทุกชิ้นในการ์ดไม่ให้ขยายเกินขอบเขตพิกเซลจริง */
* {
  box-sizing: border-box;
}

.donate-card {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #374151;
  padding-bottom: 8px;
}
.card-header h3 { margin: 0; font-size: 16px; }
.donate-desc { font-size: 13px; color: #9ca3af; margin: 0 0 16px 0; }

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.quick-amounts button {
  background: #374151;
  color: #ffffff;
  border: 1px solid #4b5563;
  padding: center;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.1s;
}
.quick-amounts button.active {
  background: #2563eb;
  border-color: #3b82f6;
}

.input-group {
  display: flex;
  align-items: center;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 0 12px;
  margin-bottom: 4px; /* ปรับลดเพื่อเตรียมพื้นที่ให้กล่องทำนายแต้มด้านล่าง */
}
.input-group input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 10px 0;
  font-size: 16px;
  outline: none;
}
.currency-label { color: #10b981; font-weight: bold; font-size: 14px; }

/* 🌟 [แก้ไขจุดสำคัญ]: ปรับโครงสร้าง Wrapper ล็อกความสูงคงที่ไว้เลยที่ 40px */
.reward-estimate-wrapper {
  min-height: 40px; 
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* เปลี่ยนจาก v-if มาเป็นควบคุมผ่าน Class แทน ความสูงการ์ดหลักจะไม่ยุบตัว */
.reward-estimate {
  width: 100%;
  background: rgba(16, 185, 129, 0.1);
  border: 1px dashed #10b981;
  padding: 8px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 0.15s ease, transform 0.15s ease;
  pointer-events: none; /* ป้องกันเมาส์รบกวนตอนซ่อนอยู่ */
}

/* เมื่อกรอกเงินตัวแปรนี้จะค่อยๆ Fade ขึ้นมานิ่มๆ โดยปุ่มด้านล่างไม่ขยับเลยแม้แต่พิกเซลเดียว */
.reward-estimate.is-visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.highlight { color: #10b981; font-size: 15px; }

.btn-donate {
  width: 100%;
  background: #10b981;
  color: white;
  padding: center;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-donate:disabled { background: #4b5563; opacity: 0.6; cursor: not-allowed; }

/* --- ส่วนที่เพิ่มเข้ามาใหม่ปรับปรุงมิติคงที่ --- */

.crypto-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
}
.warning-badge {
  background: #ef4444;
  color: white;
  font-weight: 800;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}
.crypto-warning p {
  margin: 0;
  font-size: 11.5px;
  color: #fca5a5;
  line-height: 1.4;
}

.line-support {
  margin-top: 18px;
  border-top: 1px dashed #374151;
  padding-top: 14px;
  text-align: center;
}
.line-support p {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #9ca3af;
}

.btn-line {
  display: flex; /* เปลี่ยนจาก inline-flex เป็น flex เพื่อความนิ่งของบล็อก */
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #06c755;
  color: white;
  text-decoration: none;
  padding: 11px 0;
  border-radius: 8px;
  font-weight: bold;
  font-size: 13.5px;
  transition: background 0.2s;
}
.btn-line:hover { background: #05b04b; }
.line-icon { font-size: 16px; }
</style>