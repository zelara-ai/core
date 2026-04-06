export const SCHEMA_VERSION = 1;

export const CREATE_TRANSACTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'uncategorized',
    date TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'manual',
    merchant_name TEXT,
    receipt_id TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

export const CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '#888888',
    budget_limit REAL
  )
`;

export const CREATE_BUDGETS_TABLE = `
  CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    period TEXT NOT NULL DEFAULT 'monthly',
    category_limits TEXT NOT NULL DEFAULT '{}',
    start_date TEXT NOT NULL
  )
`;

export const DEFAULT_CATEGORIES: Array<{ id: string; name: string; icon: string; color: string }> = [
  { id: 'groceries',     name: 'Groceries',     icon: '🛒', color: '#27ae60' },
  { id: 'dining',        name: 'Dining',        icon: '🍽️', color: '#e67e22' },
  { id: 'transport',     name: 'Transport',     icon: '🚗', color: '#3498db' },
  { id: 'utilities',     name: 'Utilities',     icon: '💡', color: '#f39c12' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#9b59b6' },
  { id: 'health',        name: 'Health',        icon: '🏥', color: '#e74c3c' },
  { id: 'shopping',      name: 'Shopping',      icon: '🛍️', color: '#1abc9c' },
  { id: 'uncategorized', name: 'Uncategorized', icon: '📦', color: '#95a5a6' },
];
