<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1b440459-1b55-4ddc-97b5-8e017ceee1e0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

SecureMediaNet is a high-performance, secure media transmission prototype. It demonstrates a custom application-layer protocol designed for low-latency data streaming with robust cryptographic verification.

## 🚀 Key Features

- **Secure Transmission**: Every data packet is encrypted using AES-256 and signed with HMAC-SHA256.
- **Real-time Monitoring**: Visualizes network latency and transmission logs in real-time using Recharts.
- **Integrity Verification**: Uses SHA-256 hashing to ensure data has not been tampered with during transit.
- **Adaptive UI**: A modern, responsive dashboard built with Tailwind CSS and Framer Motion for smooth interactions.
- **Simulated Media Source**: Generates dynamic visual data using HTML5 Canvas to simulate a live camera feed.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (v4), Lucide React (Icons)
- **Animation**: Motion (formerly Framer Motion)
- **Networking**: Socket.io (Real-time communication), CryptoJS (Cryptography)
- **Data Viz**: Recharts (Latency tracking)

## 📂 Project Structure

The project follows a modular architecture for better maintainability and separation of concerns:

```text
src/
├── components/             # Reusable UI Components
│   ├── Header.tsx          # Navigation and global controls
│   ├── DataProducer.tsx    # Source media generation and sender logs
│   ├── CentralProcessingUnit.tsx # Receiver logic, validation, and metrics
│   └── TechnicalSpecs.tsx  # Protocol and security documentation
├── lib/                    # Core Logic & Utilities
│   └── networking.ts       # Secure packet creation and validation logic
├── types.ts                # Global TypeScript interfaces and types
├── App.tsx                 # Main application orchestrator
├── main.tsx                # Application entry point
└── index.css               # Global styles and Tailwind configuration

🔐 Protocol Architecture
The custom protocol operates on a four-step security model:
Payload Encryption: The raw media data is encrypted using AES-256 with a shared secret.
Integrity Hashing: A SHA-256 hash is generated from the encrypted payload.
Authentication Signature: An HMAC-SHA256 signature is created using the packet metadata (Sequence, Timestamp, Sender ID) and the integrity hash.
Validation Engine: The receiver re-calculates the hash and signature to verify the packet before decryption.
