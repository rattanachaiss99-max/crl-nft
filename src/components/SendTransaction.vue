<script setup lang="ts">
import { ref, watch } from 'vue'; // 🟢 เพิ่ม ref และ watch เข้ามา
import { BaseError, parseEther } from 'viem';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount, useChainId } from '@wagmi/vue';
import { supabase } from '../utils/supabase'; // 🟢 เช็กพาทไฟล์ supabase ของคุณให้ถูกตามโครงสร้างโฟลเดอร์
// 1. ประกาศตัวแปรส่วนกลาง (State) ไว้บนสุด เพื่อให้ใช้ร่วมกันได้ทั้งไฟล์
const { address: userAddress } = useAccount();
const chainId = useChainId();
const toAddress = ref<`0x${string}` | null>(null); // 🟢 สำหรับเก็บที่อยู่ปลายทาง
const amountValue = ref<string>('');              // 🟢 สำหรับเก็บจำนวนเงินที่กรอก
const { data: hash, isPending, error, sendTransaction } = useSendTransaction();
const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  });
// 2. ฟังก์ชัน Submit สำหรับดึงค่าจากหน้าฟอร์มมาเก็บลง ref และยิงธุรกรรม
function submit(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement);
  
  // 🟢 นำค่าที่ดึงจาก Form ยัดใส่เข้าไปใน .value ของตัวแปรส่วนกลางที่เราสร้างไว้ด้านบน
  toAddress.value = formData.get('address') as `0x${string}`;
  amountValue.value = formData.get('value') as string;

  console.log("=== Debugging Transaction ===");
  console.log("Current Sender Address:", userAddress.value); 
  console.log("Recipient Address (To):", toAddress.value);
  console.log("Raw Value Input (String):", amountValue.value);
  console.log("Current Connected Chain ID:", chainId.value);

  try {
    if (!amountValue.value || isNaN(Number(amountValue.value))) {
      alert("Please enter a valid number");
      return;
    }

    const parsedValue = parseEther(amountValue.value);
    console.log("Parsed Value in Wei (BigInt):", parsedValue.toString());

    // 🟢 ส่งค่าออกบล็อกเชน
    sendTransaction({ to: toAddress.value, value: parsedValue });

  } catch (err) {
    console.error("Error during parseEther or sendTransaction:", err);
  }
}
// 3. บล็อกเฝ้าดูความสำเร็จของบล็อกเชน เพื่อยิงเข้า Supabase (ตอนนี้จะดึงค่ามาใช้ได้ครบแล้ว)
watch(isConfirmed, async (newConfirmedState) => {
  if (newConfirmedState && hash.value) {
    console.log("🚀 Transaction Confirmed! Saving to Supabase...");
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('transactions') // 🟢 ชื่อตารางถูกต้องแล้ว
        .insert([
          {
            tx_hash: hash.value,
            sender_address: userAddress.value,    // 🟢 เปลี่ยนจาก sender เป็น sender_address
            receiver_address: toAddress.value,  // 🟢 เปลี่ยนจาก recipient เป็น receiver_address
            amount: Number(amountValue.value),   // 🟢 แปลงจาก String ให้เป็น Number เพื่อให้เข้าล็อกประเภท numeric
            status: 'success',
            created_at: new Date().toISOString()
          }
        ]);

      if (supabaseError) {
        console.error("❌ Supabase Insert Error:", supabaseError.message);
      } else {
        console.log("✅ Successfully saved to Supabase!", data);
        
        // ล้างค่าในฟอร์มเมื่อเสร็จสิ้น
        toAddress.value = null;
        amountValue.value = '';
      }

    } catch (err) {
      console.error("❌ Failed to trigger Supabase insert:", err);
    }
  }
});
</script>

<template>
  <div class="transfer-container">
    <div class="stack">
      <h3 class="form-title">💸 โอนสินทรัพย์ (Transfer)</h3>
      
      <form class="set" @submit.prevent="submit">
        <div class="input-group">
          <label class="input-label">ที่อยู่กระเป๋าผู้รับ (Receiver Address)</label>
          <input 
            name="address" 
            placeholder="0x..." 
            class="custom-input"
            required 
          />
        </div>
        
        <div class="input-group">
          <label class="input-label">จำนวนเหรียญ (Amount)</label>
          <input
            name="value"
            placeholder="0.00"
            type="number"
            step="0.0001"
            class="custom-input"
            required
          />
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isPending">
          <span v-if="isPending" class="btn-spinner"></span>
          <span>{{ isPending ? 'กำลังส่งธุรกรรม...' : 'ส่งเหรียญ (Send)' }}</span>
        </button>
      </form>

      <div class="status-wrapper">
        <div v-if="hash" class="status-msg hash">
          <span class="icon">🔗</span>
          <p><strong>Tx Hash:</strong> <span class="hash-text">{{ hash }}</span></p>
        </div>
        
        <div v-if="isConfirming" class="status-msg confirming">
          <span class="spinner-small"></span>
          <p>กำลังรอยืนยันบล็อกบนบล็อกเชน...</p>
        </div>
        
        <div v-if="isConfirmed" class="status-msg confirmed">
          <span class="icon">✅</span>
          <p>ทำรายการสำเร็จเรียบร้อย!</p>
        </div>
        
        <div v-if="error" class="status-msg error-box">
          <span class="icon">❌</span>
          <p><strong>เกิดข้อผิดพลาด:</strong> {{ (error as BaseError).shortMessage || error.message }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.transfer-container {
  width: 100%;
  box-sizing: border-box;
}

.stack {
  background-color: #4d5b7c; /* Slate 900 */
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.form-title {
  font-size: 16px;
  font-weight: 700;
  color: #38bdf8; /* สีฟ้าสว่างธีมเดียวกับตัว Badge */
  margin: 0 0 20px 0;
  letter-spacing: -0.02em;
}

.set {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 12px;
  color: #94a3b8; /* เทา Slate 400 */
  font-weight: 500;
}

/* ✏️ กล่องกรอกข้อมูล (Input) ฟีล Web3 ล้ำๆ */
.custom-input {
  background-color: #1e293b; /* Slate 800 */
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px 14px;
  color: #ffffff;
  font-size: 14px;
  font-family: monospace; /* สไตล์ Address กระเป๋าเงิน */
  transition: all 0.2s ease;
  width: 90%;
  box-sizing: border-box;
}

.custom-input:focus {
  outline: none;
  border-color: #3b82f6; /* ไฮไลท์ฟ้า */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  background-color: #0f172a;
}

.custom-input::placeholder {
  color: #64748b;
}

/* 🚀 ปุ่มกดโอนมาดเท่ */
.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.submit-btn:disabled {
  background: #334155;
  color: #64748b;
  cursor: not-allowed;
  box-shadow: none;
}

/* 🔔 กล่องข้อความแจ้งเตือนสถานะต่างๆ */
.status-wrapper {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-msg {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.4;
}

.status-msg p { margin: 0; flex: 1; }

.status-msg.hash {
  background-color: rgba(56, 189, 248, 0.06);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: #e0f2fe;
}
.hash-text {
  font-family: monospace;
  word-break: break-all;
  color: #38bdf8;
}

.status-msg.confirming {
  background-color: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fef3c7;
}

.status-msg.confirmed {
  background-color: rgba(74, 222, 128, 0.06);
  border: 1px solid rgba(74, 222, 128, 0.2);
  color: #dcfce7;
}

.status-msg.error-box {
  background-color: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

/* 🔄 Spinners */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-top: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>