import React from 'react';
import { Cpu, Database, Wifi, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SenderLog } from '../types';

interface DataProducerProps {
  senderId: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  lastFrame: string | null;
  senderLogs: SenderLog[];
}

/**
 * DataProducer component responsible for generating and displaying the source media stream.
 */
export const DataProducer: React.FC<DataProducerProps> = ({ 
  senderId, 
  canvasRef, 
  lastFrame, 
  senderLogs 
}) => {
  return (
    <div className="lg:col-span-5 space-y-6">
      <section className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
        {/* Section Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/80">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Data Producer</h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-black px-2 py-0.5 rounded border border-white/5">
            {senderId}
          </span>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Simulated Camera Feed Display */}
          <div className="relative aspect-video bg-black rounded-xl border border-white/5 overflow-hidden group">
            {/* Hidden canvas for frame generation */}
            <canvas ref={canvasRef} width={200} height={150} className="hidden" />
            
            {lastFrame ? (
              <img 
                src={lastFrame} 
                className="w-full h-full object-cover" 
                alt="Source" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-3">
                <Wifi className="w-8 h-8 opacity-20" />
                <p className="text-xs font-mono uppercase tracking-widest">Source Idle</p>
              </div>
            )}
            
            {/* Overlay Status */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white uppercase tracking-tighter">Live Capture</span>
            </div>
          </div>

          {/* Transmission Buffer Log */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-3 h-3" />
              Transmission Buffer
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {senderLogs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 bg-black/40 border border-white/5 rounded-lg font-mono text-[10px] space-y-2"
                  >
                    <div className="flex justify-between text-zinc-500">
                      <span>SEQ: {log.packet.header.seq}</span>
                      <span>{new Date(log.packet.header.timestamp).toLocaleTimeString()}</span>
                    </div>
                    
                    {/* Security Metadata Display */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-1.5 bg-zinc-900 rounded border border-white/5">
                        <p className="text-emerald-500/70 mb-1">AUTH SIG</p>
                        <p className="truncate text-zinc-400">{log.packet.auth.signature}</p>
                      </div>
                      <div className="p-1.5 bg-zinc-900 rounded border border-white/5">
                        <p className="text-blue-500/70 mb-1">INTEGRITY HASH</p>
                        <p className="truncate text-zinc-400">{log.packet.integrity.hash}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Lock className="w-3 h-3" />
                      <span className="truncate">PAYLOAD: {log.packet.payload.substring(0, 40)}...</span>
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
