<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/vue";
import { supabase } from './utils/supabase';
import { useAccount } from '@wagmi/vue';
import SidebarNav from './components/SidebarNav.vue';
import RewardBalance from './components/RewardBalance.vue';
import AIPrevisAssistant from './components/AIPrevisAssistant.vue';
import AIGeneratorWizard from './components/AIGeneratorWizard.vue'
import Chat_Document from './components/Chat_Document.vue';
import AIRenderViewer from './components/AIRenderViewer.vue';
import GemmaChat from './components/GemmaChat.vue';
import LlamaCourse from './components/LlamaCourse.vue';
import ThreeView from './components/ThreeView.vue';
import LoraConfig from './components/LoraConfig.vue';
import ViralPresets from './components/ViralPresets.vue';
import Blog from './components/Blog.vue';
import CourseWatchAndEarn from './components/CourseWatchAndEarn.vue';
import GameHUD from './components/GameHUD.vue'

const isAnilaOpen = ref(false);
const currentTab = ref('message');
const transactions = ref<any[]>([]);
const isLoading = ref(false);
const {
  connect,
  isConnected,
  loading: connectLoading,
  error: connectError
} = useWeb3AuthConnect();
const {
  disconnect,
  loading: disconnectLoading,
  error: disconnectError
} = useWeb3AuthDisconnect();
const { address } = useAccount();
const rewardCardRef = ref<InstanceType<typeof RewardBalance> | null>(null);
const points = ref<number>(0);
const handleRewardSuccess = () => {
  console.log('โฆษณาทำงานเสร็จสิ้น! กำลังสะกิดการ์ดแต้มให้อัปเดต...');
  if (rewardCardRef.value && typeof rewardCardRef.value.fetchUserPoints === 'function') {
    rewardCardRef.value.fetchUserPoints();
  }
};
const userAddress = computed(() => {
  return address.value ? `${address.value}` : '';
});
const carColor = ref('#FBBF24')
const lightIntensity = ref(1.5)

const handleAISettings = (settings: any) => {
  if (settings.color) carColor.value = settings.color
  if (settings.light !== undefined) lightIntensity.value = settings.light
}

async function fetchTransactionHistory() {
  if (!userAddress.value) return;
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('sender_address', userAddress.value) // กรองเฉพาะของตัวเอง
      .order('created_at', { ascending: false }); // เอาล่าสุดขึ้นก่อน

    if (error) throw error;
    transactions.value = data || [];
  } catch (err) {
    console.error('Error fetching history:', err);
  } finally {
    isLoading.value = false;
  }
}
let txSubscription: any = null;

function setupRealtimeSubscription() {
  if (!userAddress.value) return;

  txSubscription = supabase
    .channel('public:transactions')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions',
        filter: `sender_address=eq.${userAddress.value}`
      },
      (payload) => {
        transactions.value.unshift(payload.new);
      }
    )
    .subscribe();
}

onMounted(() => {
  fetchTransactionHistory();
  setupRealtimeSubscription();
});

onUnmounted(() => {
  if (txSubscription) {
    supabase.removeChannel(txSubscription);
  }
});

const handleRefreshPoints = () => {
  console.log('✨ ได้รับสัญญาณให้อัปเดตข้อมูลแต้มสะสม...');
  if (rewardCardRef.value && typeof rewardCardRef.value.fetchUserPoints === 'function') {
    rewardCardRef.value.fetchUserPoints(); // วิ่งไปสั่งการ์ดแต้มให้รีเฟรชข้อมูลเงียบๆ
  }
};
const userCredits = ref(0);

</script>
  <!-- <FeatureBanner />
  <GalleryHome />          
  <HeroBanner />
  <VideoPreset />
  <ToolsDashboard />
  <FeatureBannerIES />
  <ViralPresets /> -->
<template>
  <div class="app-dashboard-container">    
    <v-app-bar color="#111827" elevation="1" class="border-b" :height="70">      
      <div class="d-flex align-center pl-4">        
        <div class="font-weight-bold text-h6 mr-4">
          <span v-if="currentTab === 'home'" class="neon-title">xRAG</span>
          <span v-else-if="currentTab === 'dashboard'" class="neon-title">xRAG</span>
          <span v-else-if="currentTab === 'rewards'" class="neon-title">xRAG</span>
          <span v-else-if="currentTab === 'upload'" class="neon-title">xRAG</span>
          <span v-else-if="currentTab === 'music'" class="neon-title">xRAG</span>
          <span v-else-if="currentTab === 'message'" class="neon-title">xRAG</span>
        </div>
          <button 
          class="nav-pill-btn" 
          :class="{ 'active': currentTab === 'home' }" 
          @click="currentTab = 'message'"
          >เอกสาร</button>
      </div>
      <v-spacer></v-spacer>
      <div class="app-navigation-pill d-flex align-center">
        <div class="nav-pill-divider"></div>
        <div class="nav-pill-divider"></div>
        </div>
      <v-spacer></v-spacer>
      <div class="pr-4 d-flex align-center">
        <v-btn
        v-if="!isConnected"
        color="#2196F3"
        variant="flat"
        prepend-icon="mdi-wallet-outline"
        :loading="connectLoading"
        :disabled="connectLoading"
        @click="connect()"
        class="text-none font-weight-bold"
        >
        เข้าสู่ระบบ
        </v-btn>
        
        <template v-else>
          <v-chip 
            color="#ccff00" 
            variant="outlined" 
            class="mr-3 font-weight-bold"
            prepend-icon="mdi-lightning-bolt"
          >
          Credits: {{ userCredits }}
          </v-chip>
          
          <v-btn
            color="error"
            variant="tonal"
            prepend-icon="mdi-logout"
            @click="disconnect()"
            class="text-none font-weight-bold"
            size="small"
          >
            ตัดการเชื่อมต่อ
          </v-btn>
        </template>
      </div>
    </v-app-bar>
    <v-main>
      <main class="main-content layout-has-sidebar"> 
        <div class="animate-fade-in">          
          <div v-if="currentTab === 'home'" class="animate-fade-in">
            <AIRenderViewer />
          </div>          
          <div v-else-if="currentTab === 'dashboard'" class="animate-fade-in">
            <AIGeneratorWizard />
          </div>         
          <div v-else-if="currentTab === 'rewards'" class="animate-fade-in">
            <AIPrevisAssistant />
          </div>
          <div v-else-if="currentTab === 'music'" class="animate-fade-in">
            <LoraConfig />
          </div>
          <div v-else-if="currentTab === 'message'" class="animate-fade-in">
            <Chat_Document />
            <CourseWatchAndEarn />
          </div>
          <div v-else-if="currentTab === 'blog'" class="animate-fade-in">
            <GameHUD />
          </div>
        </div>
        <SidebarNav v-model="currentTab" />        
      </main>
    </v-main>
  </div>
</template>

<style scoped>
.app-dashboard-container {
  width: 100%;
  max-width: 1200px;
  margin: 0px auto 20px auto;
  background-color: #0b0f19;
  background-image:
    radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  padding: 0px;
  box-sizing: border-box;
}

.main-content {
  padding: 0px;
  flex: 1;
  transition: padding-left 0.2s ease;
  margin-bottom: 60px;
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}
.neon-title {
  color: #ccff00; /* สีเหลืองอมเขียวสะท้อนแสงตามรูปภาพ */
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.dashboard-vertical-stack {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
  /* align-items: flex-start;  */
}

.dashboard-left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.dashboard-vertical-stack> :not(.dashboard-left-column) {
  flex: 1;
}

/* 🧱 จัดการ Layout ภายในแท็บ Rewards */
.rewards-tab-layout {
  display: flex;
  gap: 20px;
  /* ระยะห่างระหว่างตัวเกมกับกล่องโฆษณา */
  align-items: flex-start;
  min-height: 0;
  /* ป้องกันคอมโพเนนต์ดันทะลุกรอบขอบหน้าจอหลัก */
  width: 100%;
}

/* แบ่งสัดส่วนฝั่งซ้าย (มินิเกม) */
.rewards-left {
  flex: 1.3;
  margin-bottom: 10px
  ;
  min-height: 0;
}

/* แบ่งสัดส่วนฝั่งขวา (ดูโฆษณา) */
.rewards-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.layout-has-sidebar {
  padding: 0px;
}

@media (max-width: 992px) {
  .rewards-tab-layout {
    flex-direction: column;
    height: auto;
  }
  .rewards-left,
  .rewards-right {
    width: 100%;
    flex: none;
  }
}

@media (max-width: 480px) {
  .dashboard-vertical-stack {
    gap: 16px;
  }
}
</style>