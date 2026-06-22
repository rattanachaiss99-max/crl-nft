<template>
  <div class="quest-tracker-panel">
    <div class="glow-effect"></div>
    
      <div class="tracker-header">
        <h2 class="tracker-title">
          <span class="icon-amber">📡</span>
          <span>คำสั่งปฏิบัติการ</span>
        </h2>
        <span class="quest-count">
          {{ activeQuests.length }} ภารกิจหลัก
        </span>
      </div>

    <div class="quest-list-container">
      <!-- กรณีไม่มีเควส -->
      <div v-if="activeQuests.length === 0" class="empty-state">
        <div class="empty-icon">✅</div>
        <div class="empty-title">ระบบทำงานสมบูรณ์!</div>
        <p class="empty-desc">
          สแกนพื้นที่หรือเปิดระบบเพิ่มเติมเพื่อรับคำสั่งปฏิบัติการใหม่
        </p>
      </div>

      <!-- รายการเควส -->
      <div v-else class="quest-list-scroll">
        <div 
          v-for="quest in activeQuests" 
          :key="quest.id" 
          :id="`quest-card-${quest.id}`"
          class="quest-card"
          :class="{ 'quest-completed-border': isQuestAllDone(quest) }"
        >
          <!-- แถบชื่อเควส -->
          <div class="quest-banner" @click="toggleCollapse(quest.id)">
            <div class="quest-title-group">
              <div class="status-indicator" :class="isQuestAllDone(quest) ? 'status-ready' : 'status-pending'"></div>
              <div>
                <h3 class="quest-title" :class="{ 'text-emerald': isQuestAllDone(quest) }">
                  {{ quest.title }}
                </h3>
                <span v-if="isQuestAllDone(quest)" class="ready-label">
                  ✦ พร้อมรับทรัพยากร ✦
                </span>
              </div>
            </div>
            <button class="btn-collapse">
              {{ collapsedQuests[quest.id] ? '🔽' : '🔼' }}
            </button>
          </div>

          <!-- เนื้อหาเควส (ซ่อน/แสดงได้) -->
          <div v-if="!collapsedQuests[quest.id]" class="quest-body">
            <p class="quest-desc">{{ quest.description }}</p>

            <!-- เป้าหมาย -->
            <div class="objectives-section">
              <span class="section-label">เป้าหมายปฏิบัติการ (Objectives):</span>
              
              <div v-for="obj in quest.objectives" :key="obj.id" class="objective-card">
                <div class="objective-header">
                  <div class="objective-name-group">
                    <span class="obj-icon">{{ obj.completed ? '✅' : '⭕' }}</span>
                    <span class="obj-text" :class="{ 'obj-completed-text': obj.completed }">
                      {{ obj.text }}
                    </span>
                  </div>
                  <span class="obj-progress-text">
                    {{ obj.current }} <span class="text-slash">/</span> {{ obj.target }}
                  </span>
                </div>

                <div v-if="!obj.completed && obj.target > 1" class="mini-progress-bg">
                  <div class="mini-progress-fill" :style="{ width: getProgressPercent(obj) + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- รางวัล -->
            <div class="reward-panel">
              <div class="reward-header">
                <span class="section-label reward-label">
                  📦 ทรัพยากรที่จะได้รับ (Rewards):
                </span>
              </div>
              
              <div class="rewards-grid">
                <!-- เปลี่ยนจาก Gold เป็น เครดิต (CR) -->
                <span class="reward-badge badge-gold">
                  💳 +{{ quest.rewardGold }} CR
                </span>
                <!-- เปลี่ยนจาก XP เป็น ข้อมูล (DATA) -->
                <span class="reward-badge badge-xp">
                  💾 +{{ quest.rewardXp }} DATA
                </span>
                <span v-if="quest.rewardItemName" class="reward-badge badge-item">
                  ✦ {{ quest.rewardItemName }}
                </span>
              </div>

              <!-- ปุ่มกดรับรางวัล -->
              <button 
                v-if="isQuestAllDone(quest)" 
                :id="`claim-btn-${quest.id}`"
                @click="claimReward(quest.id)" 
                class="btn-claim-reward"
              >
                ยืนยันและรับทรัพยากร
              </button>
              <div v-else class="pending-claim-text">
                ดำเนินการตามเป้าหมายเพื่อปลดล็อกทรัพยากร
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="claimedQuests.length > 0" class="tracker-footer">
      <span>ประวัติการปฏิบัติการ</span>
      <span class="archived-count">เสร็จสิ้น {{ claimedQuests.length }} รายการ</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// นำเข้า Type ของพี่ (สมมติว่าดึงมาจากไฟล์ types.ts)
// import { Quest } from '../data/types'; 

// 1. รับค่า Props เข้ามาแทนการใส่ Parameter ใน React
const props = defineProps<{
  quests: any[]; // เปลี่ยนเป็น Quest[] ได้ถ้า Import Type มาแล้ว
}>();

// 2. กำหนด Event ที่จะส่งกลับไปหาตัวแม่ (แทน onClaimReward ของ React)
const emit = defineEmits<{
  (e: 'claimReward', questId: string): void;
}>();

// 3. แปลง useState เป็น ref
const collapsedQuests = ref<Record<string, boolean>>({});

const toggleCollapse = (id: string) => {
  collapsedQuests.value[id] = !collapsedQuests.value[id];
};

// 4. แปลงตัวแปรธรรมดาเป็น computed เพื่อให้หน้าจออัปเดตอัตโนมัติเมื่อ Props เปลี่ยน
const activeQuests = computed(() => props.quests.filter(q => q.status === 'active'));
const claimedQuests = computed(() => props.quests.filter(q => q.status === 'completed'));

// Helper Functions สำหรับเช็กข้อมูลใน Template
const isQuestAllDone = (quest: any) => {
  return quest.objectives.every((obj: any) => obj.completed);
};

const getProgressPercent = (obj: any) => {
  return Math.min(100, (obj.current / obj.target) * 100);
};

// ฟังก์ชันสำหรับกดปุ่ม Claim 
const claimReward = (questId: string) => {
  emit('claimReward', questId);
};
</script>

<style scoped>
/* =========================================
   PURE CSS QUEST TRACKER (No Tailwind)
   ========================================= */
.quest-tracker-panel {
  background-color: #18181b; /* zinc-900 */
  border: 2px solid #27272a; /* zinc-800 */
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  font-family: sans-serif;
}

.glow-effect {
  position: absolute;
  top: 0; left: 0;
  width: 128px; height: 128px;
  background-color: rgba(245, 158, 11, 0.05);
  border-radius: 50%;
  filter: blur(24px);
  pointer-events: none;
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #27272a;
}

.tracker-title {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #f4f4f5; /* zinc-100 */
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.icon-amber { font-size: 16px; }

.quest-count {
  font-size: 10px;
  font-family: monospace;
  color: #71717a; /* zinc-500 */
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
}

/* Scrollable List */
.quest-list-container {
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}
.quest-list-container::-webkit-scrollbar { width: 4px; }
.quest-list-container::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }

.empty-state {
  text-align: center;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-icon { font-size: 40px; margin-bottom: 8px; filter: grayscale(0.5) opacity(0.5); }
.empty-title {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 1px;
  color: #a1a1aa;
}
.empty-desc {
  font-size: 11.5px;
  color: #71717a;
  margin-top: 4px;
  max-width: 200px;
  line-height: 1.5;
}

.quest-list-scroll {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quest-card {
  border: 2px solid #27272a;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: rgba(24, 24, 27, 0.5);
}
.quest-completed-border {
  border-color: rgba(16, 185, 129, 0.4); /* emerald */
  background-color: rgba(16, 185, 129, 0.05);
}

.quest-banner {
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.quest-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status-indicator {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.status-pending {
  background-color: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.3);
}
.status-ready {
  background-color: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
  animation: pulse-glow 2s infinite;
}
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.quest-title {
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #f4f4f5;
  margin: 0;
}
.text-emerald { color: #34d399; }
.ready-label {
  font-size: 9px;
  font-family: monospace;
  font-weight: bold;
  color: #34d399;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  margin-top: 2px;
}
.btn-collapse {
  background: none; border: none; cursor: pointer; font-size: 12px;
  color: #71717a; transition: color 0.2s;
}

.quest-body {
  padding: 0 14px 14px 14px;
  border-top: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 14px;
}
.quest-desc {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.objectives-section { display: flex; flex-direction: column; gap: 10px; }
.section-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  font-family: monospace;
  font-weight: bold;
}
.objective-card {
  background-color: rgba(9, 9, 11, 0.55);
  border: 1px solid #18181b;
  border-radius: 4px;
  padding: 10px;
}
.objective-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.objective-name-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.obj-icon { font-size: 14px; flex-shrink: 0; }
.obj-text {
  font-size: 11.5px;
  color: #cbd5e1;
  font-weight: 500;
  line-height: 1;
}
.obj-completed-text {
  color: #64748b;
  text-decoration: line-through;
}
.obj-progress-text {
  font-size: 11px;
  font-family: monospace;
  font-weight: 600;
  color: #94a3b8;
}
.text-slash { color: #475569; }

.mini-progress-bg {
  height: 4px; width: 100%;
  background-color: #18181b;
  border-radius: 9999px;
  margin-top: 8px;
  overflow: hidden;
}
.mini-progress-fill {
  height: 100%;
  background: linear-gradient(to right, #0891b2, #22d3ee);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.reward-panel {
  background-color: rgba(24, 24, 27, 0.6);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 4px;
  padding: 12px;
}
.reward-header { margin-bottom: 8px; }
.reward-label { display: flex; align-items: center; gap: 4px; }
.rewards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.reward-badge {
  font-size: 10px;
  background-color: #09090b;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}
.badge-gold { border: 1px solid #27272a; color: #f59e0b; }
.badge-xp { border: 1px solid #27272a; color: #22d3ee; }
.badge-item { border: 1px solid rgba(146, 64, 14, 0.3); color: #fbbf24; font-size: 9px; }

.btn-claim-reward {
  width: 100%;
  padding: 8px 0;
  background: linear-gradient(to right, #f59e0b, #d97706);
  color: #09090b;
  font-weight: bold;
  border-radius: 4px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
  transition: filter 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.btn-claim-reward:hover { filter: brightness(1.1); }
.pending-claim-text {
  font-size: 10px;
  color: #71717a;
  font-style: italic;
  text-align: center;
  padding: 2px 0;
}

.tracker-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(39, 39, 42, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #71717a;
}
.archived-count {
  font-family: monospace;
  background-color: #09090b;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  border: 1px solid rgba(39, 39, 42, 0.8);
}
</style>