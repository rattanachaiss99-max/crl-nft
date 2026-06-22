<script setup>
import { ref } from 'vue';
const activeTab = ref('ภาพรวมเนื้อหา');
const lessons = [
  { 
    title: 'ทำความเข้าใจ Llama คืออะไร', duration: '15m 25s',
    subLessons: [
      { title: "สำรวจการพัฒนาของ Llama", duration: "5m 32s", completed: true },
      { title: "เปรียบเทียบโมเดล Llama", duration: "5m 13s", completed: true },
      { title: "เตรียมความพร้อม", duration: "4m 39s", completed: true }
    ]
  },
  { 
    title: 'ใช้งาน Llama บนเครื่อง', duration: '20m 57s',
    subLessons: [
      { title: "ตั้งค่าการพัฒนา", duration: "5m 43s", completed: true },
      { title: "ตัวอย่าง: ใช้งาน Llama กับ Ollama", duration: "4m 6s", completed: true },
      { title: "เลือกการรูปแบบการ Quant", duration: "5m 8s", completed: true },
      { title: "ดาวโหลด Llama ด้วย Hugging Face...", duration: "5m 59s", completed: true }
    ]
  }
];
</script>

<template>
    <v-app style="background-color: #0b111e; min-height: 100vh;" class="text-white">
        <v-main class="d-flex flex-column align-center justify-start py-8 px-4">
            <div class="course-container">
            <div class="tabs-header">
            <div v-for="tab in ['ภาพรวมเนื้อหา', 'ไฟล์ต้นฉบับ', 'ใบประกาศ']" 
                :key="tab" 
                class="tab-item"
                :class="{ 'active': activeTab === tab }"
                @click="activeTab = tab">
                {{ tab }}
            </div>
            </div>
            <p class="path-info">นี่คือเนื้อหาเกี่ยวกับ : <strong>Open Source LLMs </strong></p>
            
            <p class="description">
                กฎระเบียบด้านความเป็นส่วนตัวและความละเอียดอ่อนของข้อมูลมักเป็นอุปสรรคต่อการใช้บริการ AI บนระบบคลาวด์ของบริษัทต่างๆ...
                <span class="read-more">เพิ่มเติม</span>
            </p>
            <v-expansion-panels variant="accordion" class="custom-panels" multiple>
            <v-expansion-panel 
                v-for="(lesson, index) in lessons" 
                :key="index" 
                class="lesson-panel"
            >
                <v-expansion-panel-title class="main-header">
                <div class="d-flex align-center">
                    <div class="lesson-number">{{ index + 1 }}</div>
                    <div>
                    <div class="text-h6 font-weight-bold">{{ lesson.title }}</div>
                    <div class="text-grey-lighten-1">{{ lesson.duration }}</div>
                    </div>
                </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="pa-0">
                <div 
                    v-for="(sub, subIdx) in lesson.subLessons" 
                    :key="subIdx" 
                    class="sub-lesson-row"
                >
                    <div class="d-flex align-center">
                    <v-icon 
                        :icon="sub.completed ? 'mdi-check-circle' : 'mdi-play-circle-outline'" 
                        :color="sub.completed ? '#00ff9d' : 'grey'"
                        class="mr-4"
                    ></v-icon>
                    <div>
                        <div class="text-body-1">{{ sub.title }}</div>
                        <div class="text-caption text-grey">{{ sub.duration }}</div>
                    </div>
                    </div>
                    <v-icon icon="mdi-dots-vertical" color="grey"></v-icon>
                </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
            </v-expansion-panels>
            </div>
        </v-main>
  </v-app>    
</template>

<style scoped>
.course-header-container { max-width: 1000px; margin: 0 auto 40px auto; color: white; }
.stats-bar { 
  background-color: #1a1b2d; /* สีม่วงเข้มแบบในภาพ */
  border: 1px solid rgba(255,255,255,0.05);
}
.text-primary { color: #bb86fc !important; } /* สีม่วงสว่าง */
.gap-4 { gap: 16px; }
/* Tabs */
.tabs-header { display: flex; gap: 30px; border-bottom: 1px solid #333; margin-bottom: 20px; }
.tab-item { padding-bottom: 10px; cursor: pointer; color: #aaa; }
.tab-item.active { border-bottom: 2px solid #fff; color: #fff; font-weight: bold; }

.course-container { max-width: 900px; margin: 0 auto; }

.custom-panels { background-color: #1a1b2d !important; }

.lesson-panel {
  background-color: #1a1b2d !important;
  color: white !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

/* เลขบทเรียน */
.lesson-number { 
  width: 40px; height: 40px; border: 2px solid #00ff9d; 
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #00ff9d; font-weight: bold; margin-right: 20px;
}

/* แถวบทเรียนย่อย */
.sub-lesson-row { 
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px 16px 60px; /* เพิ่ม padding ซ้ายเพื่อให้ตรงกับชื่อบทเรียนหลัก */
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.sub-lesson-row:hover { background: rgba(255, 255, 255, 0.03); }

/* ปรับแต่ง Vuetify */
:deep(.v-expansion-panel-title) { padding: 20px 24px !important; }
:deep(.v-expansion-panel-text__wrapper) { padding: 0 !important; }
</style>