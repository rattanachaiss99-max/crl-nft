<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['update-car-settings'])
const userInput = ref('')
const rawResponse = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const parsedAISection = computed(() => {
  if (!rawResponse.value) return { thought: '', answer: '' }  
  const text = rawResponse.value
  const thoughtMatch = text.match(/<thought>([\s\S]*?)<\/thought>/) || text.match(/<\|thought\|>([\s\S]*?)<\|/);
  if (thoughtMatch) {
    const thought = thoughtMatch[1].trim()
    const answer = text.replace(thoughtMatch[0], '').trim()
    return { thought, answer }
  }   
  return { thought: '', answer: text }
})

const sendToGemma = async () => {
  if (!userInput.value.trim() || isLoading.value) return  
  isLoading.value = true
  errorMessage.value = ''
  rawResponse.value = ''
  
  try {
    const response = await fetch('http://192.168.1.45:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "loaded-model",
        // 💡 2. ใส่กลไกควบคุมความคิดของ Gemma 4 ให้พ่นคำสั่งเป็น JSON เท่านั้น
        messages: [
          {
            role: "system",
            content: "คุณคือระบบควบคุมฉาก 3D หากผู้ใช้สั่งเปลี่ยนสีรถหรือปรับแสง ให้วิเคราะห์คำสั่งแล้วตอบกลับเป็นรูปแบบ JSON นี้เท่านั้น: {\"color\": \"#โค้ดสี\", \"light\": ตัวเลขความสว่าง} ห้ามพิมพ์ทักทาย หรือบรรยายคำพูดอื่นใดเด็ดขาด พ่นแค่ JSON ตัวนี้ออกมาพอ"
          },
          { role: "user", content: userInput.value }
        ],
        temperature: 0.2, // 💡 ลดความอินดี้ของ AI ลงมาเพื่อให้ผลลัพธ์ JSON แม่นยำที่สุด
        max_tokens: 1500
      })
    })
    
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    const aiContent = data.choices[0].message.content
    rawResponse.value = aiContent
    userInput.value = ''    

    // 💡 3. ท่อสกัดข้อมูล: พยายามแกะ JSON ออกจากคำตอบของ AI
    try {
      // ค้นหาข้อความที่เป็นปีกกาโครงสร้าง JSON เผื่อโมเดลแอบหลุดข้อความอื่นมาพ่วงด้วย
      const jsonMatch = aiContent.match(/\{[\s\S]*?\}/)
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0])
        
        // ส่งกระจายสัญญาณขึ้นไปบอกทางหน้า Home.vue
        emit('update-car-settings', {
          color: parsedData.color || null,
          light: parsedData.light !== undefined ? parsedData.light : null
        })
      }
    } catch (jsonErr) {
      console.log('AI ตอบกลับเป็นข้อความทั่วไป ไม่ใช่ข้อมูลคำสั่งปรับสีรถ')
    }

  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = '❌ ไม่สามารถเชื่อมต่อกับ Gemma 4 ได้ กรุณาเปิด Local Server ใน LM Studio และเปิด CORS ด้วยนะครับ'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="gemma-container">
    <h2>🤖 Gemma 4 E4B x เปลี่ยนสีโมเดล</h2>
    <p class="subtitle">ผู้ใช้งานสามารถเปลี่ยนสีโมเดลได้ด้วย AI</p>
    <div v-if="errorMessage" class="error-box">
      {{ errorMessage }}
    </div>

    <!-- โซนแสดงคำตอบจาก AI -->
    <div class="chat-monitor">
      <div v-if="isLoading" class="loading-state">
        <span class="spinner">⏳</span> Gemma 4 กำลังประมวลผลความคิด...
      </div>
      
      <div v-if="rawResponse" class="response-wrapper">
        <!-- แสดงกระบวนการคิด (Thinking Block) ถ้ามี -->
        <div v-if="parsedAISection.thought" class="thought-block">
          <summary>🧠 คิดในใจ:</summary>
          <p>{{ parsedAISection.thought }}</p>
        </div>

        <!-- แสดงคำตอบจริง -->
        <div v-if="parsedAISection.answer" class="answer-block">
          <strong>Gemma 4:</strong>
          <p class="answer-text">{{ parsedAISection.answer }}</p>
        </div>
      </div>
    </div>

    <!-- โซนช่องป้อนคำสั่ง (Input) -->
    <div class="input-area">
      <textarea 
        v-model="userInput" 
        placeholder="พิมพ์คำถาม หรือสั่งให้แก้โค้ด Vue ตรงนี้..."
        @keydown.enter.prevent="sendToGemma"
        :disabled="isLoading"
      ></textarea>
      <button @click="sendToGemma" :disabled="isLoading || !userInput.trim()">
        {{ isLoading ? 'กำลังคิด...' : 'ส่งคำสั่ง' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.gemma-container {
  max-width: 700px;
  margin: 30px auto;
  padding: 20px;
  background: #1e1e24;
  color: #f3f4f6;
  border-radius: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

h2 { margin-bottom: 5px; color: #60a5fa; }
.subtitle { margin-top: 0; color: #9ca3af; font-size: 0.9rem; }

.chat-monitor {
  min-height: 150px;
  background: #111827;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  border: 1px solid #374151;
}

.thought-block {
  background: #1f2937;
  border-left: 4px solid #9ca3af;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  color: #9ca3af;
  font-size: 0.9rem;
  font-style: italic;
}

.thought-block summary {
  font-weight: bold;
  font-style: normal;
  color: #cbd5e1;
  margin-bottom: 5px;
}

.answer-block {
  line-height: 1.6;
  color: #f9fafb;
}

.answer-text {
  margin-top: 5px;
  white-space: pre-wrap; /* รักษาการเว้นบรรทัดและย่อหน้าของโค้ด */
}

.input-area {
  display: flex;
  gap: 10px;
}

textarea {
  flex: 1;
  height: 60px;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 6px;
  color: #fff;
  padding: 10px;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: #2563eb;
}

button {
  padding: 0 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

button:hover:not(:disabled) { background: #1d4ed8; }
button:disabled { background: #4b5563; cursor: not-allowed; }
.error-box { background: #7f1d1d; color: #fca5a5; padding: 10px; border-radius: 6px; margin-bottom: 10px; font-size: 0.9rem; }
.loading-state { color: #60a5fa; font-weight: bold; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>