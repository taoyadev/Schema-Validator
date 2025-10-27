'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ValidationResult } from '@/lib/validation/types';

interface PropertyTreeViewProps {
  result: ValidationResult;
}

export function PropertyTreeView({ result }: PropertyTreeViewProps) {
  const [expandAll, setExpandAll] = useState(false);

  const handleToggleAll = () => {
    setExpandAll(!expandAll);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Schema Properties</CardTitle>
          <button
            onClick={handleToggleAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <PropertyNode
            name="@context"
            value={result.schema.context}
            depth={0}
            forceExpanded={expandAll}
            isRequired={true}
            isPresent={true}
          />
          <PropertyNode
            name="@type"
            value={result.schema.type}
            depth={0}
            forceExpanded={expandAll}
            isRequired={true}
            isPresent={true}
          />
          {Object.entries(result.schema.properties).map(([key, value]) => {
            // Determine if property is required or optional based on validation results
            const isError = result.errors.some(e => e.property === key);
            const isWarning = result.warnings.some(w => w.property === key);
            const isPassed = result.passed.some(p => p.property === key);

            return (
              <PropertyNode
                key={key}
                name={key}
                value={value}
                depth={0}
                forceExpanded={expandAll}
                isRequired={isError}
                isOptional={isWarning}
                isPresent={isPassed || (value !== undefined && value !== null)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface PropertyNodeProps {
  name: string;
  value: unknown;
  depth: number;
  forceExpanded?: boolean;
  isRequired?: boolean;
  isOptional?: boolean;
  isPresent?: boolean;
}

function PropertyNode({
  name,
  value,
  depth,
  forceExpanded = false,
  isRequired = false,
  isOptional = false,
  isPresent = false
}: PropertyNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const expanded = forceExpanded || isExpanded;
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const hasChildren = isObject || isArray;

  const getValueType = (val: unknown): string => {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const getStatusColor = () => {
    if (isRequired && !isPresent) return 'text-red-600 bg-red-50 border-red-200';
    if (isRequired && isPresent) return 'text-green-600 bg-green-50 border-green-200';
    if (isOptional) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getStatusBadge = () => {
    if (isRequired && !isPresent) return <Badge variant="destructive" className="text-xs">Required - Missing</Badge>;
    if (isRequired && isPresent) return <Badge variant="success" className="text-xs">Required - Present</Badge>;
    if (isOptional) return <Badge variant="warning" className="text-xs">Recommended</Badge>;
    return <Badge variant="secondary" className="text-xs">Optional</Badge>;
  };

  const renderValue = (val: unknown): string => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'boolean') return val.toString();
    if (typeof val === 'number') return val.toString();
    if (Array.isArray(val)) return `Array(${val.length})`;
    if (typeof val === 'object') return 'Object';
    return String(val);
  };

  return (
    <div className="group">
      <div
        className={`flex items-start gap-2 py-2 px-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${getStatusColor()}`}
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <span className="flex-shrink-0 mt-0.5">
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
        {!hasChildren && <span className="w-4 flex-shrink-0"></span>}

        {/* Property Name */}
        <span className="font-mono text-sm font-medium flex-shrink-0">{name}:</span>

        {/* Value or Type */}
        <span className="font-mono text-sm flex-1 truncate">
          {hasChildren ? (
            <span className="text-gray-500">
              {isArray ? `Array(${(value as unknown[]).length})` : 'Object'}
            </span>
          ) : (
            renderValue(value)
          )}
        </span>

        {/* Type Badge */}
        <Badge variant="outline" className="text-xs flex-shrink-0">
          {getValueType(value)}
        </Badge>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          {getStatusBadge()}
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-1">
          {isArray ? (
            (value as unknown[]).map((item, index) => (
              <PropertyNode
                key={index}
                name={`[${index}]`}
                value={item}
                depth={depth + 1}
                forceExpanded={forceExpanded}
              />
            ))
          ) : (
            Object.entries(value as Record<string, unknown>).map(([key, val]) => (
              <PropertyNode
                key={key}
                name={key}
                value={val}
                depth={depth + 1}
                forceExpanded={forceExpanded}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
