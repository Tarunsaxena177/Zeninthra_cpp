import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { createPacket, validatePacket, SecurePacket } from './lib/networking';
import { SenderLog, ReceiverLog, MetricData } from './types';

// Components
import { Header } from './components/Header';
import { DataProducer } from './components/DataProducer';
import { CentralProcessingUnit } from './components/CentralProcessingUnit';
import { TechnicalSpecs } from './components/TechnicalSpecs';

/**
 * Main Application Component for SecureMediaNet.
 * Manages the global state, socket connection, and data transmission loop.
 */
export default function App() {
  // --- State Management ---
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [senderId] = useState(`DEVICE-${Math.floor(Math.random() * 900) + 100}`);
  const [seq, setSeq] = useState(0);
  
  // Logs and Metrics
  const [senderLogs, setSenderLogs] = useState<SenderLog[]>([]);
  const [receiverLogs, setReceiverLogs] = useState<ReceiverLog[]>([]);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  
  // Media State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastFrame, setLastFrame] = useState<string | null>(null);
  const [receivedFrame, setReceivedFrame] = useState<string | null>(null);

  // --- Socket Initialization ---
  useEffect(() => {
    // Initialize socket connection to the server
    const newSocket = io();
    setSocket(newSocket);

    // Listen for incoming secure packets
    newSocket.on('receive', (packet: SecurePacket) => {
      // Validate the packet using the networking library
      const result = validatePacket(packet);
      
      const logEntry: ReceiverLog = {
        id: Date.now(),
        packet,
        result,
        receivedAt: Date.now(),
      };
      
      // Update receiver logs (keep last 20)
      setReceiverLogs(prev => [logEntry, ...prev].slice(0, 20));
      
      // If valid, update the received frame and metrics
      if (result.isValid && result.decryptedData) {
        setReceivedFrame(result.decryptedData);
        
        // Calculate simulated network latency
        const latency = Date.now() - packet.header.timestamp;
        setMetrics(prev => [
          ...prev, 
          { time: new Date().toLocaleTimeString(), latency }
        ].slice(-20));
      }
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // --- Frame Generation & Transmission Loop ---
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      if (!canvasRef.current || !socket) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // 1. Generate Dynamic Visual Content (Simulated Media)
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 200, 150);
      
      // Draw random moving circles
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * 200,
          Math.random() * 150,
          Math.random() * 20,
          0, Math.PI * 2
        );
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
        ctx.fill();
      }

      // 2. Capture Frame as WebP
      const frameData = canvasRef.current.toDataURL('image/webp', 0.5);
      setLastFrame(frameData);

      // 3. Create and Transmit Secure Packet
      const packet = createPacket(senderId, seq, frameData);
      socket.emit('transmit', packet);
      
      // 4. Update Sender Logs
      setSenderLogs(prev => [{ id: Date.now(), packet }, ...prev].slice(0, 10));
      setSeq(s => s + 1);
    }, 1000); // 1 FPS for demonstration clarity

    return () => clearInterval(interval);
  }, [isStreaming, socket, seq, senderId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Top Navigation Bar */}
      <Header 
        socket={socket} 
        isStreaming={isStreaming} 
        setIsStreaming={setIsStreaming} 
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Data Producer (Sender) */}
        <DataProducer 
          senderId={senderId}
          canvasRef={canvasRef}
          lastFrame={lastFrame}
          senderLogs={senderLogs}
        />

        {/* Right Column: Central Processing Unit (Receiver) */}
        <CentralProcessingUnit 
          receivedFrame={receivedFrame}
          metrics={metrics}
          receiverLogs={receiverLogs}
        />
      </main>

      {/* Footer with Technical Information */}
      <TechnicalSpecs />

      {/* Global Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
