/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Item, Quest } from './types';

// ==========================================
// 🎒 อุปกรณ์เริ่มต้น (Starter Items)
// ==========================================
export const STARTER_ITEMS: Item[] = [
  {
    id: 'aluminium-powder',
    name: 'ผงอลูมิเนียม (Aluminium Powder)',
    description: 'ผงโลหะน้ำหนักเบา ใช้สำหรับผสมทำอะไหล่',
    type: 'resource',
    rarity: 'common',
    icon: 'powder_Aluminium.png', // 👈 เปลี่ยนเป็นชื่อไฟล์รูปของพี่ตรงนี้
    quantity: 1,
    maxStack: 99,
    value: 15,
    equipped: false,
  },
  // {
  //   id: 'old-multi-wrench',
  //   name: 'ประแจอเนกประสงค์รุ่นเก่า',
  //   description: 'ประแจเหล็กที่เต็มไปด้วยคราบน้ำมันและสนิม แต่ยังมีแรงขันที่ทรงพลัง +5 กำลังเจาะทำลาย',
  //   type: 'weapon',
  //   rarity: 'common',
  //   icon: 'Sword', // ใช้ชื่อ Icon เดิมเพื่อให้ฟังก์ชัน getItemGlyph โหลดรูป ⚔️ ได้
  //   quantity: 1,
  //   maxStack: 1,
  //   value: 15,
  //   stats: { attack: 5 },
  //   equipped: true,
  // },
  // {
  //   id: 'worn-safety-vest',
  //   name: 'ชุดนิรภัยกันกระแทก',
  //   description: 'ชุดเกราะอ่อนสำหรับวิศวกรฝึกหัด ป้องกันสะเก็ดไฟและแรงกระแทกเบื้องต้น +3 ความทนทาน',
  //   type: 'armor',
  //   rarity: 'common',
  //   icon: 'ShieldAlert',
  //   quantity: 1,
  //   maxStack: 1,
  //   value: 20,
  //   stats: { defense: 3 },
  //   equipped: true,
  // },
  // {
  //   id: 'structural-repair-gel',
  //   name: 'เจลซ่อมแซมโครงสร้าง',
  //   description: 'หลอดเจลนาโนสีแดงระเรื่อ ฟื้นฟูสภาพโครงสร้าง (Integrity) ทันที 30 หน่วย',
  //   type: 'consumable',
  //   rarity: 'common',
  //   icon: 'Sparkles',
  //   quantity: 3,
  //   maxStack: 10,
  //   value: 8,
  //   stats: { heals: 30 },
  // },
  // {
  //   id: 'micro-power-cell',
  //   name: 'เซลล์พลังงานสำรองขนาดเล็ก',
  //   description: 'แบตเตอรี่พกพาที่อัดแน่นด้วยประจุไฟฟ้า ฟื้นฟูพลังงานระบบ (Power) ทันที 40 หน่วย',
  //   type: 'consumable',
  //   rarity: 'uncommon',
  //   icon: 'Droplet',
  //   quantity: 2,
  //   maxStack: 10,
  //   value: 12,
  //   stats: { restoresMana: 40 },
  // },
  // {
  //   id: 'encrypted-data-chip',
  //   name: 'ชิปข้อมูลเข้ารหัสยุคเก่า',
  //   description: 'แผงวงจรทองเหลืองที่บันทึกพาสเวิร์ดโบราณไว้ มีมูลค่าสูงมากในตลาดมืดไซเบอร์',
  //   type: 'resource',
  //   rarity: 'rare',
  //   icon: 'Coins',
  //   quantity: 1,
  //   maxStack: 100,
  //   value: 50,
  // }
];

// ==========================================
// 🌲 คลังไอเทมดรอปจากการสำรวจ (Loot Pool)
// ==========================================
export const POOL_EXPLORE_ITEMS: Omit<Item, 'id'>[] = [
  {
    name: 'แผงวงจรย่อย (Micro Circuit)',
    description: 'ชิ้นส่วนวงจรสีเขียวที่ดึงมาจากเศษซากโดรน ใช้สำหรับซ่อมแซมระบบเบื้องต้น',
    type: 'resource',
    rarity: 'common',
    icon: 'Leaf',
    quantity: 1,
    maxStack: 20,
    value: 3,
  },
  {
    name: 'แท่งไทเทเนียมผสม (Titanium Scrap)',
    description: 'เศษโลหะทนความร้อนสูง หนักแต่มีราคา สามารถนำไปหลอมเป็นเกราะได้',
    type: 'resource',
    rarity: 'common',
    icon: 'Hammer',
    quantity: 1,
    maxStack: 10,
    value: 6,
  },
  {
    name: 'แกนระบายความร้อน (Thermal Core)',
    description: 'กระบอกคูลแลนท์ที่ยังเรืองแสงสีส้มอ่อนๆ แผ่ความร้อนออกมาจางๆ',
    type: 'resource',
    rarity: 'rare',
    icon: 'Flame',
    quantity: 1,
    maxStack: 10,
    value: 25,
  },
  {
    name: 'เครื่องตัดพลาสม่าพกพา (Plasma Cutter)',
    description: 'เครื่องมือตัดแร่ที่ถูกดัดแปลงให้มีพลังทำลายล้างสูง น้ำหนักเบาและแม่นยำ +12 กำลังเจาะทำลาย',
    type: 'weapon',
    rarity: 'epic',
    icon: 'Wand2',
    quantity: 1,
    maxStack: 1,
    value: 150,
    stats: { attack: 12 },
  },
  {
    name: 'เกราะสนามพลังพกพา (Energy Deflector)',
    description: 'โมดูลาร์ชิลด์ที่สร้างม่านแม่เหล็กไฟฟ้าป้องกันวัตถุทางกายภาพ +8 ความทนทาน',
    type: 'armor',
    rarity: 'epic',
    icon: 'Shield',
    quantity: 1,
    maxStack: 1,
    value: 120,
    stats: { defense: 8 },
  },
  {
    name: 'ใบพัดไมโครโดรน (Drone Propeller)',
    description: 'ใบพัดโปร่งใสผลิตจากคาร์บอนไฟเบอร์ ใช้ประกอบเครื่องจักรขนาดจิ๋ว',
    type: 'resource',
    rarity: 'uncommon',
    icon: 'Grape',
    quantity: 1,
    maxStack: 20,
    value: 10,
  },
  {
    name: 'แกนพลังงานหลัก (Main Reactor Core)',
    description: 'แหล่งพลังงานควอนตัมหายากที่พบได้เฉพาะในห้องเมนเฟรมระดับลึกที่สุดเท่านั้น',
    type: 'quest',
    rarity: 'legendary',
    icon: 'Gem',
    quantity: 1,
    maxStack: 1,
    value: 500,
  }
];

// ==========================================
// 📋 ภารกิจเริ่มต้น (Initial Quests)
// ==========================================
export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-components',
    title: 'รวบรวมอะไหล่ซ่อมบำรุง',
    description: 'หัวหน้าศูนย์ควบคุมต้องการแผงวงจรย่อยด่วน เพื่อนำไปซ่อมระบบหล่อเย็นที่กำลังจะโอเวอร์โหลด',
    objectives: [
      {
        id: 'obj-gather-circuits',
        text: 'ค้นหาแผงวงจรย่อย (Micro Circuit)',
        current: 0,
        target: 3,
        completed: false,
      }
    ],
    rewardXp: 80,
    rewardGold: 40,
    rewardItemName: 'เจลซ่อมแซมโครงสร้าง', // *ต้องตรงกับชื่อในไอเทมเพื่อแอดเข้ากระเป๋า
    rewardItemIcon: 'Sparkles',
    status: 'active',
  },
  {
    id: 'quest-mainframe',
    title: 'กู้คืนระบบเมนเฟรม',
    description: 'สแกนพื้นที่ศูนย์เซิร์ฟเวอร์ร้าง เพื่อค้นหาแกนพลังงานหลักที่หายไป และนำมาจ่ายไฟให้สถานีอีกครั้ง',
    objectives: [
      {
        id: 'obj-explore-ruins',
        text: 'สแกนพื้นที่เซิร์ฟเวอร์ร้าง',
        current: 0,
        target: 1,
        completed: false,
      },
      {
        id: 'obj-find-reactor',
        text: 'ค้นพบแกนพลังงานหลัก (Reactor Core)',
        current: 0,
        target: 1,
        completed: false,
      }
    ],
    rewardXp: 200,
    rewardGold: 150,
    rewardItemName: 'เกราะสนามพลังพกพา (Energy Deflector)',
    rewardItemIcon: 'Shield',
    status: 'active',
  },
  {
    id: 'quest-rogue-ai',
    title: 'กำจัดระบบป้องกันที่คลุ้มคลั่ง',
    description: 'หุ่นยนต์รักษาความปลอดภัย (Security Mech) เกิดข้อผิดพลาดและกำลังบล็อกเส้นทางท่อส่งพลังงานหลัก ทำลายมันเพื่อเปิดทาง',
    objectives: [
      {
        id: 'obj-defeat-mech',
        text: 'ทำลายหุ่นยนต์ Security Mech',
        current: 0,
        target: 1,
        completed: false,
      }
    ],
    rewardXp: 150,
    rewardGold: 100,
    rewardItemName: 'เครื่องตัดพลาสม่าพกพา (Plasma Cutter)',
    rewardItemIcon: 'Wand2',
    status: 'active',
  }
];