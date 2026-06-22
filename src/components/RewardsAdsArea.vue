<template>
  <div class="rewards-ads-container">    
    <div class="reward-card">
      <div class="card-badge">Free Rewards</div>
      <div>
        <span class="card-icon">📺 ชมโฆษณาเพื่อรับแต้ม </span>
        <p>รับชมวิดีโอสั้นเพื่อสะสม Reward Credits สำหรับแลกเครื่องดื่มฟรี</p>
        
        <button 
          @click="startWatchAd" 
          :disabled="isWatchingAd || !isAdReady" 
          class="action-btn ads-btn"
        >
          <span v-if="isWatchingAd">⏳ กำลังรับชมโฆษณา...</span>
          <span v-else-if="!isAdReady">🔒 กำลังเตรียมวิดีโอ...</span>
          <span v-else>▶️ เริ่มรับชมโฆษณา</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase';

const props = defineProps({
  userAddress: {
    type: String,
    required: true
  }
});

const isWatchingAd = ref(false);
const isAdReady = ref(false); 
let rewardedSlot = null;

onMounted(() => {
  // 1. ดึงออบเจกต์หน้าต่างโฆษณาขึ้นมา ถ้าไม่มีให้สร้างอาร์เรย์เปล่ามารองรับ
  window.adsbygoogle = window.adsbygoogle || [];

  // 2. ครอบด้วยไทม์เอาต์เล็กน้อยเพื่อให้มั่นใจว่าโครงสร้าง DOM นิ่งสนิทแล้ว
  setTimeout(() => {
    try {
      // 3. สั่งรันฟังก์ชันติดตั้งโฆษณาในบล็อกไตรเพื่อดักจับความผิดพลาด
      window.adsbygoogle.push(() => {
        if (window.adsbygoogle.defineRewardedAdSlot) {
          
          rewardedSlot = window.adsbygoogle.defineRewardedAdSlot('/1234567/example-rewarded-slot', {
            onAdLoaded: () => {
              isAdReady.value = true;
              console.log('AdSense: วิดีโอพร้อมแสดงผลแล้ว');
            },
            onAdClosed: () => {
              isWatchingAd.value = false;
              // ถ้าโฆษณาปิดตัวลง ให้ลองส่งคำขอชิ้นถัดไปเบาๆ โดยไม่ใช้ push ซ้ำ
              try {
                if (rewardedSlot) window.adsbygoogle.requestRewardedAd(rewardedSlot);
              } catch (e) {
                console.log('AdSense: การดึงโฆษณาซ้ำถูกจำกัดไว้');
              }
            },
            onRewardGranted: (event) => {
              triggerReward();
            },
            onAdRejected: () => {
              isWatchingAd.value = false;
              alert('😢 ไม่สามารถเล่นโฆษณาได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
            }
          });

          // สั่งให้โหลดตัววิดีโอมารอ
          window.adsbygoogle.requestRewardedAd(rewardedSlot);
        } else {
          // หากรันบน localhost แล้วไม่เจอระบบให้ปลดล็อกปุ่มทดสอบทันที
          isAdReady.value = true;
        }
      });
    } catch (error) {
      // 🛠️ ช็อตสำคัญ: ถ้าเจอบั๊ก TagError โฆษณาซ้ำ เราจะทำการดักไว้ตรงนี้เลย
      // เพื่อบอกแอปพลิเคชันว่า "รับทราบแล้ว ไม่ต้องบ่น หน้าเว็บทำงานต่อได้ตามปกติ"
      if (error.message && error.message.includes("already have ads in them")) {
        console.warn('AdSense Warning: ตรวจพบการพยายามโหลดช่องโฆษณาซ้ำ ระบบได้ทำการระงับและตั้งค่าให้ปุ่มพร้อมใช้งานต่อแล้ว');
        isAdReady.value = true; // ปลดล็อกปุ่มให้ใช้งานใน Sandbox/Localhost ต่อได้เลย ไม่ให้ระบบค้าง
      } else {
        // หากเป็นความผิดพลาดร้ายแรงเรื่องอื่นให้พิมพ์บอกไว้ในคอนโซล
        console.error('AdSense Unexpected Error:', error);
      }
    }
  }, 100); // ดีเลย์ 100 มิลลิวินาที
});

const startWatchAd = () => {
  if (!props.userAddress) {
    alert('❌ กรุณาเชื่อมต่อกระเป๋าเงินก่อนชมโฆษณาเพื่อสะสมแต้มครับ');
    return;
  }

  isWatchingAd.value = true;

  const adsbygoogle = window.adsbygoogle || [];
  if (rewardedSlot && isAdReady.value) {
    adsbygoogle.showRewardedAd(rewardedSlot);
  } else {
    console.log('Running in Sandbox Mode (No actual AdSense connection yet)');
    setTimeout(() => {
      triggerReward();
    }, 5000);
  }
};

const triggerReward = async () => {
  isWatchingAd.value = false;
  
  // 🛑 สเต็ปนี้ดีมาก: มีการป้องกันไว้แล้วถ้าไม่มี Address จะไม่ทำงานต่อ
  if (!props.userAddress) {
    alert('❌ ไม่พบเลขกระเป๋าเงินของคุณ กรุณาลองเชื่อมต่อใหม่อีกครั้ง');
    return;
  }

  try {
  // สภาพของโค้ดใน triggerReward ตอนนี้จะแมตช์กับรูปตารางใหม่ของคุณ 100%
    const { error } = await supabase
    .rpc('increment_points', { 
      row_wallet: props.userAddress.toLowerCase(), 
      x: 10 
    });
    if (error) throw error;
    alert(`🎉 ยินดีด้วย! คุณได้รับ 10 Reward Credits แล้ว!`);

  } catch (error) {
    console.error('RPC Error:', error);
    alert('ระบบฐานข้อมูลขัดข้อง ไม่สามารถแจกแต้มได้');
  }
};

</script>

<style scoped>
/* ดึงสไตล์เดิมของคุณมาใช้งานต่อได้เลย */
.rewards-ads-container {
  width: 100%;
}
.reward-card {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.card-badge {
  position: absolute;
  top: 16px; right: 16px;
  font-size: 10px; font-weight: 700;
  color: #4b5563; text-transform: uppercase;
}
.card-icon { font-size: 32px; display: block; margin-bottom: 12px; }
h3 { font-size: 18px; margin: 0 0 8px 0; color: white; }
p { font-size: 13px; color: #9ca3af; margin: 0 0 20px 0; }
.action-btn {
  width: 100%; padding: center; border-radius: 12px;
  font-size: 14px; font-weight: 600; cursor: pointer; border: none;
}
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ads-btn { background: #10b981; color: #000; }
.ads-btn:hover:not(:disabled) { background: #059669; }
</style>