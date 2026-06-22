<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import animPrevis from '@/assets/3D_Anima_Previs.mp4'

// 🌟 ตัวแปรควบคุมสเต็ปการทำงาน
const activeStep = ref(1);

// 🌟 [ใหม่] ตัวแปรสำหรับ Step 1: Input และ Preconfig
const subjectInput = ref('');
const addedConfigs = ref<{ text: string, image: string }[]>([]);
// 🌟 [ใหม่] ตัวแปรสำหรับ Step 2: อัปโหลดรูปร่าง/สตอรี่บอร์ด
const uploadedFiles = ref<any[]>([]);
const step2PreviewImages = ref<{ text: string, image: string }[]>([]);
// 🌟 [เพิ่มใหม่] ฟังก์ชันสำหรับสร้างไฟล์ Preconfig จำลอง
const usePreconfigFile = () => {
  uploadedFiles.value = [];
  setTimeout(() => {
    step2PreviewImages.value = [{
      text: 'โบราณสถาน + ฉาก (อัปโหลด)',
      image: 'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeifxqbbc5v2h6rhravesru4hi4f265m7ws4o6cgsxdoc67ewxccsoi'
    }];
  }, 50);
};
// 🌟 ปรับปรุงลอจิก Watch ใหม่เพื่อไม่ให้มันไปลบรูป Preconfig
watch(uploadedFiles, (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    step2PreviewImages.value = []; // ล้างรูปพรีวิวเก่า
    
    newFiles.forEach((file) => {
      if (file.type && file.type.startsWith('image/')) {
        const localImageUrl = URL.createObjectURL(file);
        step2PreviewImages.value.push({
          text: file.name,
          image: localImageUrl
        });
      }
    });
  }
  // 🌟 ลบ block 'else' ทิ้งไปเลย เพื่อไม่ให้มันมาลบรูป Preset ของเราตอนกล่องว่างเปล่า
}, { deep: true });

// 🌟 ฟังก์ชันสำหรับล้างข้อมูลใน Step 2
const resetStep2 = () => {
  uploadedFiles.value = [];
  step2PreviewImages.value = [];
};

const connectConnector = () => {
    activeStep.value = 3;
};
const removeStep2Config = (index: number) => {
  step2PreviewImages.value.splice(index, 1);
  uploadedFiles.value = [];
};
// รูปภาพจำลองสำหรับโชว์ตอนกดปุ่ม + (ดึงวนลูปไปเรื่อยๆ)
const mockImages = [
    'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeia7vwxfu46dtwyg6yvnoxscirahij2yoa4ufebl4ibr2fltsyay7y',
    'https://yellow-electronic-marten-581.mypinata.cloud/ipfs/bafybeifxqbbc5v2h6rhravesru4hi4f265m7ws4o6cgsxdoc67ewxccsoi',
    'https://picsum.photos/seed/scifi/200/200'
];

const addSubject = () => {
    if (!subjectInput.value.trim()) return;
    addedConfigs.value.push({
        text: subjectInput.value,
        image: mockImages[addedConfigs.value.length % mockImages.length]
    });

    subjectInput.value = ''; // เคลียร์ช่องพิมพ์
    activeStep.value = 2; // ขยับไปสเต็ป 2 อัตโนมัติ เพื่อเปิดทางให้ไปต่อได้
};

// ฟังก์ชันลบ Preconfig
const removeConfig = (index: number) => {
    addedConfigs.value.splice(index, 1);
    if (addedConfigs.value.length === 0) {
        activeStep.value = 1; // ถ้าลบหมดให้กลับมาล็อคสเต็ป 1
    }
};

// เคลียร์ช่องพิมพ์เมื่อกดรูปถังขยะ
const clearInput = () => {
    subjectInput.value = '';
};

// 🌟 ตัวแปรสำหรับสเต็ปต่อๆ ไป
const showConfigForm = ref(false);
const isGenerating = ref(false);
const generationComplete = ref(false);
const promptText = ref('');
const selectedStyle = ref('Unreal Engine 5');
const styleOptions = [
  'Unreal Engine 5', 
  'Pixar Style', 
  'Blender Cycles', 
  'Claymation', 
  'Realistic CGI'
];
const openConfigForm = () => {
  showConfigForm.value = true;
  generationComplete.value = false;  
  // (Optional) โยนคำจาก Step 1 มาใส่ฟอร์มให้
  const subjects = addedConfigs.value.map(c => c.text).join(', ');
  promptText.value = subjects ? `A game featuring: ${subjects}` : '';

  // เลื่อนจอลงมาให้เห็นฟอร์มอัตโนมัติ
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100);
};

const generateResult = () => {
    if (!promptText.value) return;
    isGenerating.value = true;
    setTimeout(() => {
        isGenerating.value = false;
        generationComplete.value = true;
    }, 3000);
};
</script>

<template>
    <div class="wizard-wrapper py-10 position-relative">
        <div class="bg-glow"></div>
        <v-container class="position-relative z-10">
            <div class="text-center mb-8">
                <v-chip text-color="white" class="mb-4">
                    <v-icon icon="mdi-white-balance-sunny" size="small" class="mr-2"></v-icon>แอนิเมชั่นเร่งด่วน
                </v-chip>
                <h2 class="text-orange text-h4 font-weight-black text-uppercase mb-2" style="letter-spacing: -0.5px;">
                    เริ่มสร้างแอนิเมชั่นของคุณ
                </h2>
                <p class="text-grey-lighten-1 text-body-1">
                    กำหนดหัวข้อ ตั้งค่าสไตล์ แล้วปล่อยให้ AI สร้างสรรค์ผลงานให้คุณ
                </p>
                <p class="text-caption text-grey-lighten-1 mb-0">
                <v-icon icon="mdi-information-outline" size="small" class="mr-1 pb-1"></v-icon>
                * หมายเหตุ: ไม่ได้ใช้ API ทางการของโมเดล AI
                </p>  
            </div>

            <v-card class="steps-card rounded-xl pa-2 mb-6" elevation="10">
                <v-row no-gutters>
                    <v-col cols="12" md="4" class="pa-6 step-col border-right-md"
                        :class="{ 'opacity-70': activeStep > 1 }">
                        <div class="step-number mb-4">1</div>
                            <h3 class="text-white font-weight-bold mb-1">ลักษณะตัวละคร</h3>
                            <p class="text-grey-darken-1 text-caption mb-4">ป้อนตัวละครหลักหรือวัตถุของคุณ</p>
                        <div class="custom-input-wrapper d-flex align-center px-3 py-1 mb-4 rounded-lg">
                            <div class="white-dot mr-2"></div>

                            <input v-model="subjectInput" type="text"
                                class="custom-input text-white text-body-2 flex-grow-1" placeholder="คำอธิบาย..."
                                @keyup.enter="addSubject" />
                            <v-btn icon="mdi-plus" variant="text" color="grey-lighten-1" size="small" class="ml-1"
                                @click="addSubject"></v-btn>
                        </div>

                        <v-expand-transition>
                            <div v-if="addedConfigs.length > 0">
                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <v-chip v-for="(config, index) in addedConfigs" :key="index" closable
                                        color="#ccff00" variant="outlined" size="small" class="font-weight-bold"
                                        @click:close="removeConfig(index)">
                                        ซีทตัวละคร
                                    </v-chip>
                                </div>

                                <div class="d-flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                                    <v-img v-for="(config, index) in addedConfigs" :key="'img1-' + index"
                                        :src="config.image" width="160" aspect-ratio="16/9" cover
                                        class="rounded-lg border-thin flex-shrink-0"></v-img>
                                </div>
                            </div>
                        </v-expand-transition>
                    </v-col>

                    <v-col cols="12" md="4" class="pa-6 step-col border-right-md"
                        :class="{ 'opacity-50': activeStep < 2 }">
                        <div class="step-number mb-4">2</div>
                        <h3 class="text-white font-weight-bold mb-1">อธิบายฉาก</h3>
                        <!-- <p class="text-grey-darken-1 text-caption mb-4">เพิ่มรูปภาพบอร์ดเนื้อเรื่องที่ต้องการ</p> -->
                        <div class="d-flex justify-end mb-4">
                            <v-btn 
                            variant="text" 
                            color="#ccff00" 
                            size="big" 
                            class="text-body-2 font-weight-bold px-10"
                            prepend-icon="mdi-creation" 
                            :disabled="activeStep < 2" 
                            @click="usePreconfigFile"
                            >
                             หรือ ใช้รูปภาพตัวอย่าง
                            </v-btn>
                        </div>
                        <v-file-upload v-model="uploadedFiles" density="comfortable" clearable multiple show-size
                            variant="compact" class="mb-4" :disabled="activeStep < 2" title="อัปโหลดรูปภาพ"
                            text="ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือก">
                            <template v-slot:item="{ props: itemProps }">
                                <v-file-upload-item v-bind="itemProps" lines="two">

                                    <template v-slot:prepend>
                                        <v-avatar rounded="lg" size="32" style="transform: rotate(45deg)"
                                            color="grey-darken-3">
                                            <v-icon icon="mdi-image-outline" size="small"
                                                style="transform: rotate(-45deg)"></v-icon>
                                        </v-avatar>
                                    </template>

                                    <template v-slot:clear="{ props: clearProps }">
                                        <v-btn color="error" icon="mdi-trash-can" variant="text"
                                            v-bind="clearProps"></v-btn>
                                    </template>

                                </v-file-upload-item>
                            </template>
                        </v-file-upload>

                        <v-expand-transition>
                            <div v-if="step2PreviewImages.length > 0" class="mb-4">
                                <div class="d-flex flex-wrap gap-2 mb-3">
                                <v-chip 
                                    v-for="(config, index) in step2PreviewImages" 
                                    :key="index"
                                    closable
                                    color="#ff9800"
                                    variant="outlined"
                                    size="small"
                                    class="font-weight-bold"
                                    @click:close="removeStep2Config(index)"
                                >
                                    {{ config.text }}
                                </v-chip>
                                </div>
                                
                                <div class="d-flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                                <v-img 
                                    v-for="(config, index) in step2PreviewImages" 
                                    :key="'img2-'+index"
                                    :src="config.image"
                                    width="160"               
                                    aspect-ratio="16/9"       
                                    cover
                                    class="rounded-lg border-thin flex-shrink-0"
                                ></v-img>
                                </div>
                            </div>
                        </v-expand-transition>

                        <v-btn 
                          block 
                          color="#ff9800" 
                          class="text-none font-weight-bold rounded-lg" 
                          height="44"
                          :disabled="activeStep < 2 || step2PreviewImages.length === 0" 
                          @click="connectConnector"
                          style="color: #000000 !important;"
                        >
                          <v-icon icon="mdi-check-circle-outline" size="small" class="mr-2"></v-icon> ยืนยันสตอรี่บอร์ด
                        </v-btn>

                        <v-btn
                        block
                        variant="text"
                        color="grey-lighten-1"
                        class="text-none font-weight-bold mt-2"
                        height="36"
                        :disabled="activeStep < 2 || step2PreviewImages.length === 0"
                        @click="resetStep2"
                        >
                        <v-icon icon="mdi-refresh" size="small" class="mr-2"></v-icon> ล้างข้อมูล (Reset)
                        </v-btn>
                    </v-col>

                    <v-col cols="12" md="4" class="pa-6 step-col" :class="{ 'opacity-50': activeStep < 3 }">
                        <div class="step-number mb-4">3</div>
                        <h3 class="text-white font-weight-bold mb-1"> ตั้งค่า & เริ่มต้น </h3>
                        <p class="text-grey-darken-1 text-caption mb-4"> ออกแบบผลงานตามข้อมูลผู้ใช้ </p>

                        <v-btn 
                            block 
                            color="#ccff00" 
                            class="text-none font-weight-bold rounded-lg glow-btn"
                            height="44" 
                            :disabled="activeStep < 3" 
                            @click="openConfigForm"
                            style="color: #000000 !important;"
                        >
                            <v-icon icon="mdi-creation" size="small" class="mr-2"></v-icon> เริ่มต้น
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>

            <v-expand-transition>
                <div v-if="showConfigForm" class="pt-4">
                    <v-card class="config-card rounded-xl mx-auto" max-width="950" elevation="10" 
                            style="padding: 32px !important; background-color: #1a1e23 !important;">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-video-3d" color="#ccff00" size="large" class="mr-3"></v-icon>
                            <div class="anim-text">
                                <p class="anim-text text-white font-weight-bold mb-0">แอนิเมชั่นของคุณ</p>                                
                            </div>
                        </div>
                        
                        <v-chip-group v-model="selectedStyle" mandatory class="mb-6 mt-4">
                            <v-chip 
                                v-for="style in styleOptions" 
                                :key="style" 
                                :value="style" 
                                variant="outlined"
                                color="white" 
                                class="custom-chip"
                                :class="{ 'active-chip': selectedStyle === style }"
                                :disabled="isGenerating || generationComplete"
                            >
                                {{ style }}
                            </v-chip>
                        </v-chip-group>

                        <v-btn 
                            block 
                            color="#ccff00" 
                            size="x-large"
                            class="font-weight-bold text-none rounded-lg mt-2 glow-btn"
                            :loading="isGenerating" 
                            :disabled="!promptText || generationComplete"
                            @click="generateResult"
                            style="color: #000000 !important;"
                        >
                            เริ่มสร้างแอนิเมชั่น <v-icon icon="mdi-movie-open-play" class="ml-2"></v-icon>
                        </v-btn>

                        <v-slide-y-transition>
                            <div v-if="generationComplete" class="mt-8 bg-black rounded-lg pa-6 border-success">
                                <v-card color="#1a1a1a" class="rounded-lg overflow-hidden mb-6 position-relative" elevation="0" style="border: 1px solid rgba(255,255,255,0.1); aspect-ratio: 16/9;">
                                    <video 
                                        :src="animPrevis" 
                                        autoplay 
                                        loop 
                                        muted 
                                        playsinline
                                        style="width: 100%; height: 100%; object-fit: cover; display: block;"
                                    ></video>
                                </v-card>

                                <div class="d-flex justify-center gap-4">
                                    <v-btn color="#ccff00" class="text-none font-weight-bold" prepend-icon="mdi-download" style="color: #000000 !important;">
                                    ดาวโหลด
                                    </v-btn>
                                </div>                                
                            </div>
                        </v-slide-y-transition>

                    </v-card>
                </div>
            </v-expand-transition>
        </v-container>
    </div>
</template>

<style scoped>
.custom-chip {
  transition: all 0.2s ease;
}

.active-chip {
  background-color: #ccff00 !important;
  color: #000000 !important;
  border-color: #ccff00 !important;
}

.anim-text {
    margin: 0px;
    padding: 0px;
}

.custom-dropzone {
    background-color: rgba(255, 255, 255, 0.02);
    border: 2px dashed rgba(255, 255, 255, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 140px;
}

.custom-dropzone:hover:not(.dropzone-disabled),
.dropzone-active {
    background-color: rgba(255, 152, 0, 0.05);
    /* สีส้มจางๆ ให้เข้ากับปุ่ม Step 2 */
    border-color: #ff9800;
}

/* สถานะถูกล็อค (ตอนอยู่ Step 1) */
.dropzone-disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

/* พื้นฐาน CSS เดิม */
.wizard-wrapper {
    background-color: #0a0a0a;
    min-height: 100vh;
    overflow: hidden;
    padding-top: 24px;
}

.bg-glow {
    position: absolute;
    bottom: -20%;
    left: 0;
    width: 100%;
    height: 60%;
    background: radial-gradient(ellipse at bottom, rgba(204, 255, 0, 0.15) 0%, transparent 60%);
    pointer-events: none;
    z-index: 1;
}

.z-10 {
    z-index: 10;
}

.steps-card {
    background-color: #1c1e21;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.step-col {
    transition: opacity 0.3s ease;
}

@media (min-width: 1000px) {
    .border-right-md {
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
}

.step-number {
    width: 28px;
    height: 28px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
}

.glow-btn {
    box-shadow: 0 0 15px rgba(204, 255, 0, 0.2) !important;
    transition: all 0.2s ease;
}

.glow-btn:hover:not(:disabled) {
    box-shadow: 0 0 25px rgba(204, 255, 0, 0.4) !important;
    transform: translateY(-2px);
}

.config-card {
    background-color: #16181a;
    border: 1px solid rgba(204, 255, 0, 0.2);
}

.border-success {
    border: 1px solid #4caf50;
}

/* 🌟 [ใหม่] CSS สำหรับ Input กล่องข้อความ */
.custom-input-wrapper {
    background-color: #121212;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.custom-input-wrapper:focus-within {
    border-color: rgba(255, 255, 255, 0.3);
}

.custom-input {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
}

.white-dot {
    width: 6px;
    height: 6px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

.gap-2 {
    gap: 8px;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>