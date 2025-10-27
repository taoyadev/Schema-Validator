'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  searchHistory,
  exportHistory,
  importHistory,
  getHistoryStats,
  updateHistoryNote,
  type HistoryItem,
} from '@/lib/history/storage';

interface HistoryListProps {
  onSelect?: (item: HistoryItem) => void;
  onCompare?: (items: [HistoryItem, HistoryItem]) => void;
}

export function HistoryList({ onSelect, onCompare }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = searchQuery ? searchHistory(searchQuery) : getHistory();
    setHistory(data);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const data = query ? searchHistory(query) : getHistory();
    setHistory(data);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this history item?')) {
      deleteHistoryItem(id);
      loadHistory();
      setSelectedItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      setHistory([]);
      setSelectedItems(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        // Limit to 2 items for comparison
        if (next.size >= 2) {
          const firstId = Array.from(next)[0];
          next.delete(firstId);
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleCompare = () => {
    if (selectedItems.size !== 2) return;

    const items = Array.from(selectedItems)
      .map((id) => history.find((item) => item.id === id))
      .filter((item): item is HistoryItem => item !== undefined);

    if (items.length === 2 && onCompare) {
      onCompare([items[0], items[1]]);
    }
  };

  const handleExport = () => {
    const json = exportHistory();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validation-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const count = importHistory(json);
        alert(`Successfully imported ${count} new items`);
        loadHistory();
      } catch (_error) {
        alert('Failed to import history file');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveNote = (id: string) => {
    updateHistoryNote(id, noteText);
    setEditingNote(null);
    setNoteText('');
    loadHistory();
  };

  const handleStartEditNote = (item: HistoryItem) => {
    setEditingNote(item.id);
    setNoteText(item.note || '');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = showStats ? getHistoryStats() : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Validation History</CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
              <button
                onClick={handleExport}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                disabled={history.length === 0}
              >
                Export
              </button>
              <label className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
                disabled={history.length === 0}
              >
                Clear All
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div>
            <Input
              type="text"
              placeholder="Search by URL, schema type, or note..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Stats */}
          {showStats && stats && (
            <div className="grid gap-4 md:grid-cols-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Validations</p>
                <p className="text-2xl font-bold">{stats.totalValidations}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Schema Types</p>
                <p className="text-2xl font-bold">{Object.keys(stats.schemaTypes).length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">
                  {stats.recentActivity.reduce((sum, day) => sum + day.count, 0)}
                </p>
              </div>
            </div>
          )}

          {/* Compare Button */}
          {selectedItems.size === 2 && onCompare && (
            <div>
              <Button onClick={handleCompare} className="w-full">
                Compare Selected ({selectedItems.size})
              </Button>
            </div>
          )}

          {/* History Items */}
          {history.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchQuery
                  ? 'No results found for your search.'
                  : 'No validation history yet. Validate some schemas to see them here.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 transition-all ${
                    selectedItems.has(item.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {onCompare && (
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleToggleSelect(item.id)}
                            className="w-4 h-4"
                          />
                        )}
                        <h3 className="font-medium text-sm">
                          {item.url || 'Direct JSON-LD'}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.schemaType}
                        </Badge>
                        <span className={`font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>

                      {/* Note */}
                      {editingNote === item.id ? (
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add a note..."
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveNote(item.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNote(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          {item.note ? (
                            <p className="text-sm text-gray-600 italic">
                              Note: {item.note}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleStartEditNote(item)}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        {item.note ? 'Edit Note' : 'Add Note'}
                      </button>
                      {onSelect && (
                        <button
                          onClick={() => onSelect(item)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          View
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
