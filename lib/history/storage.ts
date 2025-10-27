/**
 * Validation History Storage
 * LocalStorage-based persistence for validation results
 */

import type { ValidationResponse } from '@/lib/validation/types';

const STORAGE_KEY = 'schema-validator-history';
const MAX_HISTORY_ITEMS = 50;

export interface HistoryItem {
  id: string;
  timestamp: string;
  url?: string;
  schemaType: string;
  score: number;
  result: ValidationResponse;
  note?: string;
}

/**
 * Get all validation history
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const history: HistoryItem[] = JSON.parse(data);
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (_error) {
    console.error('Failed to load history:', _error);
    return [];
  }
}

/**
 * Save a validation result to history
 */
export function saveToHistory(result: ValidationResponse, note?: string): HistoryItem {
  const historyItem: HistoryItem = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    url: result.url,
    schemaType: result.schemas[0]?.schema.type || 'Unknown',
    score: result.overallScore,
    result,
    note,
  };

  const history = getHistory();
  const updatedHistory = [historyItem, ...history].slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (_error) {
    console.error('Failed to save to history:', _error);
    // If quota exceeded, try removing old items
    if (_error instanceof Error && _error.name === 'QuotaExceededError') {
      const reducedHistory = updatedHistory.slice(0, Math.floor(MAX_HISTORY_ITEMS / 2));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedHistory));
      } catch (retryError) {
        console.error('Failed to save even after cleanup:', retryError);
      }
    }
  }

  return historyItem;
}

/**
 * Get a single history item by ID
 */
export function getHistoryItem(id: string): HistoryItem | undefined {
  const history = getHistory();
  return history.find((item) => item.id === id);
}

/**
 * Delete a history item
 */
export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const updatedHistory = history.filter((item) => item.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (_error) {
    console.error('Failed to delete history item:', _error);
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_error) {
    console.error('Failed to clear history:', _error);
  }
}

/**
 * Update a history item's note
 */
export function updateHistoryNote(id: string, note: string): void {
  const history = getHistory();
  const updatedHistory = history.map((item) =>
    item.id === id ? { ...item, note } : item
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (_error) {
    console.error('Failed to update note:', _error);
  }
}

/**
 * Search history by URL or schema type
 */
export function searchHistory(query: string): HistoryItem[] {
  const history = getHistory();
  const lowerQuery = query.toLowerCase();

  return history.filter(
    (item) =>
      item.url?.toLowerCase().includes(lowerQuery) ||
      item.schemaType.toLowerCase().includes(lowerQuery) ||
      item.note?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get history statistics
 */
export function getHistoryStats(): {
  totalValidations: number;
  averageScore: number;
  schemaTypes: Record<string, number>;
  recentActivity: Array<{ date: string; count: number }>;
} {
  const history = getHistory();

  const totalValidations = history.length;
  const averageScore =
    history.length > 0
      ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
      : 0;

  const schemaTypes: Record<string, number> = {};
  history.forEach((item) => {
    schemaTypes[item.schemaType] = (schemaTypes[item.schemaType] || 0) + 1;
  });

  // Group by date for recent activity
  const recentActivity: Record<string, number> = {};
  history.forEach((item) => {
    const date = new Date(item.timestamp).toISOString().split('T')[0];
    recentActivity[date] = (recentActivity[date] || 0) + 1;
  });

  const recentActivityArray = Object.entries(recentActivity)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return {
    totalValidations,
    averageScore,
    schemaTypes,
    recentActivity: recentActivityArray,
  };
}

/**
 * Export history as JSON
 */
export function exportHistory(): string {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
}

/**
 * Import history from JSON
 */
export function importHistory(jsonData: string): number {
  try {
    const imported: HistoryItem[] = JSON.parse(jsonData);

    if (!Array.isArray(imported)) {
      throw new Error('Invalid history data format');
    }

    const existingHistory = getHistory();
    const existingIds = new Set(existingHistory.map((item) => item.id));

    // Merge without duplicates
    const newItems = imported.filter((item) => !existingIds.has(item.id));
    const mergedHistory = [...existingHistory, ...newItems]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedHistory));

    return newItems.length;
  } catch (_error) {
    console.error('Failed to import history:', _error);
    throw _error;
  }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  if (typeof window === 'undefined') {
    return { used: 0, total: 0, percentage: 0 };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY) || '';
    const used = new Blob([data]).size;
    const total = 5 * 1024 * 1024; // Approximate 5MB localStorage limit
    const percentage = Math.round((used / total) * 100);

    return { used, total, percentage };
  } catch (_error) {
    return { used: 0, total: 0, percentage: 0 };
  }
}
