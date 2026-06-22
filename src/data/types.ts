export interface ItemStats {
  attack?: number;
  defense?: number;
  heals?: number;
  restoresMana?: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  icon: string;
  quantity: number;
  maxStack: number;
  value: number;
  stats?: ItemStats;
  equipped?: boolean;
}

export interface Objective {
  id: string;
  text: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: Objective[];
  rewardXp: number;
  rewardGold: number;
  rewardItemName?: string;
  rewardItemIcon?: string;
  status: string;
  completed?: boolean; 
}