export type CategoryId = string;
export type BudgetPeriod = 'monthly' | 'weekly';
export type TransactionSource = 'manual' | 'ocr' | 'import' | 'sms';
export type OcrFormat = 'ofx' | 'csv' | 'pdf' | 'xlsx';
export type TrendDirection = 'up' | 'down' | 'stable';
export type InsightType = 'over_budget' | 'unusual_spend' | 'savings_opportunity';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  category: CategoryId;
  date: string; // ISO 8601
  source: TransactionSource;
  merchantName?: string;
  receiptId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  budgetLimit?: number; // monthly default
}

export interface Budget {
  id: string;
  period: BudgetPeriod;
  categoryLimits: Record<CategoryId, number>;
  startDate: string;
}

export interface OcrItem {
  description: string;
  amount: number;
  quantity?: number;
}

export interface OcrResult {
  rawText: string;
  confidence: number;
  items: OcrItem[];
  total: number;
  merchantName?: string;
  date?: string;
}

export interface ImportedStatement {
  source: OcrFormat;
  transactions: Transaction[];
  accountName?: string;
  importedAt: string;
}

export interface SpendCoachInsight {
  type: InsightType;
  message: string;
  categoryId?: CategoryId;
  amount?: number;
}

export interface ForecastResult {
  category: CategoryId;
  projectedSpend: number;
  confidence: number;
  trend: TrendDirection;
}
