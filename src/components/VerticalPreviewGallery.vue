<template>
    <div class="page-container">
        <div class="text-center mb-8">
            <v-chip text-color="white" class="mb-4">
            <v-icon icon="mdi-white-balance-sunny" size="small" class="mr-2"></v-icon>แอนิเมชั่นตัวละคร
            </v-chip>
            <h2 class="text-orange text-h4 font-weight-black text-uppercase mb-2" style="letter-spacing: -0.5px;">
            กระสุนของฉัน หรือ อาคมของเธอ !!!
            </h2>
            <p class="text-grey-lighten-1 text-body-1">
            การประยุกต์ใช้ AI ในการสร้างผลงาน [วิทยาการทางเลือก]
            </p>
        </div>

        <div class="gallery-content">
            <div class="group-toggle-controls mb-4">                
                <div class="toggle-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button 
                    class="toggle-btn" 
                    :class="{ 'active': activeVideoGroup === 'group1' }"
                    @click="activeVideoGroup = 'group1'"
                    >
                    ผู้หญิง: แอนิเมชั่น
                    </button>
                    <button 
                    class="toggle-btn" 
                    :class="{ 'active': activeVideoGroup === 'group2' }"
                    @click="activeVideoGroup = 'group2'"
                    >
                    ผู้หญิง: เสื้อผ้า
                    </button>
                <div style="border-left: 2px solid #334155; margin: 0 5px;"></div> 
                    <button 
                    class="toggle-btn" 
                    :class="{ 'active': activeVideoGroup === 'male_group' }"
                    @click="activeVideoGroup = 'male_group'"
                    >
                    ผู้ชาย: แอนิเมชั่น
                    </button>
                    <button
                    class="toggle-btn" 
                    :class="{ 'active': activeVideoGroup === 'male_group' }"
                    @click="activeVideoGroup = 'male_group'"
                    >
                    ผู้ชาย: เสื้อผ้า
                    </button>
                </div>
            </div>
            <div class="gallery-grid">
                <div v-for="item in filteredItems" :key="item.id" 
                     class="preview-card" 
                     :class="item.type === 'image' ? 'card-feature' : 'card-video'">
                    <template v-if="item.type === 'image'">
                        <img :src="item.imageUrl" class="media-bg" alt="Feature Image">
                        <div class="feature-overlay">
                            <div class="feature-header">
                                <h2 class="feature-title">
                                    {{ item.musicTitle }}
                                    <span class="badge-lime">{{ item.category }}</span>
                                </h2>
                                <p class="feature-desc">{{ item.description }}</p>
                            </div>
                            <audio :ref="(el) => setAudioRef(el, item.id)" :src="item.audioUrl" loop></audio>
                            <div class="feature-footer">
                                <button class="btn-primary-white" @click="toggleAudio(item)">
                                    <i class="mdi mr-2" :class="item.isMuted ? 'mdi-play' : 'mdi-pause'"></i>
                                    {{ item.isMuted ? 'ฟังเพลงตอนนี้ ↗' : 'กำลังเล่นเพลง...' }}
                                </button>
                            </div>
                        </div>                        
                    </template>
                    
                    <template v-else>
                        <div class="card-tag">{{ item.category }}</div>                        
                        <video :src="item.videoUrl" autoplay loop muted playsinline preload="metadata" class="media-bg" @click="toggleAudio(item)"></video>                        
                        <audio :ref="(el) => setAudioRef(el, item.id)" :src="item.audioUrl" loop></audio>                        
                        <button class="mute-btn" @click.stop="toggleAudio(item)">
                            <i class="mdi" :class="item.isMuted ? 'mdi-volume-mute' : 'mdi-volume-high'"></i>
                        </button>
                        <div class="music-bar-overlay" @click="toggleAudio(item)">
                            <div class="creator-info">
                                <span class="creator-name">@{{ item.creator }}</span>
                                <span class="video-desc">{{ item.description }}</span>
                            </div>
                            <div class="music-ticker">
                                <i class="mdi mdi-music-note music-icon"></i>
                                <div class="ticker-wrapper">
                                    <div class="ticker-text" :class="{ 'paused': item.isMuted }">
                                        {{ item.musicTitle }} • {{ item.musicTitle }} •
                                    </div>
                                </div>
                                <div class="equalizer" :class="{ 'paused': item.isMuted }">
                                    <span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import idle_UI from '@/assets/idle_UI.mp4'
import action_1 from '@/assets/action_1.mp4'
import walking_1 from '@/assets/walking.mp4'
import mission from '@/assets/mission.mp4'
import profile_main2 from '@/assets/Profile_main2.png'
import jogging from '@/assets/jogging.mp4'
import idling from '@/assets/idling.mp4'
import aiming from '@/assets/aiming.mp4'
import walking_02 from '@/assets/walking_02_916.mp4'
import profile_main1 from '@/assets/Profile_main1.png'
import male_idle from '@/assets/male_idle.mp4'
import male_walking from '@/assets/male_walking.mp4'

const categories = ref(['หน้าโหลด', 'เดินและวิ่ง', 'การต่อสู้', 'เปลี่ยนสถาวะ']);
const activeCategory = ref('ทั้งหมด');
const activeVideoGroup = ref('group1');
const previewItems = ref([
    {
        id: 1,
        type: 'image',
        imageUrl: profile_main2,
        audioUrl: '/profile_main.m4a',
        category: 'หน้าโหลด',
        creator: 'RAG',
        description: '',
        musicTitle: '',
        isMuted: true
    },
    {
        id: 2,
        type: 'video',
        videoUrl: idle_UI,
        audioUrl: '/idle_main.m4a',
        category: 'หน้าโหลด',
        creator: 'RAG',
        description: 'การเคลื่อนไหวโมเดล 3D - เดินและหยุด',
        musicTitle: 'ฉากรอ',
        isMuted: true
    },
    {
        id: 3,
        type: 'video',
        videoUrl: walking_1,
        category: 'เดินและวิ่ง',
        audioUrl: '/walking_1.m4a',
        creator: 'RAG',
        description: 'การเคลื่อนไหวโมเดล 3D - เดิน #1',
        musicTitle: 'ฉากแอคชั่น 1',
        isMuted: true
    },
    {
        id: 4,
        type: 'video',
        videoUrl: action_1,
        category: 'การต่อสู้',
        audioUrl: '/action_1.m4a',
        creator: 'RAG',
        description: 'การเคลื่อนไหวโมเดล 3D - การกระทำ #1',
        musicTitle: 'ฉากแอคชั่น 1',
        isMuted: true
    },
    {
        id: 5,
        type: 'video',
        videoUrl: mission,
        category: 'เปลี่ยนสถาวะ',
        audioUrl: '/mission.m4a',
        creator: 'RAG',
        description: 'การเคลื่อนไหวโมเดล 3D - การกระทำ #2',
        musicTitle: 'ฉากแอคชั่น 1',
        isMuted: true
    },
    // --- 🌟 วิดีโอชุดที่ 2 (ID: 6 - 9) ---
    { id: 6, type: 'video', videoUrl: jogging, category: 'ท่าทางพิเศษ', audioUrl: '/audio6.m4a', creator: 'RAG', description: 'โมเดล 3D - แสดงอารมณ์ #1', musicTitle: 'เพลงชุด 2', isMuted: true },
    { id: 7, type: 'video', videoUrl: idling, category: 'ท่าทางพิเศษ', audioUrl: '/audio7.m4a', creator: 'RAG', description: 'โมเดล 3D - แสดงอารมณ์ #2', musicTitle: 'เพลงชุด 2', isMuted: true },
    { id: 8, type: 'video', videoUrl: aiming, category: 'การต่อสู้', audioUrl: '/audio8.m4a', creator: 'RAG', description: 'โมเดล 3D - ท่าไม้ตาย', musicTitle: 'เพลงบอส', isMuted: true },
    { id: 9, type: 'video', videoUrl: walking_02, category: 'หน้าโหลด', audioUrl: '/audio9.m4a', creator: 'RAG', description: 'โมเดล 3D - ตอนจบ', musicTitle: 'ฉากจบ', isMuted: true },
    {
        id: 10,
        type: 'image',
        imageUrl: profile_main1,
        audioUrl: '/male_intro.m4a',
        category: 'หน้าโหลด',
        creator: 'RAG',
        description: '',
        musicTitle: 'ธีมตัวละครชาย',
        isMuted: true
    },
    {
        id: 11,
        type: 'video',
        videoUrl: male_idle,
        audioUrl: '/male_idle.mp3',
        category: 'หน้าโหลด',
        creator: 'RAG',
        description: 'การเคลื่อนไหวโมเดล 3D - เดินและหยุด',
        musicTitle: 'ฉากรอ',
        isMuted: true
    },
    {
        id: 12,
        type: 'video',
        videoUrl: male_walking,
        audioUrl: '/walking_1.m4a',
        category: 'หน้าโหลด',
        creator: 'RAG',
        description: 'การเคลื่อนไหวโมเดล 3D - เดินและหยุด',
        musicTitle: 'ฉากรอ',
        isMuted: true
    },
]);
const getCategoryCount = (category) => {
    return previewItems.value.filter(item => item.category === category).length;
};

const filteredItems = computed(() => {
    let items = previewItems.value;
    return items.filter(item => {
        if (activeVideoGroup.value === 'group1' || activeVideoGroup.value === 'group2') {
            if (item.id === 1) return true; 
            if (activeVideoGroup.value === 'group1') {
                return [2, 3, 4, 5].includes(item.id);            
            } else if (activeVideoGroup.value === 'group2') {
                return [6, 7, 8, 9].includes(item.id);
            }
        }
        // 🤖 CASE B: ถ้าผู้ใช้กดเลือกแท็บผู้ชาย (male_group)
        if (activeVideoGroup.value === 'male_group') {
            if (item.id === 10) return true;
            return item.id >= 11 && item.id <= 18;
        }

        return false;
    });
});

const audioElements = {};
const setAudioRef = (el, id) => { if (el) audioElements[id] = el; };

const toggleAudio = (item) => {
    const audioEl = audioElements[item.id];
    if (!audioEl) return;
    item.isMuted = !item.isMuted;
    if (item.isMuted) audioEl.pause();
    else audioEl.play().catch(err => console.warn("Autoplay blocked:", err));
};
</script>

<style scoped>
/* 🎛️ กล่องครอบกลุ่มปุ่มทั้งหมด (Container) */
.group-toggle-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(30, 41, 59, 0.7); /* slate-800 แบบโปร่งแสงซีเนมาติก */
  border: 1px solid rgba(51, 65, 85, 0.8); /* slate-700 */
  border-radius: 12px;
  margin-bottom: 24px;
  backdrop-filter: blur(8px); /* เบลอพื้นหลังเพิ่มความหรูหรา */
  flex-wrap: wrap;
}

/* 🏷️ ตัวหนังสือหมวดหมู่ด้านหน้า (ถ้ามี หรือลบออกได้ครับ) */
.controls-label {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8; /* slate-400 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: 8px;
}

/* ✂️ เส้นแบ่งค่ายระหว่าง ชาย/หญิง */
.controls-divider {
  height: 28px;
  width: 2px;
  background: linear-gradient(to bottom, transparent, #334155, transparent);
  margin: 0 8px;
}

/* 🔘 สไตล์ปุ่มกดเริ่มต้น (Base Button Status) */
.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #cbd5e1; /* slate-300 */
  background: #0f172a; /* slate-900 */
  border: 1px solid #334155;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* แอนิเมชันแบบสมูท */
  will-change: transform, background-color, border-color; /* สั่ง GPU ช่วยคำนวณการสลับสี */
}

/* 🖱️ เอฟเฟกต์ตอนเอาเมาส์ไปชี้ (Hover) ของทุกปุ่ม */
.toggle-btn:hover {
  color: #ffffff;
  border-color: #64748b;
  background: #1e293b;
  transform: translateY(-1px); /* ขยับขึ้นบนจางๆ เพิ่มมิติ */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* 🛑 เอฟเฟกต์ตอนโดนกด (Active/Click) */
.toggle-btn:active {
  transform: translateY(1px);
}

/* ❌ ปิดสิทธิ์การกดถ้าติด isLoading อยู่ */
.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* ======================================================= */
/* 🌟 คลาสปุ่ม Active แยกตามค่ายเพศตัวละคร (คีย์ลุคของงานนีออน) 🌟 */
/* ======================================================= */

/* 👩‍💻 1. ปุ่มฝั่งผู้หญิงได้รับสถานะ Active (สีชมพู Cyber-Neon) */
.toggle-btn.active[onClick*="group1"],
.toggle-btn.active[onClick*="group2"],
/* หรือถ้าผูกคลาสตรงๆ ด้วยเงื่อนไข activeVideoGroup === 'group1' หรือ 'group2' */
.female-active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.25));
  border-color: #ec4899; /* พิงค์นีออน */
  color: #fdf2f8;
  font-weight: 600;
  box-shadow: 0 0 14px rgba(236, 72, 153, 0.3); /* ไฟเรืองแสงรอบปุ่ม */
  text-shadow: 0 0 4px rgba(236, 72, 153, 0.5);
}

/* 🤖 2. ปุ่มฝั่งผู้ชายได้รับสถานะ Active (สีฟ้า Cybernetic-Blue) */
.toggle-btn.active[onClick*="male_group"],
/* หรือถ้าผูกคลาสตรงๆ ด้วยเงื่อนไข activeVideoGroup === 'male_group' */
.male-active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.25));
  border-color: #3b82f6; /* บลูไซเบอร์ */
  color: #eff6ff;
  font-weight: 600;
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.3); /* ไฟเรืองแสงรอบปุ่ม */
  text-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
}
/* =========================================
   🌟 1. โครงสร้างหลัก 
   ========================================= */
.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
}

.gallery-content {
    width: 100%;
}

/* =========================================
   🌟 2. ระบบ Grid หลัก (แก้ปัญหาการ์ดโดนบีบ)
   ========================================= */
.gallery-grid {
    display: grid;
    /* แบ่ง 4 คอลัมน์เท่ากัน (กว้าง 1 ส่วนเท่ากันหมด) */
    grid-template-columns: repeat(4, 1fr);
    gap: 20px; /* เพิ่มช่องว่างนิดนึงเพื่อให้ภาพไม่ดูเบียดเกินไป */
    grid-auto-flow: dense;
    margin-top: 24px;
}

/* =========================================
   🌟 3. รูปแบบการ์ดพื้นฐาน
   ========================================= */
.preview-card {
    position: relative;
    background-color: #1a1e23;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, border-color 0.3s ease;
    width: 100%; /* บังคับให้ขยายเต็มช่อง Grid เสมอ */
}

.preview-card:hover {
    transform: translateY(-5px);
    border-color: rgba(204, 255, 0, 0.4);
}

/* ขยายสื่อให้เต็มการ์ด */
.media-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    will-change: transform, opacity;
    transform: translate3d(0, 0, 0); /* บังคับใช้ Hardware Acceleration ของการ์ดจอ */
}

/* =========================================
   🌟 4. การ์ดรูปภาพขนาดใหญ่ (Feature Card)
   ========================================= */
.card-feature {
    /* 🌟 สำคัญมาก: สั่งให้กางเต็ม 2 คอลัมน์เลย (กินพื้นที่ 50%) */
    grid-column: span 2; 
    grid-row: span 2; /* สูงเท่ากับวิดีโอ 2 แถว */
    min-height: 580px; /* เพิ่มความสูงขึ้นนิดหน่อยเพื่อให้ดูอลังการ */
}

.feature-overlay {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 40px 32px;
    background: linear-gradient(180deg, rgba(26, 30, 35, 0.7) 0%, rgba(26, 30, 35, 0.2) 50%, rgba(26, 30, 35, 0.8) 100%);
}

.feature-title {
    color: #ffffff;
    font-size: 2.2rem;
    font-weight: 900;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.badge-lime {
    background: #ccff00;
    color: #000;
    font-size: 0.8rem;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 900;
}

.feature-desc {
    color: #e0e0e0;
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 90%;
}

.feature-footer {
    display: flex;
    justify-content: flex-start;
}

.btn-primary-white {
    background: #ffffff;
    color: #000000;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.btn-primary-white:hover {
    background: #e0e0e0;
    transform: scale(1.05);
}

/* =========================================
   🌟 5. การ์ดวิดีโอ (Video Card)
   ========================================= */
.card-video {
    /* 🌟 สั่งให้กินพื้นที่ช่องเดียว (Grid จะเอาไปเรียงเป็นแถวละ 2 ตัวทางฝั่งขวาให้อัตโนมัติ) */
    grid-column: span 1; 
    grid-row: span 1;
    aspect-ratio: 9 / 16;
}

.card-tag {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 6px;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.mute-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s;
}

.mute-btn:hover {
    background: rgba(204, 255, 0, 0.2);
    color: #ccff00;
    border-color: #ccff00;
}

.music-bar-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 16px 16px 16px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 1;
}

.creator-info { display: flex; flex-direction: column; }
.creator-name { color: #ffffff; font-weight: 800; font-size: 0.85rem; margin-bottom: 2px; }
.video-desc { color: #e0e0e0; font-size: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.music-ticker {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50px;
    padding: 4px 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
}

.music-icon { color: #ccff00; margin-right: 8px; font-size: 1rem; animation: spin 3s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.ticker-wrapper { flex: 1; overflow: hidden; white-space: nowrap; position: relative; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
.ticker-text { display: inline-block; color: #ffffff; font-size: 0.7rem; font-weight: 500; padding-left: 100%; animation: ticker 8s linear infinite; }
.ticker-text.paused { animation-play-state: paused; }
@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }

.equalizer { display: flex; align-items: flex-end; gap: 2px; height: 12px; margin-left: 8px; }
.equalizer .bar { width: 3px; background-color: #ccff00; border-radius: 2px; animation: bounce 0.5s ease infinite alternate; }
.equalizer.paused .bar { animation-play-state: paused; height: 3px !important; }
.equalizer .bar:nth-child(1) { height: 60%; animation-delay: 0.1s; }
.equalizer .bar:nth-child(2) { height: 100%; animation-delay: 0.3s; }
.equalizer .bar:nth-child(3) { height: 40%; animation-delay: 0s; }
.equalizer .bar:nth-child(4) { height: 80%; animation-delay: 0.2s; }
@keyframes bounce { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }

/* =========================================
   🌟 6. สถานะว่างเปล่า
   ========================================= */
.empty-state {
    grid-column: 1 / -1;
    width: 100%;
    padding: 60px 20px;
    text-align: center;
    color: #757575;
}
.empty-state i { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }

/* =========================================
   🌟 7. Responsive (สำหรับมือถือและแท็บเล็ต)
   ========================================= */
/* จอแล็ปท็อปขนาดเล็ก (ย่อลงมาให้เหลือ 1 รูปใหญ่ + 3 วิดีโอ เหมือนรูปต้นฉบับที่คุณส่งมา) */
@media (max-width: 1024px) {
    .gallery-grid {
        grid-template-columns: 1fr 1fr;
    }
    .card-feature {
        grid-column: 1 / -1; 
        grid-row: span 1;
        min-height: 480px;
    }
}

@media (max-width: 600px) {
    .gallery-grid {
        grid-template-columns: 1fr 1fr; /* 🌟 สำคัญ: คง 2 คอลัมน์ไว้เพื่อรักษาสัดส่วน 1:2 */
        gap: 12px; /* ลดช่องว่างลงนิดนึง จอเล็กจะได้ไม่ดูห่างไป */
    }
    .card-feature {
        grid-column: 1 / -1; /* 🌟 ย้ำให้รูปใหญ่กางเต็มแถวบนสุด */
        min-height: 380px; 
    }
    .card-video {
        grid-column: span 1; /* 🌟 วิดีโอจะแบ่งกันกินพื้นที่คนละ 1 คอลัมน์ (ซ้าย-ขวา) */
        width: 100%;
        margin: 0; /* ลบ margin: 0 auto เก่าทิ้ง เพื่อให้วิดีโอฟิตพอดีกับ Grid */
    }

    /* 💡 ออปชันเสริม: ย่อขนาด UI ด้านในวิดีโอลง เพราะพออยู่บนมือถือแบบ 2 คอลัมน์ การ์ดจะค่อนข้างเล็ก */
    .music-bar-overlay { padding: 24px 10px 10px 10px; gap: 4px; }
    .creator-name { font-size: 0.75rem; }
    .video-desc { font-size: 0.65rem; }
    .music-ticker { padding: 2px 6px; }
    .music-icon { font-size: 0.8rem; }
    .card-tag { font-size: 0.65rem; padding: 2px 8px; top: 10px; left: 10px; }
    .mute-btn { width: 28px; height: 28px; top: 10px; right: 10px; }
    .mute-btn i { font-size: 16px; }
}
</style>