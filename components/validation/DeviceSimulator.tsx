'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeviceSimulatorProps {
  children: React.ReactNode;
  onDeviceChange?: (device: 'mobile' | 'desktop') => void;
}

export function DeviceSimulator({ children, onDeviceChange }: DeviceSimulatorProps) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

  const handleDeviceChange = (newDevice: 'mobile' | 'desktop') => {
    setDevice(newDevice);
    onDeviceChange?.(newDevice);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Device Preview</CardTitle>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => handleDeviceChange('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                device === 'mobile'
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile
            </button>
            <button
              onClick={() => handleDeviceChange('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                device === 'desktop'
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Desktop
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-start min-h-[300px] bg-slate-50 rounded-lg p-6">
          <div
            className={`transition-all duration-300 ${
              device === 'mobile' ? 'w-full max-w-sm' : 'w-full'
            }`}
          >
            {children}
          </div>
        </div>
        {device === 'mobile' && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Mobile preview simulates how your schema appears on mobile devices (Google uses mobile-first indexing)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
