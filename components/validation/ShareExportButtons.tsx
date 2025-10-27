'use client';

import { useState } from 'react';
import type { ValidationResponse } from '@/lib/validation/types';

interface ShareExportButtonsProps {
  results: ValidationResponse;
}

export function ShareExportButtons({ results }: ShareExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareTwitter = () => {
    const text = `Validated my Schema.org markup with Schema Validator - Score: ${results.overallScore}/100`;
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleShareLinkedIn = () => {
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `schema-validation-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportReport = () => {
    // Generate a simple HTML report
    const reportHtml = generateHtmlReport(results);
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = `schema-validation-report-${new Date().toISOString().split('T')[0]}.html`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Share Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </>
          )}
        </button>

        <button
          onClick={handleShareTwitter}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Twitter
        </button>

        <button
          onClick={handleShareLinkedIn}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export JSON
        </button>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Report
        </button>
      </div>
    </div>
  );
}

function generateHtmlReport(results: ValidationResponse): string {
  const { overallScore, schemas, summary, timestamp, url } = results;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schema Validation Report - ${new Date(timestamp).toLocaleDateString()}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1e293b;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
    }
    .score {
      font-size: 48px;
      font-weight: bold;
      color: ${overallScore >= 80 ? '#16a34a' : overallScore >= 60 ? '#eab308' : '#dc2626'};
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      padding: 20px;
      border-radius: 8px;
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
    }
    .schema-card {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fafafa;
    }
    .error { color: #dc2626; }
    .warning { color: #eab308; }
    .success { color: #16a34a; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin: 4px;
    }
    .badge-error { background: #fee2e2; color: #dc2626; }
    .badge-warning { background: #fef3c7; color: #eab308; }
    .badge-success { background: #dcfce7; color: #16a34a; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Schema Validation Report</h1>
    ${url ? `<p><strong>URL:</strong> ${url}</p>` : ''}
    <p><strong>Generated:</strong> ${new Date(timestamp).toLocaleString()}</p>

    <div style="text-align: center; margin: 40px 0;">
      <div class="score">${overallScore}/100</div>
      <p style="font-size: 18px; color: #64748b;">Overall Validation Score</p>
    </div>

    <div class="summary">
      <div class="stat-card">
        <h3>Schemas Found</h3>
        <p style="font-size: 32px; font-weight: bold;">${schemas.length}</p>
      </div>
      <div class="stat-card">
        <h3>Rich Results Eligible</h3>
        <p style="font-size: 32px; font-weight: bold;">${schemas.filter(s => s.richResultsEligible).length}</p>
      </div>
      <div class="stat-card">
        <h3>Total Issues</h3>
        <p style="font-size: 32px; font-weight: bold;">${summary.totalErrors + summary.totalWarnings}</p>
      </div>
    </div>

    ${schemas.map((schema, index) => `
      <div class="schema-card">
        <h2>Schema #${index + 1}: ${schema.schema.type}</h2>
        <div>
          <span class="badge badge-${schema.richResultsEligible ? 'success' : 'warning'}">
            ${schema.richResultsEligible ? 'Rich Results Eligible' : 'Not Eligible'}
          </span>
          <span class="badge badge-success">${schema.passed.length} Passed</span>
          ${schema.errors.length > 0 ? `<span class="badge badge-error">${schema.errors.length} Errors</span>` : ''}
          ${schema.warnings.length > 0 ? `<span class="badge badge-warning">${schema.warnings.length} Warnings</span>` : ''}
        </div>

        ${schema.errors.length > 0 ? `
          <h3 class="error">Errors</h3>
          <ul>
            ${schema.errors.map(e => `<li><strong>${e.property}:</strong> ${e.message}</li>`).join('')}
          </ul>
        ` : ''}

        ${schema.warnings.length > 0 ? `
          <h3 class="warning">Warnings</h3>
          <ul>
            ${schema.warnings.map(w => `<li><strong>${w.property}:</strong> ${w.message}</li>`).join('')}
          </ul>
        ` : ''}

        ${schema.passed.length > 0 ? `
          <h3 class="success">Passed Checks</h3>
          <ul>
            ${schema.passed.map(p => `<li><strong>${p.property}:</strong> ${p.message}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}

    <footer style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b;">
      <p>Generated by <a href="https://www.schemavalidator.com" style="color: #3b82f6;">Schema Validator</a></p>
    </footer>
  </div>
</body>
</html>`;
}
