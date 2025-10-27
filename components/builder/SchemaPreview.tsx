'use client';

import type { SchemaTemplate } from '@/lib/builder/templates';

interface SchemaPreviewProps {
  jsonLd: string;
  template: SchemaTemplate;
}

export function SchemaPreview({ jsonLd }: SchemaPreviewProps) {
  return (
    <div className="relative">
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-white whitespace-pre-wrap break-words">
          <code>{jsonLd}</code>
        </pre>
      </div>

      {/* Line Count Badge */}
      <div className="absolute top-2 right-2">
        <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
          {jsonLd.split('\n').length} lines
        </div>
      </div>
    </div>
  );
}
