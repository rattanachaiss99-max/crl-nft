<template>
  <v-app style="background-color: #0b111e; min-height: 100vh;" class="text-white">
    <v-main class="d-flex flex-column align-center justify-start py-8 px-4">
      <div class="text-center mb-8 position-relative">
        <v-chip text-color="white" class="mb-4">
          <v-icon icon="mdi-white-balance-sunny" size="small" class="mr-2"></v-icon>การใช้ AI ร่วมกับโมเดล
        </v-chip>

        <h2 class="text-orange text-h4 font-weight-black text-uppercase mb-2" style="letter-spacing: -0.5px;">
          วิเคราะห์พื้นผิวของโมเดลด้วย AI
        </h2>
        <p class="text-grey-lighten-1 text-body-1">
          ตัวอย่างการใช้ AI ส่วนตัว
        </p>
        <p class="text-caption text-grey-lighten-1 mb-0">
        <v-icon icon="mdi-information-outline" size="small" class="mr-1 pb-1"></v-icon>
        หมายเหตุ: Gemma 4 จะใช้งานได้ เมื่อผู้สร้างเว็บไซต์เปิด Local LM เท่านั้น
      </p>
      </div>
      <div class="main-content-wrapper">
        <div class="d-flex justify-end mb-3">
          <v-btn-toggle v-model="isAIControlled" mandatory rounded="xl" selected-class="bg-emerald">
            <v-btn :value="false" size="small" variant="text">🎛️ สร้างรูปภาพด้วย Normal Pass</v-btn>
            <v-btn :value="true" size="small" variant="text">🤖 Gemma 4 เปลี่ยนสีโมเดล</v-btn>
          </v-btn-toggle>
        </div>

        <v-card variant="outlined"
          style="border-color: #1e293b !important; background-color: #0f172a; border-radius: 16px;"
          class="w-100 position-relative mb-5 overflow-hidden shadow-2xl">
          <div ref="canvasContainer" style="width: 100%; height: 500px; min-height: 500px;" class="block"></div>

          <div class="camera-hud-box">
            <div class="hud-title">
              <v-icon icon="mdi-video-outline" size="14" class="mr-1" style="color: #10b981;"></v-icon>
              ตำแหน่งกล้อง
            </div>
            <div class="hud-vectors">
              <span>X: <strong style="color: #10b981;">{{ cameraPos.x }}</strong></span>
              <span>Y: <strong style="color: #10b981;">{{ cameraPos.y }}</strong></span>
              <span>Z: <strong style="color: #10b981;">{{ cameraPos.z }}</strong></span>
            </div>
          </div>
          <v-overlay :model-value="isLoading" contained persistent class="align-center justify-center text-center"
            scrim="black" style="--v-overlay-scrim-opacity: 0.85; backdrop-filter: blur(4px);">
            <div class="d-flex flex-column align-center justify-center">
              <v-progress-circular color="emerald" indeterminate size="48" class="mb-3"></v-progress-circular>
              <span class="text-body-2 font-weight-medium text-grey-lighten-2">🤖 AI
                กำลังทำสีและจัดแสงให้รถของคุณ...</span>
            </div>
          </v-overlay>
        </v-card>

        <div v-if="isAIControlled" class="animate-fade-in w-100">
          <div class="control-panel-card">
            <div class="step-number mb-4">1</div>
            <label class="custom-input-label">💬 ป้อนคำสั่งภาษาไทยเพื่อให้ AI ปรับแต่งฉาก 3D และถอดความเรนเดอร์</label>
            <GemmaChat @update-car-settings="handleAISettings" />
          </div>
        </div>

        <div v-else class="animate-fade-in w-100">
          <div class="control-panel-card">
            <div class="form-grid-layout">
              <div class="custom-input-group">
                <div class="step-number mb-4">1</div>
                <label class="custom-input-label">อธิบายรูปแบบภาพที่ต้องการ <span class="required-star">*</span></label>
                <input type="text" v-model="prompt"
                  placeholder="พิมพ์สไตล์รถที่ต้องการ เช่น A professional studio photograph..." class="custom-plain-input"
                  required />
              </div>

              <div class="custom-button-group">
                <button @click="generateAIRender" :disabled="isLoading" class="custom-html-render-btn">
                  Render ด้วย AI
                </button>
              </div>

            </div>
          </div>
          <div class="control-panel-card">
            <div class="step-number mb-4">2</div>
            <p class="text-caption text-grey-lighten-1 font-weight-bold tracking-wider mb-2 d-flex align-center">
              ภาพโครงร่าง (Normal Map Pass) ที่ส่งให้ AI</p>
            <v-expand-transition>
              <div v-if="capturedImage" class="mt-4 d-flex flex-column align-center w-100 pt-4"
                style="border-top: 1px solid rgba(255,255,255,0.06);">
                <div class="normal-map-preview-zone">


                  <!-- <v-icon icon="mdi-camera" size="14" color="grey" class="mr-1"></v-icon> -->

                  <v-img :src="capturedImage" cover class="rounded-lg bg-black"
                    style="border: 1px solid #1e293b;"></v-img>

                  <div class="legend-hud-box">
                    <p class="legend-hud-title">
                      <v-icon icon="mdi-information-outline" size="14" class="mr-1" color="grey"></v-icon>
                      ระบบวิเคราะห์มิติพื้นผิว (Surface Orientation)
                    </p>

                    <div class="legend-grid">
                      <div class="legend-item">
                        <span class="color-dot" style="background-color: #3b82f6; box-shadow: 0 0 6px #3b82f6;"></span>
                        <span class="legend-text"><strong>น้ำเงิน:</strong> หน้าตรง</span>
                      </div>
                      <div class="legend-item">
                        <span class="color-dot" style="background-color: #10b981; box-shadow: 0 0 6px #10b981;"></span>
                        <span class="legend-text"><strong>เขียว:</strong> ด้านบน</span>
                      </div>
                      <div class="legend-item">
                        <span class="color-dot" style="background-color: #f43f5e; box-shadow: 0 0 6px #f43f5e;"></span>
                        <span class="legend-text"><strong>แดง:</strong> ด้านข้าง</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-expand-transition>
          </div>
          <div class="control-panel-card">
            <div class="step-number mb-4">3</div>
            <p class="text-caption text-grey-lighten-1 font-weight-bold tracking-wider mb-2 d-flex align-center"> ผลลัพธ์
            </p>
            <v-expand-transition>
              <div v-if="aiRenderedImage" class="w-100 d-flex flex-column align-center">
                <v-card variant="flat" class="w-100 pa-4 rounded-xl border mb-5"
                  style="background: linear-gradient(to bottom, rgba(16, 185, 129, 0.04), transparent); border-color: rgba(16, 185, 129, 0.2) !important;">
                  <div class="mx-auto" style="max-width: 700px; width: 100%;">
                    <v-img :src="aiRenderedImage" class="rounded-lg shadow-2xl border" style="border-color: #1e293b;"
                      alt="AI Rendered Masterpiece"></v-img>
                  </div>
                </v-card>
              </div>
            </v-expand-transition>
          </div>
        </div>

      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GemmaChat from './GemmaChat.vue'
import * as THREE from 'three'

// 💡 2. ตัวแปรคุมโหมดสลับหน้ากาก (Manual vs AI)
const isAIControlled = ref(false)
const cameraPos = ref({ x: 0, y: 0, z: 0 })
// 💡 3. ฟังก์ชันรับค่าจาก Gemma 4 แล้วชิ่งไปสั่ง Three.js และ Python ต่อ
const handleAISettings = (settings) => {
  console.log("🤖 ได้รับคำสั่งจาก Gemma 4:", settings)

  // A. ปรับแสงสว่างในฉาก Three.js
  if (settings.light !== undefined) {
    if (ambientLight) ambientLight.intensity = settings.light * 0.8
    if (dirLight1) dirLight1.intensity = settings.light
  }

  // B. เปลี่ยนสีรถบนหน้าจอ Canvas ทันที (Pure Three.js)
  if (settings.color && mainObject) {
    mainObject.traverse((child) => {
      if (child.isMesh && child.material) {
        // เปลี่ยนสีวัสดุ
        child.material.color.set(settings.color)
        
        // อัปเดตสีกลับเข้าไปใน userData ด้วย เวลาสลับ Normal Map จะได้สีไม่เพี้ยน
        if (child.userData.originalMaterial) {
          child.userData.originalMaterial.color.set(settings.color)
        }
      }
    })
  }

  // C. แต่งประโยค Prompt อัตโนมัติด้วยสีที่ AI เลือกให้
  // if (settings.color) {
  //   prompt.value = `A professional studio hyperrealistic photograph of a futuristic sports car, painted in elegant ${settings.color}, cyberpunk aesthetic, studio cinematic lighting, 8k resolution, highly detailed masterpiece`
  // }

  // D. สั่งกระบวนการเรนเดอร์ (ถ่ายภาพ Normal Map -> ส่ง Python API) ทันที!
  // if (isAIControlled.value) {
  //   console.log("🚀 โหมด AI ควบคุม: กำลังสั่งเรนเดอร์ภาพผลลัพธ์อัตโนมัติ...")
  //   generateAIRender()
  // }
}

const updateCameraLiveStats = () => {
  if (camera) {
    cameraPos.value.x = camera.position.x.toFixed(2)
    cameraPos.value.y = camera.position.y.toFixed(2)
    cameraPos.value.z = camera.position.z.toFixed(2)
  }
}

let renderer = null
let scene = null
let camera = null
let controls = null
let carModel = null
let ambientLight = null
let dirLight1 = null
let mainObject = null
const canvasContainer = ref(null)
const prompt = ref('')
const capturedImage = ref(null)
const aiRenderedImage = ref(null)
const isLoading = ref(false)

// วัสดุสำหรับสลับผิว
const normalMaterial = new THREE.MeshNormalMaterial()
let resizeObserver = null
const initThreeD = (width, height) => {
  console.log("📏 [สถาปัตยกรรมกางจอสำเร็จ] เริ่มสร้างโลก 3D ขนาด:", width, "x", height)
  // A. สร้าง Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f172a')
  // B. สร้าง Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(4, 3, 5)
  // C. สร้าง Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(width, height)
  canvasContainer.value.appendChild(renderer.domElement)
  // D. ใส่ระบบควบคุมมุมกล้อง
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 0, 0)
  // E. ใส่แสงสว่างในฉากปกติ
  ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)
  dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight1.position.set(5, 10, 7)
  scene.add(dirLight1)
  // F. สร้างวัตถุจำลอง (กล่องแดง)
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const originalBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444 })
  mainObject = new THREE.Mesh(geometry, originalBoxMaterial)
  scene.add(mainObject)
  console.log("📦 กล่องแดงจำลองพร้อมทำงาน")

  // G. โหลดโมเดลรถจริงเข้ามาแทนที่แบบ Async
  const loader = new GLTFLoader()
  loader.load('/models/merc_hovercar.glb', (gltf) => {
    if (mainObject) scene.remove(mainObject)
    mainObject = gltf.scene
    mainObject.traverse((child) => {
      if (child.isMesh) {
        child.userData.originalMaterial = child.material
      }
    })

    const box = new THREE.Box3().setFromObject(mainObject)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    mainObject.position.x += (mainObject.position.x - center.x)
    mainObject.position.y += (mainObject.position.y - center.y)
    mainObject.position.z += (mainObject.position.z - center.z)

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2.5 / maxDim
    mainObject.scale.set(scale, scale, scale)

    scene.add(mainObject)
    console.log("🏎️ โหลดโมเดลรถจริงสำเร็จและสวมเข้าฉากแล้ว!")
  }, undefined, (error) => {
    console.warn('⚠️ โหลดไฟล์รถไม่เข้า (ใช้กล่องแดงจำลองทดสอบต่อไปได้เลย):', error)
  })
  // H. สั่งรันแอนิเมชันลูปการวาดหน้าจอ (Render Loop)
  const animate = () => {
    if (!renderer) return
    requestAnimationFrame(animate)
    if (controls) {
      controls.update()
      if (camera) {
        cameraPos.value.x = camera.position.x.toFixed(2)
        cameraPos.value.y = camera.position.y.toFixed(2)
        cameraPos.value.z = camera.position.z.toFixed(2)
      }
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()
}

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const width = entry.contentRect.width
      const height = entry.contentRect.height
      if (!renderer && width > 0 && height > 0) {
        initThreeD(width, height)
        resizeObserver.disconnect()
      }
    }
  })
  if (canvasContainer.value) {
    resizeObserver.observe(canvasContainer.value)
  }
  window.addEventListener('resize', onWindowResize)
})

// 🛠️ แก้ไขฟังก์ชัน onMounted ใหม่ทั้งหมด ตัดระบบสังเกตการณ์ที่พังออกไปครับ
onMounted(() => {
  console.log("🚀 [Bypass Mode] บังคับรันระบบ 3D ทันทีเพื่อหลีกเลี่ยงปัญหา CSS Layout")
  let targetWidth = canvasContainer.value?.clientWidth || window.innerWidth * 0.6
  let targetHeight = 500
  initThreeD(targetWidth, targetHeight)
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (renderer) {
    renderer.dispose()
    renderer = null
  }
  scene = null
  camera = null
  controls = null
})

const onWindowResize = () => {
  if (!camera || !renderer) return

  const width = canvasContainer.value?.clientWidth || window.innerWidth * 0.6
  // 🔴 บังคับความสูงตอนย่อขยายหน้าจอให้เป็น 500 เสมอ 👇
  const height = 500

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

// 9. ฟังก์ชันกดปุ่มดึงภาพโครงร่างส่ง AI
const generateAIRender = async () => {
  console.log("--- เริ่มตรวจสอบสเตตัสการถ่ายภาพ ---")
  console.log("1. โมเดล (mainObject):", mainObject ? "✅ พร้อม" : "❌ ว่าง")
  console.log("2. เรนเดอร์ (renderer):", renderer ? "✅ พร้อม" : "❌ ว่าง")

  if (!mainObject || !renderer || !scene || !camera) {
    console.error("🚨 ระบบ 3D ยังจัดเตรียมไม่เสร็จ")
    return
  }

  isLoading.value = true

  // Step A: ปลุกผิวสีรุ้ง (Normal Map) และปิดไฟส่องสว่างชั่วคราว
  if (ambientLight) ambientLight.visible = false
  if (dirLight1) dirLight1.visible = false

  if (mainObject.isMesh) {
    mainObject.material = normalMaterial
  } else {
    mainObject.traverse((child) => {
      if (child.isMesh) child.material = normalMaterial
    })
  }

  // บังคับให้ Three.js วาดผิวสีรุ้งลงแคนวาสทันทีในเฟรมนี้
  renderer.render(scene, camera)
  await nextTick()

  // Step B: ดึงพิกเซลรูปภาพออกมาเป็น Base64
  try {
    const canvasElement = renderer.domElement
    if (canvasElement) {
      const base64Data = canvasElement.toDataURL('image/png')
      if (base64Data && base64Data.length > 50) {
        capturedImage.value = base64Data
        console.log("✅ ดึงภาพสำเร็จ! ความยาวสตริง Base64:", base64Data.length)
      } else {
        console.error("🚨 ภาพยังคงว่างเปล่า ตัวแปรแคนวาสคืนค่าล้มเหลว")
      }
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลภาพ:", err)
  }
  if (ambientLight) ambientLight.visible = true
  if (dirLight1) dirLight1.visible = true
  if (mainObject.isMesh) {
    mainObject.material = originalMaterial || new THREE.MeshStandardMaterial({ color: 0xef4444 })
  } else {
    mainObject.traverse((child) => {
      if (child.isMesh && child.userData.originalMaterial) {
        child.material = child.userData.originalMaterial
      }
    })
  }

  try {
    console.log("🚀 กำลังตรวจสอบค่า Prompt ก่อนส่ง:", prompt.value)
    const payload = {
      prompt: prompt.value,
      image_base64: capturedImage.value
    }
    const response = await fetch('https://car-ai-render.onrender.com/api/generate-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const result = await response.json()
      aiRenderedImage.value = result.ai_image_url
      console.log("🎉 หน้าบ้านได้รับภาพจาก AI สำเร็จรูปแล้วครับ!", result.ai_image_url)
    } else {
      console.error("🚨 ฝั่ง Python ตอบกลับมาว่าทำงานล้มเหลว")
    }
  } catch (err) {
    console.error("🚨 ไม่สามารถยิงไปหา Python Server ได้ (ลืมเปิดรัน Python หรือเปล่า?):", err)
  }

  // เรนเดอร์หน้าจอกลับมาเป็นภาพสีปกติ
  renderer.render(scene, camera)
  await nextTick()
  isLoading.value = false
}
</script>

<style scoped>
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

.main-content-wrapper {
  max-width: 960px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.w-100 {
  width: 100% !important;
}

.camera-hud-box {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 11px;
  font-family: monospace;
  z-index: 5;
}

.hud-title {
  display: flex;
  align-items: center;
  color: #b0bec5;
  font-weight: 700;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.hud-vectors {
  display: flex;
  gap: 8px;
}

/* 🛠️ สไตล์กล่องแดชบอร์ดหลักด้านล่าง */
.control-panel-card {
  width: 100%;
  background-color: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

/* คุม Layout แถวตรงให้ Input กับ Button อยู่ในแนวระนาบสมมาตร */
.form-grid-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  /* ล็อกฐานล่างของกล่องกรอกและปุ่มให้ขนานตรงกันพอดี */
  gap: 16px;
  width: 100%;
}

/* @media (max-width: 600px) {
  .form-grid-layout {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
} */

/* ✍️ จัดสไตล์ Label และช่องอินพุตตามโครงสร้างฟอร์มเดิมของคุณ */
.custom-input-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* บังคับให้ช่องพิมพ์กางกว้างเต็มพิกัด */
}

.custom-input-label {
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  text-align: left;
}

.required-star {
  color: #ef4444;
  margin-left: 2px;
}

/* ✍️ ตกแต่งช่องกรอกข้อความให้สว่างคมชัด ตัวหนังสือสีเข้มตัดกับกล่องสีขาวพิมพ์ง่าย */
.custom-plain-input {
  width: 100%;
  min-height: 38px;
  margin: 0px;
  padding: 0 16px;
  /* สีพื้นหลังเทาเข้มเกือบดำ ดึงค่าตามตัวอย่างรูปภาพ */
  background-color: #1a202c !important;
  /* สีตัวหนังสือเวลาพิมพ์ให้เป็นสีขาว/เทาอ่อน สว่างชัดเจน */
  color: #f3f4f6 !important;
  /* ขอบเทาเข้มแบบจางๆ บางๆ */
  border: 1px solid #2d3748;
  /* ความโค้งมนที่เท่ากันกับกล่องวิหาร A */
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.custom-plain-input::placeholder {
  color: #4a5568 !important;
  opacity: 1;
  /* บังคับให้บราวเซอร์ห้ามเปลี่ยนค่าความโปร่งแสง */
}

.custom-plain-input:focus {
  /* เปลี่ยนขอบให้สว่างขึ้นเล็กน้อยสไตล์ดาร์ก หรือจะใช้สีเขียวมรกต #10b981 ก็ได้ครับ */
  border-color: #3ab800;
  background-color: #1e2533 !important;
  /* สว่างขึ้นอีกเฉดนึงตอนโฟกัส */
}

/* 🟢 ปุ่มกดสีกราเดียนต์มรกตพรีเมียม สว่างสู้แสง ไม่โดนบราวเซอร์ดึงเป็นสีเทา */
.custom-button-group {
  flex-shrink: 0;
}

.custom-html-render-btn {
  height: 40px;
  padding: 0 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.custom-html-render-btn:hover {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%) !important;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.45);
}

.custom-html-render-btn:active {
  transform: scale(0.98);
}

.custom-html-render-btn:disabled {
  background: #374151 !important;
  color: #9ca3af !important;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* 📸 ส่วนบล็อกพรีวิวภาพโครงร่างและกล่องมิติสี */
.normal-map-preview-zone {
  max-width: 450px;
  width: 100%;
}

.legend-hud-box {
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.legend-hud-title {
  font-size: 11px !important;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.legend-grid {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.color-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}

.legend-text {
  font-size: 10.5px;
  color: #9ca3af;
  white-space: nowrap;
}

/* ไอคอนระยะห่าง */
.mr-1 {
  margin-right: 4px !important;
}

.mr-2 {
  margin-right: 8px !important;
}
</style>