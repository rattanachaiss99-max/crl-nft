<template>
  <div class="character-sheet-workspace" style="display: flex; gap: 20px; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 8px;">
    
    <!-- 📄 ฝั่งซ้าย: แผงควบคุมและข้อมูล Character Sheet -->
    <div class="left-panel" style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
      
      <!-- ปุ่ม Quick Test สลับตัวละคร -->
      <div class="quick-select">
        <label style="font-size: 13px; color: #94a3b8; display: block; margin-bottom: 5px;">🧬 เลือกตัวละครต้นแบบ AI:</label>
        <div style="display: flex; gap: 8px;">
          <button @click="selectCharacter('cybergirl')" style="padding: 8px 16px; background: #ec4899; color: white; border: none; border-radius: 4px; cursor: pointer;">👩‍💻 Aria (Cyber Hacker)</button>
          <button @click="selectCharacter('cyborg')" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">🤖 Jaxon (Cyborg Soldier)</button>
        </div>
      </div>

      <!-- แผ่นการ์ดประวัติ (The Sheet) -->
      <div class="character-card" style="background: #1e293b; padding: 20px; border-radius: 6px; border: 1px solid #334155;">
        <h2 style="margin-top: 0; color: #38bdf8; font-size: 24px;">👤 {{ activeChar.name }}</h2>
        <span style="background: #334155; padding: 3px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">บทบาท: {{ activeChar.role }}</span>
        
        <hr style="border-color: #334155; margin: 15px 0;" />
        
        <p style="font-size: 14px;"><strong style="color: #94a3b8;">ลักษณะภายนอก:</strong> {{ activeChar.appearance }}</p>
        <p style="font-size: 14px;"><strong style="color: #94a3b8;">บุคลิกภาพ:</strong> {{ activeChar.personality }}</p>
        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;"><strong style="color: #94a3b8;">ประวัติเบื้องหลัง:</strong> {{ activeChar.biography }}</p>
      </div>
    </div>

    <!-- 📽️ ฝั่งขวา: Cinematic Component (โชว์ฟุตเทจ AI) -->
    <div class="right-panel" style="flex: 1; display: flex; flex-direction: column; justify-content: center; background: #000; border-radius: 6px; overflow: hidden; position: relative; aspect-ratio: 16/9;">
      
      <!-- เทคนิคซีเนมาติก Overlay ครอบบนวิดีโอ -->
      <div class="cinema-overlay" style="position: absolute; top: 12px; left: 12px; font-family: monospace; font-size: 11px; color: #00ff00; z-index: 5;">
        🟢 AI CHARACTER VISUALIZATION // PROFILE_MODE
      </div>

      <video 
        :src="activeChar.videoUrl" 
        autoplay 
        loop 
        muted 
        style="width: 100%; height: 100%; object-fit: cover;"
      ></video>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AICharacterSheet',
  data() {
    return {
      // 🌟 ย้ายฐานข้อมูลเข้ามาประกาศข้างใน data() ตรงนี้เลยครับ
      charDatabase: {
        cybergirl: {
          name: "Aria Vance",
          role: "Hacker / Rogue",
          appearance: "ผมสั้นสีนีออนชมพู เสื้อหนังแจ็กเก็ตสีดำ มีรอยสักเรืองแสงที่คอ",
          personality: "ฉลาดเป็นกรด เงียบขรึม ไม่ไว้วางใจใคร",

          biography: "อดีตวิศวกรระบบของบริษัทเครือข่ายยักษ์ใหญ่ ปัจจุบันผันตัวมาเป็นแฮกเกอร์สายมืด"
        },
        cyborg: {
          name: "Commander Jaxon",
          role: "Heavy Soldier",
          appearance: "แขนขวาเป็นเหล็กกล้าไฮดรอลิก ดวงตาข้างซ้ายเป็นเลนส์กล้องไซเบอร์เนติกส์สีแดง",
          personality: "ดุดัน ซื่อสัตย์ ผ่านสมรภูมิมาอย่างโชกโชน",

          biography: "หัวหน้าหน่วยรบพิเศษที่ได้รับการดัดแปลงร่างกายหลังจากรอดชีวิตจากสงครามครั้งใหญ่"
        }
      },
      // 🌟 ตั้งค่าเริ่มต้น โดยดึงจาก charDatabase ข้างบนมาใช้งานผ่านคีย์
      activeChar: null 
    }
  },
  // ใช้ด่าน Created เพื่อล็อกให้ข้อมูลตัวแรกโชว์ตัวทันทีเมื่อเปิดหน้าเว็บ
  created() {
    this.activeChar = this.charDatabase.cybergirl;
  },
  methods: {
    selectCharacter(key) {
      this.activeChar = this.charDatabase[key];
    }
  }
}
</script>