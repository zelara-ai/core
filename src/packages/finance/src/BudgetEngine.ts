import { Transaction, Budget, CategoryId, BudgetPeriod, SpendCoachInsight } from './types';

export class BudgetEngine {
  calculateSpend(
    transactions: Transaction[],
    period: BudgetPeriod
  ): Record<CategoryId, number> {
    const now = new Date();
    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (period === 'monthly') {
        return (
          txDate.getFullYear() === now.getFullYear() &&
          txDate.getMonth() === now.getMonth()
        );
      }
      // weekly: last 7 days
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txDate >= weekAgo;
    });

    return filtered.reduce<Record<CategoryId, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
      return acc;
    }, {});
  }

  checkBudgetStatus(
    spend: Record<CategoryId, number>,
    budget: Budget
  ): SpendCoachInsight[] {
    const insights: SpendCoachInsight[] = [];
    for (const [categoryId, limit] of Object.entries(budget.categoryLimits)) {
      const actual = spend[categoryId] ?? 0;
      if (actual > limit) {
        insights.push({
          type: 'over_budget',
          message: `You've exceeded your ${categoryId} budget by $${(actual - limit).toFixed(2)}`,
          categoryId,
          amount: actual - limit,
        });
      } else if (actual > limit * 0.9) {
        insights.push({
          type: 'unusual_spend',
          message: `You're close to your ${categoryId} budget (${Math.round((actual / limit) * 100)}% used)`,
          categoryId,
          amount: actual,
        });
      }
    }
    return insights;
  }

  getOverBudgetCategories(
    spend: Record<CategoryId, number>,
    budget: Budget
  ): CategoryId[] {
    return Object.entries(budget.categoryLimits)
      .filter(([categoryId, limit]) => (spend[categoryId] ?? 0) > limit)
      .map(([categoryId]) => categoryId);
  }
}
