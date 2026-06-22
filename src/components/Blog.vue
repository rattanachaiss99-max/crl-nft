<template>
  <div class="blog-container container my-5 text-white">
    <h1 class="mb-4 text-warning font-weight-bold">คลังความรู้</h1>
    <p class="text-muted">รวมบทความและไอเดียการสร้างสรรค์โมเดลรถซิ่งจากสมองกล AI</p>

    <hr class="border-secondary mb-5">

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">กำลังดึงบทความล่าสุด...</p>
    </div>

    <div v-else-if="blogs.length > 0" class="row">
      <div v-for="blog in blogs" :key="blog.id" class="col-md-6 mb-4">
        <div class="card bg-dark border-secondary h-100 text-white shadow-sm">
          <div class="card-body">
            <h5 class="card-title text-warning">{{ blog.title }}</h5>
            <p class="card-text text-muted">{{ blog.excerpt }}</p>
            <a href="#" class="btn btn-outline-warning btn-sm">อ่านเพิ่มเติม</a>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="fallback-blog-section animate__animated animate__fadeIn">
      <div class="alert alert-secondary bg-dark border-secondary text-light mb-4">
        💡 <strong>หมายเหตุ:</strong> ระบบเชื่อมต่อคลังบทความหลักขัดข้องชั่วคราว แสดงเนื้อหาคลังความรู้สำรองออฟไลน์
      </div>

      <div class="row">
        <div v-for="(fallback, index) in fallbackBlogs" :key="index" class="col-12 mb-5">
          <article class="p-4 rounded bg-dark border-secondary shadow">
            <h2 class="text-warning h4 mb-3">{{ fallback.title }}</h2>
            <div class="blog-meta text-muted small mb-3">
              <span>📅 วันที่เผยแพร่: {{ fallback.date }}</span> | <span>👤 ผู้เขียน: AI Car Designer Team</span>
            </div>
            <p class="card-text text-light lead-text" style="line-height: 1.8; text-indent: 20px;">
              {{ fallback.content }}
            </p>
            <div class="mt-3 text-muted small">
              <strong>แท็กที่เกี่ยวข้อง:</strong> <span class="badge bg-secondary mx-1" v-for="tag in fallback.tags" :key="tag">#{{ tag }}</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const blogs = ref([])
const isLoading = ref(true)

const fallbackBlogs = ref([
  {
    title: 'เทคนิคการปรับแต่ง Prompt สำหรับสร้างภาพรถซิ่ง 3D ให้สมจริงยุค 2026',
    date: '15 มิถุนายน 2026',
    tags: ['AI-Car', '3D-Model', 'Prompt-Technique'],
    content: 'การสร้างสรรค์ภาพรถยนต์สามมิติ (3D Automotive Render) ด้วยเทคโนโลยีปัญญาประดิษฐ์ในปัจจุบัน จำเป็นต้องอาศัยการกำหนดคำสั่งหรือ Prompt ที่มีความแม่นยำสูง โครงสร้างคำสั่งที่ดีควรเริ่มต้นด้วยการระบุสไตล์หลักของภาพ เช่น "Cyberpunk aesthetic" หรือ "Hyper-realistic photorealistic 8k render" จากนั้นตามด้วยรายละเอียดของตัวรถ เช่น "custom widebody sports car with neon underglow" สิ่งสำคัญที่ขาดไม่ได้คือการกำหนดสภาพแสงและมุมกล้อง เช่น "cinematic lighting, shot on 35mm lens, ray-tracing reflections" การใส่รายละเอียดที่ลึกซึ้งเหล่านี้จะช่วยให้โมเดล AI หรือ LoRA สามารถประมวลผลพื้นผิวสะท้อนของตัวถังรถยนต์และโครเมียมออกมาได้อย่างแนบเนียนและมีมิติสูงสุด ซึ่งลดระยะเวลาในการแก้งานฝั่งดีไซเนอร์ลงไปได้อย่างมหาศาล...'
  },
  {
    title: 'เจาะลึกกระบวนการทำงานของโมเดล LoRA ในการประมวลผลพื้นผิวรถยนต์พรีเมียม',
    date: '10 มิถุนายน 2026',
    tags: ['LoRA', 'StableDiffusion', 'CarDesign'],
    content: 'โมเดลทางเลือกขนาดเล็กอย่าง LoRA (Low-Rank Adaptation) ได้เข้ามาปฏิวัติวงการออกแบบรถยนต์ในระบบดิจิทัลอย่างสิ้นเชิง โดยหลักการทำงานพื้นฐานคือการเข้าไปแทรกแซงและปรับแต่งน้ำหนัก (Weights) ของโมเดลกระจายภาพหลักในส่วนที่เกี่ยวข้องกับรูปทรงและสถาปัตยกรรมยานยนต์ สำหรับการเรนเดอร์ภาพรถยนต์แต่งซิ่ง คาร์บอนไฟเบอร์ และล้อแม็กซ์ที่มีความละเอียดสูง โมเดล LoRA จะทำการคำนวณทิศทางของแสงและการสะท้อน (Specular Reflection) บนชั้นเคลือบสีเคลือบแก้ว (Clear Coat) ทำให้ภาพที่ได้มีความสมจริงใกล้เคียงกับการใช้ซอฟต์แวร์เรนเดอร์ระดับอุตสาหกรรมอย่าง KeyShot หรือ Blender แต่ใช้เวลาประมวลผลน้อยกว่าหลายเท่าตัว เหมาะสำหรับการทำต้นแบบเพื่องานโฆษณาและการระดมสมองในทีมพัฒนา'
  }
])

onMounted(() => {
  // จำลองการต่อ API หลังบ้าน (เช่น ดึงข้อมูลจาก main.py ของพี่)
  setTimeout(() => {
    // สมมติว่าดึงข้อมูลไม่สำเร็จ หรือหลังบ้านส่ง array เปล่ากลับมา []
    blogs.value = [] 
    isLoading.value = false
  }, 1200)
})
</script>

<style scoped>
.blog-container {
  max-width: 900px;
}
.bg-dark {
  background-color: #161616 !important;
}
.border-secondary {
  border-color: #2a2a2a !important;
}
.lead-text {
  font-size: 1.05rem;
  color: #e0e0e0 !important;
  white-space: pre-line; /* รองรับการเว้นบรรทัด */
}
article {
  transition: transform 0.3s ease;
}
article:hover {
  transform: translateY(-5px);
  border-color: #ffc107 !important;
}
</style>