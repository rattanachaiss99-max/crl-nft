<template>
  <div class="upload-wrapper">
    <div class="text-center mb-8">
      <v-chip text-color="white" class="mb-4">
        <v-icon icon="mdi-white-balance-sunny" size="small" class="mr-2"></v-icon>อัปโหลดโมเดล 3D
      </v-chip>
      <h2 class="text-orange text-h4 font-weight-black text-uppercase mb-2" style="letter-spacing: -0.5px;">
        กรอกข้อมูลไฟล์เพื่อเพิ่มลงฐานข้อมูล
      </h2>
      <p class="text-grey-lighten-1 text-body-1">
        ระบุรายละเอียดของโมเดล และบันทึกลงระบบฐานข้อมูล
      </p>
    </div>

    <v-img class="upload-img mx-auto rounded-xl" :width="1000" aspect-ratio="16/9" cover :src="road_block"></v-img>
    <div class="upload-img text-center mt-3">
      <p class="text-caption text-grey-lighten-1 mb-0">
        <v-icon icon="mdi-information-outline" size="small" class="mr-1 pb-1"></v-icon>
        * หมายเหตุ: ภาพแสดงตัวอย่างสิ่งกีดขวาง (Road Block) สำหรับใช้เพิ่ม Metadata ของโมเดลสามมิติ
      </p>
    </div>

    <div class="upload-card">
      <div class="header-section">
        <i class="mdi mdi-database-plus neon-icon"></i>
        <div class="header-text">
          <h2>อัปโหลดโมเดลใหม่</h2>
          <p>เพิ่มข้อมูลและไฟล์โมเดล 3D ลงในฐานข้อมูล RAG</p>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="custom-form">
        <div class="form-grid">

          <div class="input-group span-12 span-md-6">
            <label>ชื่อโมเดล <span class="required">*</span></label>
            <input type="text" v-model="formData.name" placeholder="เช่น วิหาร A" required>
          </div>

          <div class="input-group span-12 span-md-6">
            <label>ความละเอียด (Resolution)</label>
            <input type="text" v-model="formData.resolution" placeholder="เช่น 4K, 8K">
          </div>

          <div class="input-group span-12">
            <label>ไฟล์โมเดล 3D (FBX, OBJ, GLTF) <span class="required">*</span></label>
            <div class="file-drop-area" @click="triggerFile('modelFile')">
              <i class="mdi mdi-cube-outline"></i>
              <span :class="{ 'has-file': modelFileName }">{{ modelFileName || 'คลิกเพื่อเลือกไฟล์โมเดล' }}</span>
              <input type="file" ref="modelFile" accept=".fbx,.obj,.gltf,.glb" @change="handleFile($event, 'model')"
                hidden required>
            </div>
          </div>

          <div class="input-group span-12">
            <label>รูปภาพตัวอย่าง (Thumbnail) <span class="required">*</span></label>
            <div class="file-drop-area" @click="triggerFile('thumbFile')">
              <i class="mdi mdi-image-outline"></i>
              <span :class="{ 'has-file': thumbFileName }">{{ thumbFileName || 'คลิกเพื่อเลือกรูปภาพ (WebP, JPG, PNG)'
                }}</span>
              <input type="file" ref="thumbFile" accept="image/*" @change="handleFile($event, 'thumb')" hidden required>
            </div>
          </div>

          <div class="input-group span-12 span-md-4">
            <label>จำนวนโพลีกอน</label>
            <input type="text" v-model="formData.polyCount" placeholder="เช่น 1 ล้าน">
          </div>

          <div class="input-group span-12 span-md-4">
            <label>ความสูง</label>
            <input type="text" v-model="formData.height" placeholder="เช่น 37.4 ม.">
          </div>

          <div class="input-group span-12 span-md-4">
            <label>จำนวนสี (Material)</label>
            <input type="number" v-model="formData.materialCount" placeholder="เช่น 36">
          </div>

        </div>

        <hr class="custom-divider">

        <div class="form-actions">
          <button type="button" class="btn-reset" @click="resetForm">ล้างข้อมูล</button>
          <button type="submit" class="btn-submit glow-btn" :disabled="isSubmitting">
            <i class="mdi mdi-cloud-upload"></i> {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import road_block from '@/assets/road_block.png'

const isSubmitting = ref(false);
const modelFile = ref(null);
const thumbFile = ref(null);
const modelFileName = ref('');
const thumbFileName = ref('');
const formData = reactive({
  name: '',
  path: '',
  thumbnail: '',
  resolution: '',
  polyCount: '',
  height: '',
  materialCount: null
});

// ฟังก์ชันจำลองการคลิก Input File
const triggerFile = (refName) => {
  if (refName === 'modelFile') modelFile.value.click();
  if (refName === 'thumbFile') thumbFile.value.click();
};

// ฟังก์ชันรับค่าไฟล์เมื่อเลือกเสร็จ
const handleFile = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  if (type === 'model') modelFileName.value = file.name;
  if (type === 'thumb') thumbFileName.value = file.name;
};

// ฟังก์ชันส่งข้อมูล
const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // จำลองการอัปโหลด 1.5 วินาที
    await new Promise(resolve => setTimeout(resolve, 1500));
    formData.path = `assets/props/${modelFileName.value || 'model.fbx'}`;
    formData.thumbnail = `https://your-storage.com/${thumbFileName.value || 'thumb.webp'}`;

    const finalData = { ...formData };
    console.log("🚀 ส่งข้อมูลสำเร็จ:", finalData);

    alert('บันทึกข้อมูลสำเร็จ!');
    resetForm();

  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาดในการอัปโหลด');
  } finally {
    isSubmitting.value = false;
  }
};

// ฟังก์ชันล้างข้อมูล
const resetForm = () => {
  formData.name = '';
  formData.resolution = '';
  formData.polyCount = '';
  formData.height = '';
  formData.materialCount = null;
  formData.path = '';
  formData.thumbnail = '';

  modelFileName.value = '';
  thumbFileName.value = '';

  if (modelFile.value) modelFile.value.value = '';
  if (thumbFile.value) thumbFile.value.value = '';
};
</script>

<style scoped>
.upload-img {
  margin-bottom: 20px;
}

/* 🌟 โครงสร้างหลัก (Wrapper & Card) */
.upload-wrapper {
  padding: 40px 20px;
}

.upload-card {
  max-width: 800px;
  margin: 0 auto;
  background-color: #1a1e23;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 🌟 ส่วนหัว */
.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}

.neon-icon {
  font-size: 32px;
  color: #ccff00;
  margin-right: 16px;
}

.header-text h2 {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
}

.header-text p {
  color: #9e9e9e;
  font-size: 0.85rem;
  margin: 4px 0 0 0;
}

/* 🌟 ระบบ Grid ทำเองแบบง่ายๆ */
.form-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.span-12 {
  grid-column: span 12;
}

@media (min-width: 768px) {
  .span-md-6 {
    grid-column: span 6;
  }

  .span-md-4 {
    grid-column: span 4;
  }
}


/* 🌟 ตกแต่ง Input & Label */
.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 12px;
  font-weight: bold;
  color: #bdbdbd;
  margin-bottom: 8px;
}

.required {
  color: #ff5252;
}

/* 🌟 Input ตรงตามสเปคของคุณเป๊ะๆ */
input[type="text"],
input[type="number"] {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  height: 38px;
  line-height: 38px;
  padding: 0 20px;
  min-width: 0;
  outline: none;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: #ccff00;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* 🌟 ตกแต่งช่องอัปโหลดไฟล์ให้ดูสวยแทน Input ธรรมดา */
.file-drop-area {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  /* สูงกว่า input text นิดนึงให้กดง่าย */
  padding: 0 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-drop-area i {
  margin-right: 8px;
  font-size: 18px;
}

.file-drop-area:hover {
  border-color: #ccff00;
  color: #ccff00;
  background-color: rgba(204, 255, 0, 0.05);
}

.has-file {
  color: #ffffff;
  /* เปลี่ยนสีข้อความเมื่อมีไฟล์ */
}

/* 🌟 เส้นคั่น และ ปุ่ม */
.custom-divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 32px 0 24px 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-reset,
.btn-submit {
  height: 44px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  outline: none;
}

.btn-reset {
  background: transparent;
  color: #9e9e9e;
  transition: color 0.2s ease;
}

.btn-reset:hover {
  color: #ffffff;
}

.btn-submit {
  background-color: #ccff00;
  color: #000000;
  display: flex;
  align-items: center;
}

.btn-submit i {
  margin-right: 8px;
}

.glow-btn {
  box-shadow: 0 4px 15px rgba(204, 255, 0, 0.2);
  transition: all 0.3s ease;
}

.glow-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(204, 255, 0, 0.4);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>