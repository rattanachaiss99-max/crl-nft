import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/vue";

// const clientId = "BCIY667Gy_g_-MqtSsHpV-fff8e0ovIR_rXi0hdm8tOBI34Nw6d2NrRgCN7NAHKM02L7G0Vwtx8y-mhkZE2c9lI"
const clientId = process.env.VUE_APP_WEB3AUTH_CLIENT_ID || '';
const web3AuthContextConfig: typeof Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  }
};

export default web3AuthContextConfig;