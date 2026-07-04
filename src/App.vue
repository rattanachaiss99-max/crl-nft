<script setup lang="ts">
import Home from "./Home.vue";
import { Web3AuthProvider } from "@web3auth/modal/vue";
import { WagmiProvider } from "@web3auth/modal/vue/wagmi";
import web3AuthContextConfig from "./web3authContext";
</script>

<template>
  <v-app>
    <div class="d-flex flex-column" style="min-height: 100vh;">
      <Web3AuthProvider :config="web3AuthContextConfig">
        <WagmiProvider>
          <Home />
        </WagmiProvider>
      </Web3AuthProvider>
    </div>
  </v-app>
</template>

<style>
.v-application {
  background-color: transparent !important;
}
</style>