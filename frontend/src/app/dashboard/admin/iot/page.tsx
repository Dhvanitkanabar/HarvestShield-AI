'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';
import {
  Activity,
  Thermometer,
  Droplets,
  MapPin,
  AlertTriangle,
  StopCircle,
} from 'lucide-react';

interface TwinData {
  entityId: string;
  entityType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentStatus: any;
  lastUpdatedAt: string;
}

export default function IoTDashboard() {
  const [twins, setTwins] = useState<Record<string, TwinData>>({});
  const [, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Connect to WebSocket Server
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to IoT WebSocket Server');
      // For demo, we just join a generic room or we could join specific entity rooms
    });

    socketInstance.on('twin_update', (data: TwinData) => {
      console.log('Received twin update', data);
      setTwins((prev) => ({ ...prev, [data.entityId]: data }));
      toast.success(`Digital Twin Updated: ${data.entityType} ${data.entityId.substring(0,6)}...`);
    });

    socketInstance.on('simulation_event', (event) => {
      console.log('Simulation Event:', event);
      if (event.newStatus.status === 'CRITICAL') {
        toast.error(`CRITICAL ALERT: ${event.scenario} on ${event.targetType}`);
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const triggerSimulation = async (scenario: string, targetType: string, targetId: string) => {
    setLoading(true);
    try {
      await apiClient.post('/iot/simulation', {
        scenario,
        targetType,
        targetId,
      });
      toast.success(`Triggered scenario: ${scenario}`);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err.response?.data?.message || 'Failed to trigger simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">IoT & Digital Twin</h1>
          <p className="text-slate-500 mt-1">Real-time monitoring and simulation platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Live Stream Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Simulation Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 text-indigo-500 mr-2" />
              Simulation Engine
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Trigger mock IoT telemetry to test Digital Twins and Alert automation.
              </p>
              
              <div className="space-y-2 border-t pt-4">
                <label className="text-xs font-semibold text-slate-700">Target Entity ID (e.g. Warehouse)</label>
                <input 
                  type="text" 
                  id="targetId"
                  placeholder="Enter UUID..."
                  className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  defaultValue="demo-warehouse-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <button 
                  onClick={() => triggerSimulation('TEMPERATURE_SPIKE', 'WAREHOUSE', (document.getElementById('targetId') as HTMLInputElement).value)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Thermometer className="w-4 h-4" />
                  <span>Simulate Temp Spike</span>
                </button>

                <button 
                  onClick={() => triggerSimulation('NETWORK_FAILURE', 'VEHICLE', (document.getElementById('targetId') as HTMLInputElement).value)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-50 text-amber-600 hover:bg-amber-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Simulate Network Loss</span>
                </button>

                <button 
                  onClick={() => triggerSimulation('NORMAL', 'WAREHOUSE', (document.getElementById('targetId') as HTMLInputElement).value)}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                  <span>Restore Normal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Digital Twins */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 text-indigo-500 mr-2" />
              Active Digital Twins
            </h2>
            
            {Object.keys(twins).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                <Activity className="w-12 h-12 mb-3 text-slate-200" />
                <p>No active twins connected.</p>
                <p className="text-sm mt-1">Trigger a simulation to see live data.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(twins).map((twin) => (
                  <div key={twin.entityId} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                          {twin.entityType}
                        </span>
                        <h3 className="font-semibold text-slate-900 truncate w-40" title={twin.entityId}>
                          {twin.entityId}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        twin.currentStatus.status === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                        twin.currentStatus.status === 'OFFLINE' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {twin.currentStatus.status || 'ONLINE'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center"><Thermometer className="w-4 h-4 mr-1"/> Temp</span>
                        <span className={`font-mono font-medium ${twin.currentStatus.temperature > 30 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {twin.currentStatus.temperature ? `${twin.currentStatus.temperature}°C` : '--'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center"><Droplets className="w-4 h-4 mr-1"/> Humidity</span>
                        <span className="font-mono font-medium text-slate-900">
                          {twin.currentStatus.humidity ? `${twin.currentStatus.humidity}%` : '--'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-slate-400 flex justify-between items-center">
                      <span>Last updated</span>
                      <span>{new Date(twin.lastUpdatedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
