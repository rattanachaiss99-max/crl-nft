<template>
  <div class="idle-game-card">
    <!-- 1. ส่วนหัวแสดงแต้ม และทรัพยากรในเกม -->
    <div class="game-header">
      <div class="game-title">
        <span>🏝️</span>
        <h3>Chiang Rai Land - Mini Idle</h3>
      </div>
      <div class="resource-display">
        <span class="points-num">{{ formatPoints(userPoints) }}</span>
        <span class="resource-icon">💧</span>
      </div>
    </div>

    <div class="game-layout">
      <!-- 2. กระดาน Grid 5x5 (ถอดโมเดลตามภาพ image_dabe81.png) -->
      <div class="game-grid">
        <div 
          v-for="(cell, index) in gridCells" 
          :key="index" 
          class="grid-tile"
          :class="{ 'has-item': cell.itemType !== 'empty' }"
          @click="handleTileClick(index)"
        >
          <!-- แสดงกราฟิกหรืออิโมจิแทนไอเทมตามประเภท -->
          <div v-if="cell.itemType === 'wood_well'" class="tile-content">
            <span class="item-emoji">🪵</span>
            <span class="item-label">Lv.1</span>
          </div>
          <div v-else-if="cell.itemType === 'bronze_well'" class="tile-content">
            <span class="item-emoji">🥉</span>
            <span class="item-label">Lv.2</span>
          </div>
          <div v-else-if="cell.itemType === 'rock'" class="tile-content rock">
            <span class="item-emoji">🪨</span>
          </div>
          <div v-else class="tile-empty"></div>
        </div>
      </div>

      <!-- 3. แถบควบคุมและเช็กสิทธิ์ NFT ด้านข้าง -->
      <div class="game-controls">
        <div class="objectives-box">
          <h4>🎒 คลังสิ่งก่อสร้าง / NFT</h4>
          
          <!-- ปุ่มซื้อไอเทมปกติด้วยแต้มสะสม -->
          <button class="btn-buy" @click="buyBasicItem" :disabled="userPoints < 100">
            ➕ ซื้อบ่อน้ำไม้ (ใช้ 100 💧)
          </button>

          <div class="nft-status-list">
            <h5>💳 NFT ที่ตรวจพบในกระเป๋าคุณ:</h5>
            
            <!-- ตรวจเช็กสิทธิ์ NFT จริง/จำลอง จาก Smart Contract -->
            <div class="nft-item" :class="{ 'owned': hasBronzeWellNFT }">
              <span class="status-dot"></span>
              <span>NFT Bronze Well (บ่อน้ำทองสัมฤทธิ์)</span>
              <span class="nft-badge">{{ hasBronzeWellNFT ? 'มีสิทธิ์' : 'ไม่มี' }}</span>
            </div>
            
            <div class="nft-item" :class="{ 'owned': hasSilverWellNFT }">
              <span class="status-dot"></span>
              <span>NFT Silver Well (บ่อน้ำเงิน)</span>
              <span class="nft-badge">{{ hasSilverWellNFT ? 'มีสิทธิ์' : 'ไม่มี' }}</span>
            </div>
          </div>
        </div>

        <button class="btn-reset" @click="resetGrid">Reset Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// สมมติรับ Props แต้มมาจากหน้า Home หลัก
const userPoints = ref<number>(620); // สเตตัสเริ่มต้นตามภาพตัวอย่าง

// สเตตัสจำลองสิทธิ์การถือครอง NFT ของกระเป๋าผู้ใช้ที่ล็อกอินอยู่
const hasBronzeWellNFT = ref<boolean>(true);  // สมมติว่าในกระเป๋ามี NFT ตัวนี้
const hasSilverWellNFT = ref<boolean>(false); // สมมติว่าไม่มี

interface GridCell {
  id: number;
  itemType: 'empty' | 'wood_well' | 'bronze_well' | 'rock';
  level: number;
}

// สร้างช่องตาราง 25 ช่อง (5x5) และจำลองวางไอเทมบางส่วนให้เหมือนในภาพ image_dabe81.png
const gridCells = ref<GridCell[]>([
  { id: 1, itemType: 'empty', level: 0 }, { id: 2, itemType: 'empty', level: 0 }, { id: 3, itemType: 'empty', level: 0 }, { id: 4, itemType: 'wood_well', level: 1 }, { id: 5, itemType: 'empty', level: 0 },
  { id: 6, itemType: 'empty', level: 0 }, { id: 7, itemType: 'empty', level: 0 }, { id: 8, itemType: 'wood_well', level: 1 }, { id: 9, itemType: 'empty', level: 0 }, { id: 10, itemType: 'empty', level: 0 },
  { id: 11, itemType: 'empty', level: 0 }, { id: 12, itemType: 'wood_well', level: 1 }, { id: 13, itemType: 'empty', level: 0 }, { id: 14, itemType: 'rock', level: 0 }, { id: 15, itemType: 'empty', level: 0 },
  { id: 16, itemType: 'empty', level: 0 }, { id: 17, itemType: 'rock', level: 0 }, { id: 18, itemType: 'rock', level: 0 }, { id: 19, itemType: 'empty', level: 0 }, { id: 20, itemType: 'wood_well', level: 1 },
  { id: 21, itemType: 'empty', level: 0 }, { id: 22, itemType: 'empty', level: 0 }, { id: 23, itemType: 'empty', level: 0 }, { id: 24, itemType: 'empty', level: 0 }, { id: 25, itemType: 'empty', level: 0 },
]);

const formatPoints = (val: number) => val.toLocaleString();

// ฟังก์ชันซ่อม/สลับไอเทมบนกระดานเมื่อกดคลิก (เช่น ระบบ Merge)
const handleTileClick = (index: number) => {
  const cell = gridCells.value[index];
  if (cell.itemType === 'wood_well') {
    // ตัวอย่างลอจิก: ถ้ามี NFT บ่อน้ำสัมฤทธิ์ ถึงจะกดอัปเกรดเลเวลจากเลเวล 1 เป็นเลเวล 2 ได้
    if (hasBronzeWellNFT.value) {
      gridCells.value[index].itemType = 'bronze_well';
      gridCells.value[index].level = 2;
    } else {
      alert('🔒 คุณต้องครอบครอง NFT Bronze Well ในกระเป๋าก่อนเพื่อผสมไอเทมนี้!');
    }
  }
};

// ซื้อสิ่งก่อสร้างพื้นฐานลงช่องว่าง
const buyBasicItem = () => {
  if (userPoints.value >= 100) {
    const emptyIndex = gridCells.value.findIndex(c => c.itemType === 'empty');
    if (emptyIndex !== -1) {
      userPoints.value -= 100;
      gridCells.value[emptyIndex] = { id: emptyIndex + 1, itemType: 'wood_well', level: 1 };
    } else {
      alert('กระดานเต็มแล้วครับ!');
    }
  }
};

const resetGrid = () => {
  gridCells.value = gridCells.value.map((c, i) => ({
    id: i + 1,
    itemType: i === 3 || i === 7 || i === 11 || i === 19 ? 'wood_well' : i === 13 || i === 16 || i === 17 ? 'rock' : 'empty',
    level: 0
  }));
};

// 🔄 ระบบ Idle Loop: เพิ่มแต้มให้อัตโนมัติทุก ๆ 3 วินาทีตามจำนวนสิ่งก่อสร้างบนกระดาน
let idleTimer: any = null;
onMounted(() => {
  idleTimer = setInterval(() => {
    let passiveIncome = 0;
    gridCells.value.forEach(cell => {
      if (cell.itemType === 'wood_well') passiveIncome += 1;    // บ่อน้ำธรรมดาผลิต +1 💧
      if (cell.itemType === 'bronze_well') passiveIncome += 5;  // บ่อน้ำระดับ NFT ผลิต +5 💧
    });
    if (passiveIncome > 0) {
      userPoints.value += passiveIncome;
      // ในโค้ดจริงคุณสามารถเขียนคำสั่งให้อัปเดตค่านี้กลับไปที่ตาราง users ใน Supabase ได้ด้วยครับ
    }
  }, 3000);
});

onUnmounted(() => {
  if (idleTimer) clearInterval(idleTimer);
});
</script>

<style scoped>
.idle-game-card {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 20px;
  color: #ffffff;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: #111827;
  padding: 10px 16px;
  border-radius: 12px;
}
.game-title { display: flex; align-items: center; gap: 8px; }
.game-title h3 { margin: 0; font-size: 16px; }

.resource-display {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #374151;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
}
.points-num { font-size: 18px; color: #60a5fa; }

.game-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

/* 🎨 จัดสไตล์ตารางกระดานเกมให้เหมือนภาพตัวอย่าง */
.game-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 4px;
  background: #b5a489; /* พื้นหลังสีทรายขอบกระดาน */
  padding: 6px;
  border-radius: 8px;
  aspect-ratio: 1 / 1;
}

.grid-tile {
  background: #55a630; /* พื้นหญ้าสีเขียวตามรูปภาพ */
  border-radius: 4px;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.1s;
  box-shadow: inset 0 -3px 0 rgba(0,0,0,0.2);
}
.grid-tile:hover { transform: scale(1.03); }

.tile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item-emoji { font-size: 24px; }
.item-label {
  font-size: 9px;
  background: rgba(0,0,0,0.6);
  padding: 1px 4px;
  border-radius: 4px;
  color: #fff;
}

.game-controls {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.objectives-box {
  background: #111827;
  padding: 14px;
  border-radius: 12px;
  height: 100%;
}
.objectives-box h4 { margin: 0 0 12px 0; font-size: 14px; color: #9ca3af; }

.btn-buy {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: center;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 16px;
}
.btn-buy:disabled { background: #4b5563; opacity: 0.5; }

.nft-status-list h5 { margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; }

.nft-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  background: #1f2937;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 6px;
  color: #9ca3af;
  border: 1px solid transparent;
}
.nft-item.owned {
  color: #34d399;
  background: rgba(52, 211, 153, 0.05);
  border-color: rgba(52, 211, 153, 0.2);
}

.status-dot { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; }
.nft-item.owned .status-dot { background: #34d399; }
.nft-badge { font-weight: bold; }

.btn-reset {
  background: #374151;
  color: #9ca3af;
  border: none;
  padding: center;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
}
</style>