<script setup lang="ts">
import { computed } from 'vue';
import { useAccount, useBalance, useDisconnect } from '@wagmi/vue';
import { formatUnits } from 'viem';
// 1. Wagmi Composables
const { chain, address } = useAccount();
const { disconnect } = useDisconnect();
const { data: balanceData, isLoading, error } = useBalance({ address });

// 2. Helper Functions
const truncateBalance = (value: string | number): string => {
  const numStr = value.toString();
  const dotIndex = numStr.indexOf('.');
  if (dotIndex === -1) return numStr;
  return numStr.slice(0, dotIndex + 5); // แสดงทศนิยม 4 ตำแหน่ง
};
</script>

<template>
  <v-expansion-panels>      
    <v-expansion-panel>      
      <v-expansion-panel-title class="panel-header">
        <div class="header-content">
          <v-icon icon="mdi-wallet" color="primary" class="mr-2"></v-icon>
          <strong>ยอดคงเหลือ (Balance)</strong>
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="isLoading" class="skeleton-loading">
          <div class="skeleton-text"></div>
        </div>            
        <div v-else-if="error" class="error-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span class="error-text">{{ error.message || 'Failed to load balance' }}</span>
        </div>
        <div v-else class="balance-display">
          <h2 class="crypto-amount">
            {{ balanceData?.value !== undefined ? truncateBalance(formatUnits(balanceData.value, balanceData.decimals)) : '0.00' }}
            <span class="crypto-symbol">{{ balanceData?.symbol || 'ETH' }}</span>
              <v-tooltip interactive location="top"> <template v-slot:activator="{ props: activatorProps }">
              <v-icon 
                icon="mdi-information-outline" 
                v-bind="activatorProps"
                size="18" 
                color="#6b7280"
                class="ml-2 cursor-pointer"
              ></v-icon>
            </template>            
              <div>
                <p>ผู้ใช้งานสามารถตั้งค่าเครือข่ายได้ที่ ⚙️
                  (Settings)
                </p>                
              </div>
            </v-tooltip>
          </h2>          
          <p class="fiat-estimated">≈ มูลค่าโดยประมาณไม่พร้อมใช้งานในขณะนี้</p>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
/* =========================
   Vuetify Overrides
   ========================= */
:deep(.v-expansion-panel) {
  border: 1px solid #202020 !important; 
  border-radius: 10px !important;
  margin-bottom: 8px;
}

:deep(.v-expansion-panel-title) {
  padding: 0 12px !important; 
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 24px !important; /* รวบคำสั่ง บน-ล่าง 0, ซ้าย-ขวา 24px */
}
/* =========================
   Component Styles
   ========================= */
.panel-header {
  font-size: 16px;
  color: #e5e7eb;
}

.header-content {
  display: flex;
  align-items: center;
}

.balance-display {
  margin-bottom: 10px;
}

.crypto-amount {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0; /* เปลี่ยนจาก 0 0 0 0 เป็น 0 */
}

.crypto-symbol {
  font-size: 16px;
  color: #10b981;
  margin-left: 4px;
}

.fiat-estimated {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}
</style>