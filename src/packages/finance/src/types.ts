export type CategoryId = string;
export type BudgetPeriod = "monthly" | "weekly";
export type TransactionSource = "manual" | "ocr" | "import" | "sms";
export type OcrFormat = "ofx" | "csv" | "pdf" | "xlsx";
export type TrendDirection = "up" | "down" | "stable";
export type CategorizationSource = "history" | "keyword" | "core" | "none";
export type ReceiptJobStatus =
  | "captured"
  | "pending_sync"
  | "uploading"
  | "queued"
  | "running"
  | "waiting_for_model"
  | "corrupt"
  | "needs_review"
  | "completed"
  | "failed"
  | "saved";

export interface ReceiptFieldEvidence {
  sourceLines: string[];
  extractedValue: string;
  confidence: number;
  reason: string;
}

export interface ReceiptFieldSuggestions {
  merchant: string[];
  amount: string[];
  date: string[];
  category: string[];
}
export type InsightType =
  | "over_budget"
  | "unusual_spend"
  | "savings_opportunity";

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

export interface CategorizationHistoryEntry {
  description: string;
  merchantName?: string;
  category: CategoryId;
  updatedAt: string;
}

export interface CategorizationResult {
  categoryId: CategoryId;
  source: CategorizationSource;
  matchedLabel?: string;
  confidence?: number;
}

export interface FinanceContextSyncPayload {
  categories: Category[];
  history: CategorizationHistoryEntry[];
  syncedAt: string;
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

export interface ReceiptCaptureQuality {
  accepted: boolean;
  score: number;
  issues: string[];
  width?: number;
  height?: number;
  fileSize?: number;
}

export interface ReceiptFieldConfidence {
  amount: number;
  merchant: number;
  category: number;
  date?: number;
  imageQuality?: number;
}

export interface ReceiptProcessingTrace {
  ocrTrace?: Record<string, unknown>;
  qwenFallback?: Record<string, unknown>;
  stageTimings?: Record<string, number>;
}

export interface ReceiptCapture {
  receiptId: string;
  deviceId: string;
  imageUri: string;
  mimeType: string;
  capturedAt: string;
  updatedAt: string;
  status: ReceiptJobStatus;
  retryCount: number;
  captureQuality: ReceiptCaptureQuality;
  lastError?: string;
}

export interface ReceiptJob {
  receiptId: string;
  deviceId: string;
  status: ReceiptJobStatus;
  capturedAt: string;
  updatedAt: string;
  retryCount: number;
  mimeType: string;
  imageUri?: string;
  imageBase64?: string;
  captureQuality: ReceiptCaptureQuality;
  total?: number;
  merchant?: string;
  merchantName?: string;
  description?: string;
  date?: string;
  categoryId?: CategoryId;
  reviewReason?: string;
  reviewFields?: string[];
  readinessScore?: number;
  fieldConfidence?: ReceiptFieldConfidence;
  fieldEvidence?: {
    merchant?: ReceiptFieldEvidence;
    amount?: ReceiptFieldEvidence;
    date?: ReceiptFieldEvidence;
    category?: ReceiptFieldEvidence;
  };
  fieldSuggestions?: ReceiptFieldSuggestions;
  processingTrace?: ReceiptProcessingTrace;
  rawText?: string;
  error?: string;
}

export interface OcrResult {
  rawText: string;
  confidence: number;
  items: OcrItem[];
  total: number;
  merchant?: string;
  merchantName?: string;
  date?: string;
  description?: string;
  categoryId?: CategoryId;
  reviewReason?: string;
  reviewFields?: string[];
  status?: ReceiptJobStatus;
  readinessScore?: number;
  fieldConfidence?: ReceiptFieldConfidence;
  fieldEvidence?: {
    merchant?: ReceiptFieldEvidence;
    amount?: ReceiptFieldEvidence;
    date?: ReceiptFieldEvidence;
    category?: ReceiptFieldEvidence;
  };
  fieldSuggestions?: ReceiptFieldSuggestions;
  processingTrace?: ReceiptProcessingTrace;
  stageTimings?: Record<string, number>;
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
