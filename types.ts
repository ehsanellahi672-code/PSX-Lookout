
export interface StockRecommendation {
  stock: string;
  tp: number | string;
  price?: number;
  upside?: number | string;
  sectorColor?: string;
}

export interface BrokerData {
  name: string;
  indexTarget: string;
  recommendations: StockRecommendation[];
}

export interface MarketInsight {
  topic: string;
  description: string;
  sentiment: 'bullish' | 'neutral' | 'bearish';
}

export type SignalType = 'long' | 'moderate' | 'swing';

export interface StockSignal {
  id: string;
  symbol: string;
  buyingRange: string;
  tp1: number;
  tp2: number;
  sl: number;
  type: SignalType;
  timestamp: number;
}
