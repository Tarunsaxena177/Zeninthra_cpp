import React from 'react';
import { Shield, Activity, Send } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging tailwind classes.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  socket: Socket | null;
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
}

/**
 * Header component displaying the application title, network status, and transmission control.
 */
export const Header: React.FC<HeaderProps> = ({ socket, isStreaming, setIsStreaming }) => {
  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">SecureMediaNet</h1>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Adaptive Networking Prototype</p>
          </div>
        </div>

        {/* Network Status and Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse", 
              socket?.connected ? "bg-emerald-500" : "bg-red-500"
            )} />
            <span className="text-xs font-mono uppercase tracking-wider">
              {socket?.connected ? 'Network Online' : 'Offline'}
            </span>
          </div>
          
          <button 
            onClick={() => setIsStreaming(!isStreaming)}
            className={cn(
              "px-6 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2",
              isStreaming 
                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" 
                : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            )}
          >
            {isStreaming ? <Activity className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {isStreaming ? 'Stop Transmission' : 'Start Transmission'}
          </button>
        </div>
      </div>
    </header>
  );
};
