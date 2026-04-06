import { CategoryId } from './types';

const KEYWORD_MAP: Record<string, string[]> = {
  groceries:     ['grocery', 'supermarket', 'whole foods', 'trader joe', 'safeway', 'kroger', 'aldi', 'lidl'],
  dining:        ['restaurant', 'cafe', 'coffee', 'mcdonald', 'starbucks', 'pizza', 'burger', 'sushi', 'doordash', 'uber eats'],
  transport:     ['uber', 'lyft', 'taxi', 'gas station', 'fuel', 'parking', 'transit', 'metro', 'shell', 'bp', 'chevron'],
  utilities:     ['electric', 'water bill', 'gas bill', 'internet', 'broadband', 'at&t', 'verizon', 't-mobile'],
  entertainment: ['netflix', 'spotify', 'cinema', 'theater', 'concert', 'amazon prime', 'disney', 'hulu', 'gaming'],
  health:        ['pharmacy', 'doctor', 'hospital', 'dental', 'gym', 'cvs', 'walgreens'],
  shopping:      ['amazon', 'walmart', 'target', 'ebay', 'etsy', 'best buy', 'apple store'],
};

export class CategorizationEngine {
  categorize(description: string, _amount: number): CategoryId {
    const lower = description.toLowerCase();
    for (const [categoryId, keywords] of Object.entries(KEYWORD_MAP)) {
      if (keywords.some((kw) => lower.includes(kw))) {
        return categoryId;
      }
    }
    return 'uncategorized';
  }
}
