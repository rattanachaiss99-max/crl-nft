<script setup>
import { ref, watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'

const props = defineProps({
  carColor: { type: String, default: '#ffffff' },
  lightIntensity: { type: Number, default: 1 }
})

const carModelRef = ref(null)

watch(() => props.carColor, (newColor) => {
  // 💡 คุ้ยลึกลงไปหาโมเดล 3D ตัวจริงที่ Cientos ซ่อนไว้ในร่าง Component
  // โดยปกติโครงสร้างจะสถิตอยู่ใน .value หรือ .value.$el หรือ .value.model
  const actualModel = carModelRef.value?.model || carModelRef.value?.$el || carModelRef.value;

  if (actualModel && typeof actualModel.traverse === 'function') {
    actualModel.traverse((child) => {
      if (child.isMesh && child.material) {
        // 💡 ล้างเอฟเฟกต์สีเก่า แล้วสลักสีใหม่ที่ส่งมาจาก Gemma 4 ทันที
        child.material.color.set(newColor);
        child.material.needsUpdate = true; // บอกให้ Three.js วาดสีใหม่บนหน้าจอทันที
      }
    });
  } else {
    // 💡 ท่าไม้ตายสำรอง: ถ้าตัวโมเดลใหญ่ยังไม่ยอมเผยร่าง ให้ส่องหาในระดับคอร์ลึกขึ้น
    console.log("กำลังค้นหาโครงสร้างมวลสารโมเดลตัวจริง...", carModelRef.value);
  }
})
</script>

<template>
  <div class="canvas-wrapper">
    <!-- 1. เตาหลอมโลก 3D (Canvas) -->
    <TresCanvas clear-color="#0f172a" shadows alpha>
      <!-- 2. กล้องและการควบคุม (ให้ผู้ใช้คลิกลากเมาส์ หมุนดูรถ ซูมเข้าออกได้รอบทิศ) -->
      <TresPerspectiveCamera :position="[5, 3, 5]" :look-at="[0, 0, 0]" />
        <OrbitControls />
      <!-- 3. แสงสว่างในฉาก (Ambient และ Directional Light กำหนดความสว่างจาก AI ได้) -->
      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight 
        :position="[3, 10, 3]" 
        :intensity="props.lightIntensity" 
        cast-shadow 
      />

      <!-- 4. โหลดโมเดลที่เรา Export มาจาก 3ds Max (วางไว้กลางฉากพิกัด 0,0,0) -->
      <Suspense>
        <GLTFModel 
          path="/models/merc_hovercar.glb" 
          ref="carModelRef" 
          :position="[0, 0, 0]"
          :scale="[1, 1, 1]"
        />
      </Suspense>

      <!-- 5. แผ่นพื้นเงาเพื่อความสมจริง -->
      <!-- <TresMesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, -0.01, 0]" receive-shadow>
        <TresPlaneGeometry :args="[20, 20]" />
        <TresMeshStandardMaterial color="#1e293b" roughness="0.8" />
      </TresMesh> -->

    </TresCanvas>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  width: 100%;
  height: 500px; /* ปรับขนาดหน้าจอแสดงผล 3D ตามชอบ */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
  border: 1px solid #334155;
}
</style>