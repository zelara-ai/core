import { CategoryId, CategorizationHistoryEntry, CategorizationResult } from "./types";
import { CategorizationEngine } from "./CategorizationEngine";

const engine = new CategorizationEngine();

export type CategorizationInput = {
  amount: number;
  description: string;
  history?: CategorizationHistoryEntry[];
};

type HistoryCandidate = {
  categoryId: CategoryId;
  count: number;
  label: string;
  updatedAt: string;
};

export function categorizeTransaction({
  amount,
  description,
  history = [],
}: CategorizationInput): CategorizationResult {
  const normalizedDescription = normalizeForCategorization(description);
  if (!normalizedDescription) {
    return {
      categoryId: "uncategorized",
      source: "none",
    };
  }

  const historyLookup = buildHistoryLookup(history);
  const historyMatch = matchFromHistory(normalizedDescription, historyLookup);
  if (historyMatch) {
    return historyMatch;
  }

  const categoryId = engine.categorize(description, amount);
  if (categoryId !== "uncategorized") {
    return {
      categoryId,
      source: "keyword",
    };
  }

  return {
    categoryId: "uncategorized",
    source: "none",
  };
}

export function normalizeForCategorization(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return value
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function addHistoryCandidate(
  scores: Map<string, Map<CategoryId, HistoryCandidate>>,
  key: string,
  categoryId: CategoryId,
  label: string,
  updatedAt: string,
) {
  if (!key) {
    return;
  }

  if (!scores.has(key)) {
    scores.set(key, new Map());
  }

  const byCategory = scores.get(key);
  if (!byCategory) {
    return;
  }

  const existing = byCategory.get(categoryId);
  if (existing) {
    byCategory.set(categoryId, {
      ...existing,
      count: existing.count + 1,
      updatedAt: existing.updatedAt > updatedAt ? existing.updatedAt : updatedAt,
    });
    return;
  }

  byCategory.set(categoryId, {
    categoryId,
    count: 1,
    label,
    updatedAt,
  });
}

function buildHistoryLookup(history: CategorizationHistoryEntry[]) {
  const scores = new Map<string, Map<CategoryId, HistoryCandidate>>();

  for (const entry of history) {
    if (entry.category === "uncategorized") {
      continue;
    }

    const rawLabels = [entry.merchantName, entry.description].filter(
      (value): value is string => !!value?.trim(),
    );

    for (const rawLabel of rawLabels) {
      const normalized = normalizeForCategorization(rawLabel);
      if (!normalized) {
        continue;
      }

      addHistoryCandidate(
        scores,
        normalized,
        entry.category,
        rawLabel.trim(),
        entry.updatedAt,
      );

      for (const token of tokenize(normalized)) {
        addHistoryCandidate(
          scores,
          token,
          entry.category,
          rawLabel.trim(),
          entry.updatedAt,
        );
      }
    }
  }

  const lookup = new Map<string, { categoryId: CategoryId; matchedLabel: string }>();
  for (const [key, candidates] of scores.entries()) {
    const winner = [...candidates.values()].sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }
      return right.updatedAt.localeCompare(left.updatedAt);
    })[0];

    if (winner) {
      lookup.set(key, {
        categoryId: winner.categoryId,
        matchedLabel: winner.label,
      });
    }
  }

  return lookup;
}

function matchFromHistory(
  normalizedDescription: string,
  history: Map<string, { categoryId: CategoryId; matchedLabel: string }>,
): CategorizationResult | null {
  const exactMatch = history.get(normalizedDescription);
  if (exactMatch) {
    return {
      categoryId: exactMatch.categoryId,
      source: "history",
      matchedLabel: exactMatch.matchedLabel,
    };
  }

  const tokenMatch = tokenize(normalizedDescription)
    .sort((left, right) => right.length - left.length)
    .map((token) => history.get(token))
    .find(Boolean);

  if (!tokenMatch) {
    return null;
  }

  return {
    categoryId: tokenMatch.categoryId,
    source: "history",
    matchedLabel: tokenMatch.matchedLabel,
  };
}
