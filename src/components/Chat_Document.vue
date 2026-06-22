<template>        
    <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
        <div class="text-center mb-8 position-relative">
            <v-chip text-color="white" class="mb-4">
              <v-icon icon="mdi-white-balance-sunny" size="small" class="mr-2"></v-icon>ระบบสืบค้นเอกสาร PDF
            </v-chip>
            
            <h2 class="text-orange text-h4 font-weight-black text-uppercase mb-2" style="letter-spacing: -0.5px;">
            การวิเคราะห์เอกสารภาษาไทย ด้วย Ollama
            </h2>
            
            <div class="d-flex justify-center mt-2">
                <a 
                href="/Policy_Document.pdf"
                download="Policy_Document.pdf" 
                style="text-decoration: none;"
                >
                  <div class="custom-download-btn font-weight-bold">
                      <span>
                        <i class="mdi mdi-download mr-2"></i>
                          ดาวน์โหลดเอกสารต้นฉบับ (.PDF)
                      </span>
                  </div>
                </a>
            </div>
            <p class="text-caption text-grey-lighten-1 mb-0">
            <v-icon icon="mdi-information-outline" size="small" class="mr-1 pb-1"></v-icon>
            หมายเหตุ: เอกสารที่ใช้ในการสร้างฐานข้อมูลสำหรับ AI
            </p>  
        </div>
        
        <div class="chat-logs-box" style="background: #1f2937; height: 400px; overflow-y: auto; border-radius: 16px; padding: 16px; margin-bottom: 16px;">
          <div v-for="(msg, idx) in chatMessages" :key="idx" class="mb-3">
              <div v-if="msg.role === 'user'" style="text-align: right;">
                  <span style="display: inline-block; padding: 10px 14px; border-radius: 12px; max-width: 80%; background: #2196F3; color: white;">
                      <strong>คุณ: </strong> {{ msg.content }}
                  </span>
              </div>

              <div v-else-if="msg.role === 'assistant'" style="text-align: left;">
                  <span style="display: inline-block; padding: 10px 14px; border-radius: 12px; max-width: 80%; background: #374151; color: #ccff00; white-space: pre-line;">
                      <strong>AI: </strong> {{ msg.content }}
                  </span>
              </div>

              <div v-else-if="msg.role === 'error'" style="text-align: center;">
                  <span style="display: inline-block; padding: 6px 12px; border-radius: 4px; background: #ff5252; color: white; font-size: 0.85rem;">
                      ⚠️ {{ msg.content }}
                  </span>
              </div>
          </div>
            <div v-if="chatLoading" style="color: #9ca3af; font-style: italic;">กำลังอ่านเอกสารและคิดคำตอบ...</div>
        </div>
        <div class="control-panel-card">
          <div class="form-grid-layout">            
            <div class="custom-input-group">
              <label class="custom-input-label">คำถามเกี่ยวกับเอกสาร <span class="required-star">*</span></label>
                <input 
                type="text" 
                v-model="userQuestionInput" 
                placeholder="พิมพ์ถามเรื่องที่ต้องการทราบ (เช่น เบิกอุปกรณ์ไฮบริด, ลิมิตโรงแรม)..." 
                class="custom-plain-input"
                @keyup.enter="sendQuestionToRAG"
                required
                >
            </div>           
            
            <div class="custom-button-group">
              <button 
                @click="sendQuestionToRAG" 
                :disabled="chatLoading"
                class="custom-html-render-btn"
              >
                <span v-if="chatLoading" class="ui-spinner"></span>                
                <span v-else>AI เอกสาร</span>
              </button>
            </div>
          </div>

          <v-expand-transition>
            <div v-if="capturedImage" class="mt-4 d-flex flex-column align-center w-100 pt-4" style="border-top: 1px solid rgba(255,255,255,0.06);">
              <div class="normal-map-preview-zone">
                <p class="text-caption text-grey-lighten-1 font-weight-bold tracking-wider mb-2 d-flex align-center">
                  <v-icon icon="mdi-camera" size="14" color="grey" class="mr-1"></v-icon>
                  ภาพโครงร่าง (Normal Map Pass) ที่ส่งให้ AI:
                </p>
                
                <v-img
                  :src="capturedImage"
                  cover
                  class="rounded-lg bg-black"
                  style="border: 1px solid #1e293b;"
                ></v-img>

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
    </div>
</template>

<script setup>
  import { ref , onMounted } from 'vue';
  import axios from 'axios';

  const userQuestionInput = ref('');
  const chatMessages = ref([]);
  const chatLoading = ref(false);
  const capturedImage = ref(null);

  onMounted(() => {
      chatMessages.value.push({
          role: 'assistant',
          content: "สวัสดีครับ! ผมเป็นผู้ช่วยอัจฉริยะประจำระบบสืบค้นเอกสารและนโยบายบริษัท\n\nคุณสามารถพิมพ์ถามเรื่องที่ต้องการทราบ เช่น นโยบายการเดินทาง, วงเงินงบประมาณ หรือเกณฑ์การเบิกอุปกรณ์ไฮบริด ได้เลยครับ มีเรื่องไหนให้ผมช่วยสืบค้นไหมครับ?"
      });
  });

  const sendQuestionToRAG = async () => {
    if (!userQuestionInput.value.trim() || chatLoading.value) return;
    
    // 1. ผลักคำถามฝั่งผู้ใช้ขึ้นเก็บบนหน้าจอ
    const question = userQuestionInput.value;
    chatMessages.value.push({ role: 'user', content: question });
    userQuestionInput.value = ''; // ล้างช่องพิมพ์
    chatLoading.value = true;
    
    try {
      const response = await axios.post('https://prod-rag-previs.onrender.com/api/policy-chat', {
      question: question
      });
      
      if (response.data.status === 'success') {
        chatMessages.value.push({
          role: 'assistant',
          content: response.data.answer
        });
      } else {
        const backendError = response.data.message || 'เกิดข้อผิดพลาดในการประมวลผลข้อมูลเอกสาร';
        chatMessages.value.push({ 
            role: 'error', 
            content: `หลังบ้านแจ้งว่า: ${backendError}`
        });
      }
    } catch (error) {
      console.error(error);
      chatMessages.value.push({ 
          role: 'error',          // 🔴 เปลี่ยนเป็น error ให้ตรงกับบล็อกแจ้งเตือน
          content: 'เซิร์ฟเวอร์ AI ขาดการเชื่อมต่อ หรือระบบกำลังตื่นจากโหมดหลับ (Cold Start) กรุณาลองใหม่อีกครั้งใน 1 นาทีครับ' 
      });
    } finally {
      chatLoading.value = false;
    }
  };
</script>

<style scoped>
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
.custom-button-group {
  flex-shrink: 0;
}

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
  border: 1px solid #2d302d; 
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
  opacity: 1; /* บังคับให้บราวเซอร์ห้ามเปลี่ยนค่าความโปร่งแสง */
}
.custom-plain-input:focus {
  /* เปลี่ยนขอบให้สว่างขึ้นเล็กน้อยสไตล์ดาร์ก หรือจะใช้สีเขียวมรกต #10b981 ก็ได้ครับ */
  border-color: #3ab800; 
  background-color: #1e2533 !important; /* สว่างขึ้นอีกเฉดนึงตอนโฟกัส */
}
/* ✍️ จัดสไตล์ Label และช่องอินพุตตามโครงสร้างฟอร์มเดิมของคุณ */
.custom-input-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* บังคับให้ช่องพิมพ์กางกว้างเต็มพิกัด */
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
  align-items: flex-end; /* ล็อกฐานล่างของกล่องกรอกและปุ่มให้ขนานตรงกันพอดี */
  gap: 16px;
  width: 100%;
}

.custom-download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ccff00; /* สีมะนาวเรืองแสง */
  color: #000000 !important; /* ล็อคตัวหนังสือสีดำเข้มสนิท */
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* เอฟเฟกต์จังหวะเอาเมาส์ชี้ (Hover) */
.custom-download-btn:hover {
  background-color: #ddff33; /* ขยับความสว่างขึ้นนิดนึง */
  transform: translateY(-1px);
}

/* เอฟเฟกต์จังหวะกดปุ่ม (Active) */
.custom-download-btn:active {
  transform: translateY(1px);
}

/* จัดระยะห่างให้ไอคอน mdi */
.mr-2 {
  margin-right: 8px;
}
.custom-ai-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;  
  background-color: #ccff00;
  color: #000000;  
  height: 30px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 0.875rem;  
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  user-select: none;
}

.custom-ai-btn:hover {
  background-color: #b3ff00;
}

.custom-ai-btn:active {
  opacity: 0.85;
}

.btn-loading {
  pointer-events: none; 
  opacity: 0.6;
  cursor: not-allowed;
}

.ui-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #000000;
  border-radius: 50%;
  animation: spin-animation 0.8s linear infinite;
}

@keyframes spin-animation {
  to {
    transform: rotate(360deg);
  }
}
.input-group {
  display: flex;
  flex-direction: column;
}

.required {
  color: #ff5252; /* สีแดงสำหรับดอกจัน */
}

/* 🌟 ตกแต่งช่อง Input ให้คล้าย v-text-field เดิม */
.custom-chat-input {
  background-color: #374151; /* สีพื้นหลังเดิม */
  color: #ffffff; /* สีตัวอักษร */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0 16px;
  height: 50px; /* ให้ความสูงเท่ากับปุ่ม v-btn */
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

/* เอฟเฟกต์ตอนคลิกพิมพ์ */
.custom-chat-input:focus {
  border-color: #ccff00;
  box-shadow: 0 0 0 2px rgba(204, 255, 0, 0.2);
}

/* สีของ Placeholder */
.custom-chat-input::placeholder {
  color: #9ca3af;
}

/* ปรับให้ขยายเต็มพื้นที่ */
.flex-grow-1 {
  flex-grow: 1;
}

/* ให้ปุ่มและช่องกรอกจัดชิดขอบล่างตรงกัน (กรณีมี Label) */
.align-end {
  align-items: flex-end;
}
</style>