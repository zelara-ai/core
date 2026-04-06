import { Transaction, CategoryId, ForecastResult, TrendDirection } from './types';

interface Point {
  x: number;
  y: number;
}

export class ForecastEngine {
  linearRegression(points: Point[]): { slope: number; intercept: number } {
    const n = points.length;
    if (n === 0) return { slope: 0, intercept: 0 };

    const sumX  = points.reduce((s, p) => s + p.x, 0);
    const sumY  = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);

    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) return { slope: 0, intercept: sumY / n };

    const slope     = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }

  forecast(
    transactions: Transaction[],
    category: CategoryId,
    months: number
  ): ForecastResult {
    const monthlySpend = new Map<number, number>();
    for (const tx of transactions) {
      if (tx.category !== category) continue;
      const d = new Date(tx.date);
      const key = d.getFullYear() * 12 + d.getMonth();
      monthlySpend.set(key, (monthlySpend.get(key) ?? 0) + tx.amount);
    }

    const sortedKeys = Array.from(monthlySpend.keys()).sort((a, b) => a - b);
    const points: Point[] = sortedKeys.map((key, i) => ({
      x: i,
      y: monthlySpend.get(key) ?? 0,
    }));

    const { slope, intercept } = this.linearRegression(points);
    const nextX = points.length + months - 1;
    const projectedSpend = Math.max(0, slope * nextX + intercept);

    const trend: TrendDirection = slope > 5 ? 'up' : slope < -5 ? 'down' : 'stable';
    const confidence = Math.min(0.95, 0.3 + points.length * 0.07);

    return { category, projectedSpend, confidence, trend };
  }
}
