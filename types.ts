export enum AppStage {
  ONBOARDING = 'ONBOARDING',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  CALCULATING = 'CALCULATING',
  DASHBOARD = 'DASHBOARD',
  LEAD_CAPTURE = 'LEAD_CAPTURE',
}

export enum HeatingType {
  ELECTRIC = 'Electrique',
  GAS = 'Gaz',
  OIL = 'Fioul',
  WOOD = 'Bois',
}

export interface UserData {
  ownerStatus: 'owner' | 'tenant' | null;
  heatingType: HeatingType | null;
  monthlyBill: number;
  postalCode: string;
}

export interface ChartDataPoint {
  year: string;
  current: number;
  optimized: number;
}

export interface SimulationResult {
  energyScore: number;
  wasteScore: number;
  projectedSavings: number;
  roiYears: number;
  aidAmount: number;
  autonomyScore: number;
  analysisShort: string;
  analysisLong: string;
  chartData: ChartDataPoint[];
}