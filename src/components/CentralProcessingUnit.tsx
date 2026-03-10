import React from 'react';
import { Server, Lock, Unlock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ReceiverLog, MetricData } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging tailwind classes.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CentralProcessingUnitProps {
  receivedFrame: string | null;
  metrics: MetricData[];
  receiverLogs: ReceiverLog[];
}

/**
 * CentralProcessingUnit component responsible for receiving, validating, and displaying the media stream.
 */
export const CentralProcessingUnit: React.FC<CentralProcessingUnitProps> = ({ 
  receivedFrame, 
  metrics, 
  receiverLogs 
}) => {
  return (
    <div className="lg:col-span-7 space-y-6">
      <section className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
        {/* Section Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/80">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Central Processing Unit</h2>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Decrypted Media Stream Output */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Decrypted Media Stream</h3>
            <div className="relative aspect-video bg-black rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
              {receivedFrame ? (
                <img 
                  src={receivedFrame} 
                  className="w-full h-full object-cover" 
                  alt="Received" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-700">
                  <Lock className="w-8 h-8 opacity-20" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">Waiting for Secure Handshake</p>
                </div>
              )}
              
              {receivedFrame && (
                <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 flex items-center gap-2">
                  <Unlock className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Verified & Decrypted</span>
                </div>
              )}
            </div>
            
            {/* Real-time Network Latency Chart */}
            <div className="h-32 bg-black/40 rounded-xl border border-white/5 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false} 
                    animationDuration={300} 
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-center text-zinc-600 mt-1 uppercase tracking-widest">Network Latency (ms)</p>
            </div>
          </div>

          {/* Validation Engine Log */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Validation Engine</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {receiverLogs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-3 rounded-lg border text-[10px] font-mono transition-colors",
                      log.result.isValid 
                        ? "bg-emerald-500/5 border-emerald-500/20" 
                        : "bg-red-500/5 border-red-500/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {log.result.isValid ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className={log.result.isValid ? "text-emerald-500" : "text-red-500"}>
                          {log.result.isValid ? 'VALIDATED' : 'REJECTED'}
                        </span>
                      </div>
                      <span className="text-zinc-500">SEQ: {log.packet.header.seq}</span>
                    </div>
                    
                    <div className="space-y-1 text-zinc-400">
                      <p className="flex justify-between">
                        <span>Integrity:</span>
                        <span className="text-zinc-300">PASS</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Authenticity:</span>
                        <span className="text-zinc-300">PASS</span>
                      </p>
                      {!log.result.isValid && (
                        <p className="text-red-400 mt-1">{log.result.error}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
