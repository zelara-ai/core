import { Transaction, Category, Budget, CategoryId } from './types';

export abstract class FinanceRepository {
  abstract addTransaction(
    tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction>;

  abstract getTransactions(filters?: {
    from?: string;
    to?: string;
    category?: CategoryId;
    source?: string;
  }): Promise<Transaction[]>;

  abstract updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction>;

  abstract deleteTransaction(id: string): Promise<void>;

  abstract getCategories(): Promise<Category[]>;

  abstract addCategory(category: Omit<Category, 'id'>): Promise<Category>;

  abstract getBudgets(): Promise<Budget[]>;

  abstract saveBudget(budget: Omit<Budget, 'id'>): Promise<Budget>;
}
