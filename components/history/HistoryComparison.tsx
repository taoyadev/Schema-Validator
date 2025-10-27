'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HistoryItem } from '@/lib/history/storage';
import { diffEngine } from '@/lib/comparison/diff-engine';
import { ComparisonView } from '@/components/comparison/ComparisonView';
import { useMemo } from 'react';

interface HistoryComparisonProps {
  items: [HistoryItem, HistoryItem];
  onClose?: () => void;
}

export function HistoryComparison({ items, onClose }: HistoryComparisonProps) {
  const [item1, item2] = items;

  // Generate comprehensive comparison using diff engine
  const comparison = useMemo(() => {
    return diffEngine.compare(item1.result, item2.result);
  }, [item1, item2]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Validation Comparison</CardTitle>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Item 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Before</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item1.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium">{item1.url || 'Direct JSON-LD'}</p>
              <p className="text-xs text-muted-foreground">{item1.schemaType}</p>
              {item1.note ? (
                <p className="text-xs text-gray-600 italic">Note: {item1.note}</p>
              ) : null}
            </div>

            {/* Item 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">After</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item2.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium">{item2.url || 'Direct JSON-LD'}</p>
              <p className="text-xs text-muted-foreground">{item2.schemaType}</p>
              {item2.note ? (
                <p className="text-xs text-gray-600 italic">Note: {item2.note}</p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Comparison View */}
      <ComparisonView comparison={comparison} />
    </div>
  );
}
