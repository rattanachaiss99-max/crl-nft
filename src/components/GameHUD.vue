<template>
  <div class="rpg-hud-wrapper">
    <div class="rpg-container">
      
      <header class="rpg-header">
        <div class="header-profile">
          <div class="level-badge">
            <span class="lvl-label">LVL</span>
            <span class="lvl-value">{{ level }}</span>
          </div>
          <div class="profile-info">
            <h2 class="class-title">หัวหน้าวิศวกรระบบ</h2>
            <div class="gold-text">{{ gold }} CREDITS</div>
          </div>
        </div>

        <div class="xp-section">
          <div class="xp-labels">
            <span class="xp-title">ข้อมูลสะสม (Data Collected)</span>
            <span class="xp-value">{{ xp }} / {{ maxXp }}</span>
          </div>
          <div class="xp-bar-bg">
            <div class="xp-bar-fill" :style="{ width: xpPercentage + '%' }"></div>
          </div>
        </div>
      </header>

      <main class="main-grid">
        
        <section class="col-left">
          <div class="rpg-card">
            <h3 class="card-title">สถานะระบบปฏิบัติการ (System Vitals)</h3>
            
            <div class="vital-group">
              <div class="vital-labels text-health">
                <span>สภาพโครงสร้าง (Integrity)</span>
                <span class="vital-value">{{ health }} / {{ maxHealth }}</span>
              </div>
              <div class="vital-bar-wrap h-large">
                <div class="vital-bar-trail" :style="{ width: 'calc(' + delayedHealthPercentage + '% - 4px)' }"></div>
                <div class="vital-bar-fill fill-health" :style="{ width: healthPercentage + '%' }"></div>
              </div>
            </div>

            <div class="vital-group">
              <div class="vital-labels text-mana">
                <span>พลังงานสำรอง (Power)</span>
                <span class="vital-value">{{ mana }} / {{ maxMana }}</span>
              </div>
              <div class="vital-bar-wrap">
                <div class="vital-bar-fill fill-mana" :style="{ width: manaPercentage + '%' }"></div>
              </div>
            </div>

            <div class="vital-group">
              <div class="vital-labels text-stamina">
                <span>ระบบหล่อเย็น (Coolant)</span>
                <span class="vital-value">{{ stamina }} / {{ maxStamina }}</span>
              </div>
              <div class="vital-bar-wrap">
                <div class="vital-bar-fill fill-stamina" :style="{ width: staminaPercentage + '%' }"></div>
              </div>
            </div>
          </div>
          
          <QuestTracker 
            :quests="quests" 
            @claim-reward="handleClaimQuestReward" 
          />
        </section>

        <section class="col-right">
          <div class="rpg-card">
            <h3 class="card-title mb-3">แผงควบคุมปฏิบัติการ (Operations Console)</h3>
            <div class="action-grid">
              <button @click="explore('forest')" :disabled="health <= 0" class="btn-action btn-forest">
                ⚙️ ค้นหาอะไหล่
              </button>
              <button @click="explore('ruins')" :disabled="health <= 0" class="btn-action btn-ruins">
                📡 สแกนพื้นที่
              </button>
              <button @click="explore('beast')" :disabled="health <= 0" class="btn-action btn-beast">
                ⚡ กู้คืนระบบฉุกเฉิน
              </button>
              <button @click="rest" class="btn-action btn-rest">
                🔋 ชาร์จแบตเตอรี่
              </button>
            </div>
            
            <div class="log-console">
              <div v-for="log in logs" :key="log.id" class="log-entry" :class="getLogClass(log.type)">
                <span class="log-time">[{{ log.time }}]</span> {{ log.text }}
              </div>
            </div>
          </div>

          <div class="rpg-card">
             <div class="inventory-header">
               <h3 class="card-title no-border">คลังเก็บอะไหล่และอุปกรณ์ (Storage)</h3>
               <span class="inv-count">{{ inventory.length }} / 20 Slots</span>
             </div>

             <div class="inventory-layout">
                <div class="inv-slots-area">
                  <div class="slots-grid">
                    <div v-for="index in 20" :key="index" class="inv-slot-box">
                      <button v-if="inventory[index - 1]" 
                        @click="selectedItemIndex = index - 1"
                        class="inv-slot-btn"
                        :class="{ 'active': selectedItemIndex === index - 1 }">                      
                      <img 
                        :src="`/items/${inventory[index - 1].icon}`" 
                        :alt="inventory[index - 1].name" 
                        class="item-image-icon" 
                      />
                      <span v-if="inventory[index - 1].quantity > 1" class="item-qty">
                        x{{ inventory[index - 1].quantity }}
                      </span>
                      <div v-if="inventory[index - 1].equipped" class="item-equipped-dot"></div>
                    </button>
                    </div>
                  </div>
                </div>

                <div class="inv-details-panel">
                  <div v-if="selectedItem" class="item-info">
                    <h4 class="item-name">{{ selectedItem.name }}</h4>
                    <span class="item-type-badge">{{ selectedItem.type }}</span>
                    <p class="item-desc">"{{ selectedItem.description }}"</p>
                  </div>
                  <div v-else class="item-empty-state">
                    คลิกเลือกช่องเก็บของเพื่อตรวจสอบอุปกรณ์
                  </div>

                  <div v-if="selectedItem" class="item-actions">
                    <button v-if="selectedItem.type === 'consumable'" @click="consumeItem" class="btn-item btn-consume">
                      ใช้งานไอเทม
                    </button>
                    <button v-else-if="selectedItem.type === 'weapon' || selectedItem.type === 'armor'" @click="toggleEquip" class="btn-item btn-equip">
                      {{ selectedItem.equipped ? 'ถอดอุปกรณ์' : 'ติดตั้งอุปกรณ์' }}
                    </button>
                  </div>
                </div>
             </div>
          </div>

        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { STARTER_ITEMS, INITIAL_QUESTS } from '../data/gameData';
import QuestTracker from './QuestTracker.vue';
// STATE
const level = ref(1);
const xp = ref(20);
const maxXp = ref(100);
const gold = ref(150);
const health = ref(100);
const maxHealth = ref(100);
const mana = ref(75);
const maxMana = ref(100);
const stamina = ref(80);
const maxStamina = ref(100);
const inventory = ref<Array<any>>(JSON.parse(JSON.stringify(STARTER_ITEMS)));
const quests = ref<Array<any>>(JSON.parse(JSON.stringify(INITIAL_QUESTS)));
const logs = ref<Array<{id: number; text: string; time: string; type: string}>>([
  { id: Date.now(), text: "Garrison exploring simulator started. Good luck Wanderer!", time: "12:00", type: "info" }
]);

const selectedItemIndex = ref<number | null>(0);

// COMPUTED
const healthPercentage = computed(() => Math.max(0, Math.min(100, (health.value / maxHealth.value) * 100)));
const manaPercentage = computed(() => Math.max(0, Math.min(100, (mana.value / maxMana.value) * 100)));
const staminaPercentage = computed(() => Math.max(0, Math.min(100, (stamina.value / maxStamina.value) * 100)));
const xpPercentage = computed(() => Math.max(0, Math.min(100, (xp.value / maxXp.value) * 100)));
const activeQuests = computed(() => quests.value.filter(q => !q.completed));
const selectedItem = computed(() => selectedItemIndex.value !== null ? inventory.value[selectedItemIndex.value] : null);

// Classic Damage delay residue logic in Vue 3
const delayedHealth = ref(health.value);
watch(health, (newVal) => {
  if (newVal < delayedHealth.value) {
    setTimeout(() => {
      delayedHealth.value = newVal;
    }, 600);
  } else {
    delayedHealth.value = newVal;
  }
});
const delayedHealthPercentage = computed(() => Math.max(0, Math.min(100, (delayedHealth.value / maxHealth.value) * 100)));

// ACTIONS
function rest() {
  health.value = Math.min(maxHealth.value, health.value + 40);
  mana.value = Math.min(maxMana.value, mana.value + 30);
  stamina.value = Math.min(maxStamina.value, stamina.value + 50);
  addLog("Healed at Campfire.", "info");
}

function explore(zone: string) {
  if (health.value <= 10) {
    addLog("Vitals critically low! Rest before exploring.", "info");
    return;
  }

  if (zone === 'forest') {
    stamina.value = Math.max(0, stamina.value - 15);
    health.value = Math.max(1, health.value - 5);
    addLog("Searched the forest floor. Found a wild herb!", "loot");
    
    quests.value.forEach(q => {
      q.objectives.forEach((obj: any) => {
        if (obj.text.includes('Forage') && obj.current < obj.target) {
          obj.current++;
          if (obj.current >= obj.target) {
            obj.completed = true;
            q.completed = true;
            addLog("Quest objective completed!", "quest");
          }
        }
      });
    });
  } else if (zone === 'ruins') {
    mana.value = Math.max(0, mana.value - 20);
    health.value = Math.max(1, health.value - 20);
    addLog("Raid ancient Whispering Ruins. Received epic chest plate!", "loot");
    inventory.value.push({ id: 'epic-chest', name: 'Ancient Cuirass', description: 'Legendary plate.', type: 'armor', rarity: 'epic', quantity: 1 });
  } else {
    stamina.value = Math.max(0, stamina.value - 30);
    health.value = Math.max(1, health.value - 35);
    addLog("Slashed the Forest Beast. Yielded 120 Gold and 40 XP!", "combat");
    xp.value += 40;
    gold.value += 120;
    checkLevelUp();
  }
}

function checkLevelUp() {
  if (xp.value >= maxXp.value) {
    level.value++;
    xp.value = xp.value - maxXp.value;
    maxHealth.value += 15;
    health.value = maxHealth.value;
    addLog("LEVEL UP! Stat caps increased and health fully restored.", "levelUp");
  }
}

function consumeItem() {
  if (!selectedItem.value) return;
  health.value = Math.min(maxHealth.value, health.value + 30);
  selectedItem.value.quantity--;
  if (selectedItem.value.quantity <= 0) {
    inventory.value.splice(selectedItemIndex.value!, 1);
    selectedItemIndex.value = 0;
  }
  addLog("Consumed rejuvenating draft. Restored 30 HP.", "info");
}

function toggleEquip() {
  if (!selectedItem.value) return;
  selectedItem.value.equipped = !selectedItem.value.equipped;
  addLog((selectedItem.value.equipped ? "Equipped " : "Unequipped ") + selectedItem.value.name, "info");
}

function addLog(text: string, type: string) {
  const now = new Date();
  logs.value.unshift({
    id: Date.now(),
    text,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type
  });
}

// 🛠️ เปลี่ยนการคืนค่าจาก Tailwind Class เป็น CSS Class ธรรมดา
const getLogClass = (type: string) => {
  if (type === 'combat') return 'log-combat';
  if (type === 'loot') return 'log-loot';
  if (type === 'quest') return 'log-quest';
  if (type === 'levelUp') return 'log-levelup';
  return 'log-default';
};

const getItemGlyph = (item: any) => {
  if (!item) return '📦';  

const iconName = item.icon;
  if (iconName === 'Sword' || iconName === 'Wand2') return '⚔️';
  if (iconName === 'ShieldAlert' || iconName === 'Shield') return '🛡️';
  if (iconName === 'Sparkles') return '❤️';
  if (iconName === 'Droplet') return '💧';
  if (iconName === 'Coins') return '🪙';
  if (iconName === 'Leaf') return '🌿';
  if (iconName === 'Hammer') return '🔨';
  if (iconName === 'Flame') return '🔥';
  if (iconName === 'Grape') return '🦋';
  if (iconName === 'Gem') return '💎';
  if (item.type === 'weapon') return '⚔️';
  if (item.type === 'armor') return '🛡️';
  if (item.type === 'consumable') return '🧪';
  
  return '📦';
};

function handleClaimQuestReward(questId: string) {
  const quest = quests.value.find(q => q.id === questId);
  
  if (quest) {
    // จ่ายเงินทอง และ ค่าประสบการณ์
    gold.value += quest.rewardGold;
    xp.value += quest.rewardXp;
    
    addLog(`สำเร็จเควส "${quest.title}"! รับ ${quest.rewardGold} Gold และ ${quest.rewardXp} XP`, "quest");
    
    // ตรวจสอบว่ามีไอเทมรางวัลแถมมาด้วยไหม
    if (quest.rewardItemName) {
      // ตรวจสอบว่าในกระเป๋ามีไอเทมชิ้นนี้อยู่แล้วและซ้อนกันได้ไหม (Stackable)
      const existingItem = inventory.value.find(item => item.name === quest.rewardItemName);
      
      if (existingItem && existingItem.quantity < existingItem.maxStack) {
        existingItem.quantity++;
      } else {
        // ถ้ายังไม่มี ให้สร้างไอเทมใหม่ยัดเข้าช่องว่างในกระเป๋า
        inventory.value.push({
          id: `reward-${Date.now()}`,
          name: quest.rewardItemName,
          description: 'ของรางวัลล้ำค่าจากการปฏิบัติภารกิจสำเร็จ',
          type: quest.rewardItemIcon === 'Sword' || quest.rewardItemIcon === 'Wand2' ? 'weapon' : 'armor',
          rarity: 'epic',
          icon: quest.rewardItemIcon || 'Sparkles',
          quantity: 1,
          maxStack: 1,
          value: Math.floor(quest.rewardGold * 1.5),
          equipped: false
        });
      }
      addLog(`ได้รับไอเทมรางวัล: [${quest.rewardItemName}] เข้ากระเป๋าแล้ว!`, "loot");
    }

    // เปลี่ยนสถานะเควสเป็น completed เพื่อย้ายไปอยู่ใน Archive Footer
    quest.status = 'completed';
    
    // เช็กเผื่อเลเวลอัพจากการได้รับ XP ก้อนใหญ่
    checkLevelUp();
  }
}
</script>

<style scoped>
.item-image-icon {
  width: 100%;
  height: 100%;
  object-fit: contain; /* ทำให้ภาพไม่เบี้ยวและอยู่กึ่งกลางพอดี */
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); /* แถมเงาให้รูปดูมีมิติเด้งขึ้นมา */
}
/* =========================================
   PURE CSS RPG HUD (No Tailwind)
   ========================================= */
.rpg-hud-wrapper {
  min-height: 100vh;
  background-color: #020617; /* slate-950 */
  color: #f1f5f9; /* slate-100 */
  padding: 24px;
  font-family: sans-serif;
}
.rpg-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* --- Header Section --- */
.rpg-header {
  background-color: #0f172a; /* slate-900 */
  border: 1px solid #1e293b; /* slate-800 */
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 768px) {
  .rpg-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.header-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}
.level-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #020617;
  border: 1px solid rgba(245, 158, 11, 0.5); /* amber-500/50 */
  border-radius: 8px;
  text-align: center;
}
.lvl-label {
  position: absolute;
  top: -6px;
  padding: 0 4px;
  background-color: #f59e0b; /* amber-500 */
  color: #020617;
  font-size: 8px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 4px;
}
.lvl-value {
  font-size: 20px;
  font-weight: 900;
  font-family: monospace;
  color: #fbbf24; /* amber-400 */
}
.class-title {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0; /* slate-200 */
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}
.gold-text {
  font-size: 12px;
  font-family: monospace;
  color: #f59e0b;
  margin-top: 2px;
}
.xp-section {
  flex: 1;
  max-width: 384px;
  width: 100%;
}
.xp-labels {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4px;
}
.xp-title {
  font-size: 9px;
  font-family: monospace;
  color: #64748b; /* slate-500 */
  text-transform: uppercase;
  letter-spacing: 1px;
}
.xp-value {
  font-size: 12px;
  font-family: monospace;
  color: #cbd5e1; /* slate-300 */
}
.xp-bar-bg {
  height: 8px;
  width: 100%;
  background-color: #020617;
  border-radius: 9999px;
  border: 1px solid #162032;
  overflow: hidden;
  position: relative;
}
.xp-bar-fill {
  height: 100%;
  background-color: #fbbf24;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* --- Main Layout Grid --- */
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: repeat(12, 1fr);
  }
  .col-left { grid-column: span 4; }
  .col-right { grid-column: span 8; }
}
.col-left, .col-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* --- Cards & UI Elements --- */
.rpg-card {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-title {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8; /* slate-400 */
  padding-bottom: 8px;
  border-bottom: 1px solid #162032;
  margin: 0;
}
.card-title.no-border {
  border-bottom: none;
  padding-bottom: 0;
}
.mb-3 { margin-bottom: 12px; }

/* --- Vitals Bars --- */
.vital-group {
  margin-bottom: 12px;
}
.vital-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.vital-value { font-family: monospace; }
.text-health { color: #fb7185; }
.text-mana { color: #22d3ee; }
.text-stamina { color: #f59e0b; }
.vital-bar-wrap {
  height: 16px;
  width: 100%;
  background-color: #020617;
  border-radius: 4px;
  border: 1px solid #1e293b;
  padding: 2px;
  position: relative;
  overflow: hidden;
}
.vital-bar-wrap.h-large {
  height: 20px;
}
.vital-bar-trail {
  position: absolute;
  top: 2px; bottom: 2px; left: 2px;
  background-color: rgba(69, 10, 10, 0.7); /* red-950/70 */
  border-radius: 4px;
  transition: width 0.7s ease-out;
}
.vital-bar-fill {
  height: 100%;
  border-radius: 4px;
  position: relative;
  transition: width 0.2s ease;
}
.fill-health { background: linear-gradient(to right, #dc2626, #fb7185); }
.fill-mana { background: linear-gradient(to right, #2563eb, #22d3ee); transition: width 0.3s; }
.fill-stamina { background: linear-gradient(to right, #d97706, #eab308); }

/* --- Quests --- */
.quest-list { display: flex; flex-direction: column; gap: 12px; }
.quest-item {
  padding: 12px;
  background-color: rgba(2, 6, 23, 0.4);
  border-radius: 8px;
  border: 1px solid #162032;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.quest-header h4 {
  font-size: 12px;
  font-weight: bold;
  color: #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}
.badge-ready {
  font-size: 9px;
  font-weight: bold;
  color: #f59e0b;
  text-transform: uppercase;
}
.objectives-list { display: flex; flex-direction: column; gap: 6px; }
.objective-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.obj-completed { color: #64748b; text-decoration: line-through; }
.obj-pending { color: #cbd5e1; }
.obj-count { font-family: monospace; color: #94a3b8; }
.btn-claim {
  width: 100%;
  padding: 4px 0;
  background-color: #f59e0b;
  color: #020617;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-claim:hover { background-color: #fbbf24; }

/* --- Actions & Logs --- */
.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 640px) {
  .action-grid { grid-template-columns: repeat(4, 1fr); }
}
.btn-action {
  padding: 10px 12px;
  background-color: #020617;
  border: 1px solid #1e293b;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-forest { color: #34d399; }
.btn-forest:hover:not(:disabled) { border-color: rgba(4, 120, 87, 0.6); }
.btn-ruins { color: #22d3ee; }
.btn-ruins:hover:not(:disabled) { border-color: rgba(29, 78, 216, 0.6); }
.btn-beast { color: #fb7185; }
.btn-beast:hover:not(:disabled) { border-color: rgba(190, 18, 60, 0.6); }
.btn-rest { background-color: #0f172a; color: #f59e0b; }
.btn-rest:hover:not(:disabled) { border-color: rgba(180, 83, 9, 0.6); }

.log-console {
  background-color: #020617;
  border: 1px solid #162032;
  border-radius: 4px;
  padding: 12px;
  height: 96px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.log-entry { padding-left: 8px; border-left: 2px solid; }
.log-time { color: #475569; }
.log-combat { border-color: #ef4444; color: #f87171; }
.log-loot { border-color: #22c55e; color: #4ade80; }
.log-quest { border-color: #f59e0b; color: #fbbf24; }
.log-levelup { border-color: #a855f7; color: #d8b4fe; }
.log-default { border-color: #334155; color: #cbd5e1; }

/* --- Inventory --- */
.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #162032;
}
.inv-count { font-size: 12px; font-family: monospace; color: #94a3b8; }
.inventory-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 768px) {
  .inventory-layout { grid-template-columns: repeat(12, 1fr); }
  .inv-slots-area { grid-column: span 7; }
  .inv-details-panel { grid-column: span 5; }
}
.slots-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  background-color: #020617;
  border-radius: 8px;
  padding: 12px;
}
.inv-slot-box {
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  border: 1px solid #1e293b;
}
.inv-slot-btn {
  width: 100%;
  height: 100%;
  padding: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: filter 0.2s;
  color: inherit;
}
.inv-slot-btn:hover { filter: brightness(1.2); }
.inv-slot-btn.active {
  border: 2px solid #fbbf24;
  border-radius: 4px;
}
.item-icon { font-size: 18px; }
.item-qty {
  position: absolute;
  bottom: 4px; right: 4px;
  font-size: 9px;
  background-color: #0f172a;
  padding: 0 4px;
  border-radius: 4px;
}
.item-equipped-dot {
  position: absolute;
  top: 4px; left: 4px;
  width: 6px; height: 6px;
  border-radius: 50%;
  background-color: #10b981;
}

.inv-details-panel {
  background-color: rgba(2, 6, 23, 0.4);
  border: 1px solid #162032;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
}
.item-info { display: flex; flex-direction: column; gap: 8px; }
.item-name {
  font-size: 12px;
  font-weight: bold;
  color: #e2e8f0;
  text-transform: uppercase;
  margin: 0;
}
.item-type-badge {
  font-size: 9px;
  background-color: #1e293b;
  padding: 2px 4px;
  border-radius: 4px;
  text-transform: uppercase;
  align-self: flex-start;
}
.item-desc {
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
  margin: 0;
}
.item-empty-state {
  text-align: center;
  padding: 24px 0;
  color: #475569;
  font-size: 12px;
}
.item-actions {
  padding-top: 12px;
  border-top: 1px solid #0f172a;
}
.btn-item {
  width: 100%;
  padding: 6px 0;
  color: #020617;
  font-weight: bold;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 8px;
}
.btn-consume { background-color: #059669; }
.btn-consume:hover { background-color: #10b981; }
.btn-equip { background-color: #f59e0b; }
.btn-equip:hover { background-color: #fbbf24; }

</style>