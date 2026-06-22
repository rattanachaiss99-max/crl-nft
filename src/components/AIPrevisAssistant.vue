<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
const scriptInput = ref('');
const resultAssets = ref<any[]>([]);
const lightingGuide = ref('');
const isLoading = ref(false);
const hasResult = ref(false);
const copiedIndex = ref<number | null>(null);

// 🌟 URL Backend ของคุณ
const backendUrl = 'https://previs-amarintv.onrender.com/api/previs';

// 🌟 ฟังก์ชันพิมพ์ข้อความด่วน (Quick Presets)
const presets = [
  { label: '🎬 ฉากห้องแล็บ', text: 'อยากได้ เก้าอี้ไซไฟ และ โต๊ะทำงานพังๆ ในห้องทดลอง', icon: 'mdi-flask-outline' },
  { label: '🚨 ฉากทางเข้า', text: 'มี หุ่นยนต์โดรน ลอยตรวจการอยู่รอบๆ ประตูเหล็กบานใหญ่', icon: 'mdi-door-closed-lock' },
  { label: '🏃‍♂️ ฉากทั่วไป', text: 'ตัวละครเอกเดินเข้ามาในห้องโถงเปล่าๆ', icon: 'mdi-walk' }
];

const setPreconfig = (text: string) => {
  scriptInput.value = text;
};

// 🌟 ฟังก์ชันดึงข้อมูลจาก Backend
// const generate3DPrevis = async () => {
//   if (!scriptInput.value.trim()) return;

//   isLoading.value = true;
//   hasResult.value = false;
//   resultAssets.value = [];
//   lightingGuide.value = '';

//   try {
//     const response = await axios.post(backendUrl, {
//       text: scriptInput.value
//     });

//     // สมมติรูปภาพพรีวิวให้แต่ละ Asset เพื่อให้แสดงผลเป็นการ์ดแกลลอรี่สวยๆ
//     resultAssets.value = response.data.assets.map((asset: any) => ({
//       ...asset,
//       // ดึงรูปจำลองตามชื่อไฟล์ เพื่อให้ UI ดูเหมือนรูปตัวอย่างที่คุณแนบมา
//       thumbnail: `https://picsum.photos/seed/${asset.name.replace(/\s/g, '')}/400/300` 
//     }));

//     lightingGuide.value = response.data.ai_analysis;
//     hasResult.value = true;
//   } catch (error) {
//     console.error("Backend Error:", error);
//     alert("ไม่สามารถเชื่อมต่อกับหลังบ้านได้ กรุณาตรวจสอบสถานะ Live บนหน้าเว็บ Render");
//   } finally {
//     isLoading.value = false;
//   }
// };
// 🌟 ฟังก์ชันดึงข้อมูล (แบบจำลอง Mock Data สำหรับทดสอบ Local)
const generate3DPrevis = async () => {
  if (!scriptInput.value.trim()) return;
  isLoading.value = true;
  hasResult.value = false;
  resultAssets.value = [];
  lightingGuide.value = '';
  setTimeout(() => {
    const mockResponseAssets = [
      { name: 'Sci-Fi Lab Chair', path: 'assets/props/furniture/lab_chair_01.fbx' },
      { name: 'Broken Computer Monitor', path: 'assets/props/electronics/monitor_broken.obj' },
      { name: 'Laboratory Desk', path: 'assets/props/furniture/lab_desk_main.blend' },
      { name: 'Neon Light Tube', path: 'assets/props/lighting/neon_tube_blue.fbx' },
      { name: 'Scrap Metal Debris', path: 'assets/props/environment/scrap_debris_03.obj' }
    ];
    resultAssets.value = mockResponseAssets.map((asset: any) => ({
      ...asset,
      thumbnail: `https://picsum.photos/seed/${asset.name.replace(/\s/g, '')}/400/300`
    }));
    lightingGuide.value = `### 🎬 การวิเคราะห์ฉากและการจัดแสง (Mock Data)

    **Mood & Tone:** อึดอัด, ลึกลับ, ไซไฟดิสโทเปีย (Sci-Fi Dystopia)
    **คำแนะนำการจัดแสง (Lighting Guide):**
    - **Key Light:** ใช้แสงสีฟ้าอมเขียว (Cyan) ส่องผ่านหน้าต่างหรือช่องลมด้านบน เพื่อสร้างบรรยากาศห้องแล็บที่ถูกทิ้งร้าง
    - **Fill Light:** แสงสลัวๆ สีเทาคลุ้งๆ (Soft Ambient) ในห้อง เพื่อให้เห็นรายละเอียดของซากปรักหักพัง
    - **Practical Light:** ให้แสงสีส้มกะพริบ (Flickering Orange) ออกมาจากหน้าจอคอมพิวเตอร์ที่แตก เพื่อสร้างจุดสนใจ (Focal Point) ให้กับฉาก
    **มุมกล้องที่แนะนำ (Camera Angle):** Low Angle Shot ถ่ายช้อนขึ้นจากพื้นซากปรักหักพัง เพื่อเน้นความน่าเกรงขามของความเสียหายในห้องแล็บ`;

    hasResult.value = true;
    isLoading.value = false; // ปิดสถานะโหลด
  }, 2000); // ดีเลย์ 2000 มิลลิวินาที (2 วินาที)

  try {
    const response = await axios.post(backendUrl, { text: scriptInput.value });
    resultAssets.value = response.data.assets.map((asset: any) => ({
      ...asset,
      thumbnail: `https://picsum.photos/seed/${asset.name.replace(/\s/g, '')}/400/300`
    }));
    lightingGuide.value = response.data.ai_analysis;
    hasResult.value = true;
  } catch (error) {
    console.error("Backend Error:", error);
    alert("ไม่สามารถเชื่อมต่อกับหลังบ้านได้");
  } finally {
    isLoading.value = false;
  }
};
// 🌟 ฟังก์ชันคัดลอก Path ของโมเดล
const copyToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedIndex.value = index;
    setTimeout(() => { copiedIndex.value = null; }, 2000);
  });
};

// 🌟 ฟังก์ชันสำหรับโหลดข้อมูลตั้งต้นตอนเปิดหน้าเว็บ
const loadInitialData = () => {
  resultAssets.value = [
    {
      name: 'วิหาร A', path: 'assets/props/BldgTemple_A_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BldgTemple_A_grp_500px_0001.webp', resolution: '4K',
      polyCount: '1 ล้าน',
      height: '37.4 ม.',
      materialCount: 36
    },
    {
      name: 'วิหาร B', path: 'assets/props/BldgTemple_B_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BldgTemple_B_grp_500px_0001.webp', resolution: '4K',
      polyCount: '1 ล้าน',
      height: '22.6 ม.',
      materialCount: 30
    },
    {
      name: 'วิหาร C', path: 'assets/props/BldgTemple_C_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BldgTemple_C_grp_500px_0001.webp', resolution: '4K',
      polyCount: '4.38 แสน',
      height: '26.5 ม.',
      materialCount: 28
    },
    {
      name: 'วิหาร D', path: 'assets/props/BldgTemple_D_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BldgTemple_D_grp_500px_0001.webp', resolution: '4K',
      polyCount: '4.38 แสน',
      height: '26.5 ม.',
      materialCount: 28
    },
    {
      name: 'วิหาร E', path: 'assets/props/BldgTemple_E_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BldgTemple_E_grp_500px_0001.webp', resolution: '4K',
      polyCount: '6.22 แสน',
      height: '30.7 ม.',
      materialCount: 31
    },
    {
      name: 'กำแพงสูง A', path: 'assets/props/BuildModuleCross_A_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BuildModuleCross_A_grp_500px_0001.webp', resolution: '4K',
      polyCount: '6.5 หมื่น',
      height: '18.4 ม.',
      materialCount: 18
    },
    {
      name: 'กำแพงสูง B', path: 'assets/props/BuildModuleFreestandingTall_A_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BuildModuleFreestandingTall_A_grp_500px_0001.webp', resolution: '4K',
      polyCount: '3.3 หมื่น',
      height: '13.6 ม.',
      materialCount: 15
    },
    {
      name: 'กำแพงสูง C', path: 'assets/props/BuildModulePerimeterWall_A_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_BuildModulePerimeterWall_A_grp_500px_0001.webp', resolution: '4K',
      polyCount: '3.7 หมื่น',
      height: '9 ม.',
      materialCount: 15
    },
    {
      name: 'เรือบิน', path: 'assets/props/VehicBlimpShip_A_grp.fbx', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_VehicBlimpShip_A_grp_500px_0001.webp', resolution: '4K',
      polyCount: '5.01 แสน',
      height: '26.6 ม.',
      materialCount: 54
    },
    {
      name: 'Cyberpunk Crate', path: 'assets/props/cyber_crate.blend', thumbnail: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeiajg5vmiqay62jaea2sgb6xqt4ju26o2gmuvptqfkiv3u54asaofu/KB3D_SOL_VehicCargoPlane_A_grp_500px_0001.webp', resolution: '4K',
      polyCount: '2.72 แสน',
      height: '12.2 ม.',
      materialCount: 31
    }
  ];
  lightingGuide.value = `### 🎬 ยินดีต้อนรับสู่ AI Previs Assistant

นี่คือตัวอย่าง 3D Assets ยอดนิยมในฐานข้อมูลของเรา 

**วิธีใช้งาน:**
1. พิมพ์ลักษณะฉากที่คุณต้องการลงในกล่องค้นหาด้านซ้าย
2. หรือคลิกที่ปุ่ม "คำสั่งด่วน" เพื่อดูตัวอย่างการทำงาน
3. AI จะช่วยค้นหาโมเดลที่เกี่ยวข้อง พร้อมประเมินและแนะนำการจัดแสง (Lighting Guide) ให้คุณทันที!`;

  hasResult.value = true;
};

onMounted(() => {
  loadInitialData();
});
</script>

<template>
  <div class="ai-previs-wrapper py-6">
    <v-container fluid>
      <div class="text-center mb-8">
        <v-chip text-color="white" class="mb-4">
          <v-icon icon="mdi-white-balance-sunny" size="small" class="mr-2"></v-icon>ค้นหาโมเดลสามมิติ
        </v-chip>
        <h2 class="text-orange text-h4 font-weight-black text-uppercase mb-2" style="letter-spacing: -0.5px;">
          ค้นหาฐานข้อมูล และคำแนะนำจาก AI
        </h2>
        <p class="text-grey-lighten-1 text-body-1">
          พิมพ์บทหนังหรืออธิบายฉากเพื่อค้นหาโมเดล 3D และรับไอเดียการจัดแสงในกองถ่ายจากฐานข้อมูล
        </p>
      </div>
      <v-card class="search-card rounded-xl overflow-hidden" elevation="0" border>
        <v-textarea v-model="scriptInput" placeholder="เช่น: ฉากห้องแล็บพังๆ มีคอมหน้าจอแตก และเก้าอี้คว่ำอยู่..."
          variant="solo" bg-color="#121212" flat hide-details rows="2" auto-grow class="search-input text-white"
          :disabled="isLoading">
          <template v-slot:append-inner>
            <v-btn color="#ccff00" class="font-weight-bold search-btn rounded-lg ml-2" size="large" elevation="0"
              :loading="isLoading" :disabled="!scriptInput.trim()" @click="generate3DPrevis"
              style="color: #000000 !important;">
              <v-icon icon="mdi-magnify" class="mr-1"></v-icon> ค้นหา
            </v-btn>
          </template>
        </v-textarea>
      </v-card>
      <div class="mb-8">
        <div class="d-flex align-center justify-space-between mb-2">
        </div>
      </div>

      <v-fade-transition>
        <div v-if="isLoading" class="text-center py-12">
          <v-progress-circular indeterminate color="#ccff00" size="64" width="4" class="mb-4"></v-progress-circular>
          <h3 class="text-white font-weight-bold">กำลังวิเคราะห์บทภาพยนตร์...</h3>
          <p class="text-grey-darken-1 text-caption">เชื่อมต่อฐานข้อมูล 3D Assets และประมวลผลการจัดแสง</p>
        </div>
      </v-fade-transition>

      <v-fade-transition>
        <div v-if="hasResult && !isLoading" class="mt-6"> <v-row class="align-stretch mb-6">

            <v-col cols="12" lg="8">
              <div class="d-flex align-center justify-space-between mb-6">
                <h3 class="text-white text-h6 font-weight-bold">
                  <v-icon icon="mdi-cube-outline" color="grey-lighten-1" class="mr-2"></v-icon>
                  โมเดลทั้งหมด <span class="text-grey-darken-1 text-body-2 ml-2">{{ resultAssets.length }} ไฟล์</span>
                </h3>
              </div>

              <v-row style="margin: 0 -12px;">
                <v-col v-for="(asset, index) in resultAssets" :key="index" cols="12" sm="6" md="4" class="px-3 py-3">
                  <v-card class="asset-card rounded-lg h-100 d-flex flex-column" color="#1a1a1a" elevation="0"
                    style="border: 1px solid rgba(255, 255, 255, 0.05) !important;">
                    <div class="asset-img-container pa-4 bg-black d-flex justify-center align-center"> <v-img
                        :src="asset.thumbnail" height="120" class="asset-image" style="object-fit: contain;"></v-img>
                    </div>

                    <div class="pa-5 d-flex flex-column flex-grow-1">
                      <h4 class="text-white font-weight-bold text-truncate mb-2" :title="asset.name">
                        {{ asset.name }}
                      </h4>
                      <div class="model-stats mt-2 mb-4 d-flex flex-column" style="gap: 8px;">
                        <div class="d-flex justify-space-between align-center text-caption">
                          <span class="text-grey-darken-1 d-flex align-center">
                            <v-icon icon="mdi-image-outline" size="small" class="mr-2"></v-icon> สัดส่วน
                          </span>
                          <span class="text-white font-weight-medium">{{ asset.resolution || '-' }}</span>
                        </div>

                        <div class="d-flex justify-space-between align-center text-caption">
                          <span class="text-grey-darken-1 d-flex align-center">
                            <v-icon icon="mdi-vector-triangle" size="small" class="mr-2"></v-icon> โพลีกอน
                          </span>
                          <span class="text-white font-weight-medium">{{ asset.polyCount || '-' }}</span>
                        </div>

                        <div class="d-flex justify-space-between align-center text-caption">
                          <span class="text-grey-darken-1 d-flex align-center">
                            <v-icon icon="mdi-ruler" size="small" class="mr-2"></v-icon> ความสูง
                          </span>
                          <span class="text-white font-weight-medium">{{ asset.height || '-' }}</span>
                        </div>

                        <div class="d-flex justify-space-between align-center text-caption">
                          <span class="text-grey-darken-1 d-flex align-center">
                            <v-icon icon="mdi-layers-outline" size="small" class="mr-2"></v-icon> สี(วัสดุ)
                          </span>
                          <span class="text-white font-weight-medium">{{ asset.materialCount || '-' }}</span>
                        </div>

                      </div>

                      <v-spacer></v-spacer>

                      <div class="path-box rounded px-3 py-2 d-flex align-center justify-space-between"
                        style="background-color: #0f0f0f; border: 1px solid rgba(255,255,255,0.05);"> <span
                          class="text-grey-lighten-1 text-caption text-truncate mr-2" style="max-width: 120px;">
                          {{ asset.path }}
                        </span>
                        <v-btn size="small" :color="copiedIndex === index ? 'success' : '#2a2a2a'" variant="flat"
                          class="text-none px-2" @click="copyToClipboard(asset.path, index)" style="min-width: 36px;">
                          <v-icon :icon="copiedIndex === index ? 'mdi-check' : 'mdi-content-copy'" size="small"
                            :color="copiedIndex === index ? 'white' : 'grey-lighten-1'"></v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" lg="4" class="px-lg-4 mt-6 mt-lg-0">
              <h3 class="text-white text-h6 font-weight-bold mb-6"> <v-icon icon="mdi-lightbulb-on-outline"
                  color="#ff9800" class="mr-2"></v-icon>
                การวิเคราะห์ฉาก AI
              </h3>

              <v-card class="analysis-card rounded-lg pa-6 h-100" color="#121212" border
                style="border-color: rgba(255,255,255,0.05) !important;">
                <div class="markdown-text text-grey-lighten-1 text-body-2"
                  style="white-space: pre-line; line-height: 1.8;">
                  {{ lightingGuide }}
                </div>
              </v-card>
            </v-col>

          </v-row>
        </div>
      </v-fade-transition>

    </v-container>
  </div>
</template>

<style scoped>
.ai-previs-wrapper {
  min-height: 80vh;
}

.gap-2 {
  gap: 8px;
}

.preset-chip {
  cursor: pointer;
  transition: all 0.2s;
}

.preset-chip:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff !important;
}

.search-card {
  border-color: rgba(255, 255, 255, 0.1) !important;
  transition: border-color 0.3s;
}

.search-card:focus-within {
  border-color: #ccff00 !important;
}

:deep(.v-field__input) {
  font-size: 1.1rem;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

.search-btn {
  height: 48px !important;
  margin-top: 4px;
}

.asset-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  cursor: default;
}

.asset-card:hover {
  border-color: #ccff00;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(204, 255, 0, 0.05);
}

.asset-img-container {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.asset-image {
  mix-blend-mode: luminosity;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.asset-card:hover .asset-image {
  mix-blend-mode: normal;
  opacity: 1;
}

.path-box {
  background-color: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.analysis-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
  max-height: 600px;
  overflow-y: auto;
}

.analysis-card::-webkit-scrollbar {
  width: 6px;
}

.analysis-card::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>