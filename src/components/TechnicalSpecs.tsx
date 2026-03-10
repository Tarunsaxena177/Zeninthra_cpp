import React from 'react';

/**
 * TechnicalSpecs component displaying protocol and security information.
 */
export const TechnicalSpecs: React.FC = () => {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Protocol Design Column */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-widest">Protocol Design</h4>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Custom application-layer protocol designed for low-latency media transmission. 
          Packets encapsulate metadata, cryptographic signatures, and encrypted payloads.
        </p>
      </div>

      {/* Security Architecture Column */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-widest">Security Architecture</h4>
        <ul className="text-sm text-zinc-500 space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500" /> 
            AES-256 Payload Encryption
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500" /> 
            HMAC-SHA256 Authentication
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500" /> 
            SHA-256 Integrity Verification
          </li>
        </ul>
      </div>

      {/* Network Simulation Column */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-widest">Network Simulation</h4>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Real-time WebSocket communication simulating a distributed environment. 
          The receiver validates every packet before processing to prevent tampering.
        </p>
      </div>
    </footer>
  );
};
