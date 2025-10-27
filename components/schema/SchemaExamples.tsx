'use client';

import { useState } from 'react';
import { SchemaExample } from '@/lib/seo/examples';

export interface SchemaExamplesProps {
  examples: SchemaExample[];
}

export function SchemaExamples({ examples }: SchemaExamplesProps) {
  const [selectedExample, setSelectedExample] = useState(0);

  if (examples.length === 0) {
    return null;
  }

  const example = examples[selectedExample];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b bg-gray-50 px-6 py-4">
        <h3 className="text-xl font-semibold text-gray-900">Code Examples</h3>
        <p className="text-sm text-gray-600 mt-1">
          Learn from valid and invalid schema implementations
        </p>
      </div>

      {/* Example Tabs */}
      {examples.length > 1 && (
        <div className="border-b bg-gray-50 px-6">
          <div className="flex space-x-2 overflow-x-auto">
            {examples.map((ex, index) => (
              <button
                key={index}
                onClick={() => setSelectedExample(index)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  selectedExample === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Example Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {example.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{example.description}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              example.valid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {example.valid ? 'Valid' : 'Invalid'}
          </span>
        </div>

        {/* Code Block */}
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm">{example.code}</code>
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(example.code);
            }}
            className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
            title="Copy to clipboard"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
