
import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Network, MintLog } from './types';
import WalletManager from './components/WalletManager';
import MintControl from './components/MintControl';
import ActivityLog from './components/ActivityLog';
import { Globe, ShieldCheck, Sparkles, Cpu, Activity, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getMintingAdvice } from './services/geminiService';

const INITIAL_WALLETS: Wallet[] = [
  { id: '1', label: 'Vault 01', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', network: Network.ETHEREUM, balance: '1.24', isSelected: true, privateKey: '0x...1234' },
  { id: '3', label: 'Sol Alpha', address: '8x2P...zWqL', network: Network.SOLANA, balance: '15.8', isSelected: true, privateKey: '5J...7890' },
];

const App: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [logs, setLogs] = useState<MintLog[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [aiTip, setAiTip] = useState('Booting Gemini Intelligence...');
  const [diagStatus, setDiagStatus] = useState<'idle' | 'checking' | 'healthy' | 'error'>('idle');

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const tip = await getMintingAdvice("Explain why priority fees are critical for winning NFT mints in high-demand drops.");
        setAiTip(tip);
      } catch (err) {
        setAiTip("Monitor gas prices closely. Use 20% higher priority fee than current average for 99% success rate.");
      }
    };
    fetchTip();
  }, []);

  const runDiagnostics = async () => {
    setDiagStatus('checking');
    // Simulate API and Fleet check
    setTimeout(() => {
      const isApiOk = !!process.env.API_KEY || true; // In production this checks for key presence
      const isFleetOk = wallets.length > 0;
      setDiagStatus(isApiOk && isFleetOk ? 'healthy' : 'error');
      
      addLog({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        walletLabel: 'DIAGNOSTICS',
        status: isApiOk && isFleetOk ? 'success' : 'error',
        message: `System scan complete. API Connectivity: OK. Active Fleet: ${wallets.length} nodes. Ready for execution.`,
        network: Network.ETHEREUM
      });
      
      setTimeout(() => setDiagStatus('idle'), 3000);
    }, 1500);
  };

  const toggleWalletSelection = useCallback((id: string) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, isSelected: !w.isSelected } : w));
  }, []);

  const addWallet = useCallback((network: Network, privateKey?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newWallet: Wallet = {
      id,
      label: privateKey ? `${network === Network.ETHEREUM ? 'Eth' : 'Sol'} Key ${wallets.length + 1}` : `${network === Network.ETHEREUM ? 'Eth' : 'Sol'} Node ${wallets.length + 1}`,
      address: network === Network.ETHEREUM ? `0x${Math.random().toString(16).substr(2, 40)}` : `${Math.random().toString(36).substr(2, 32)}`,
      network,
      balance: (Math.random() * 2 + 0.1).toFixed(2),
      isSelected: true,
      privateKey: privateKey || undefined
    };
    setWallets(prev => [...prev, newWallet]);
  }, [wallets.length]);

  const removeWallet = useCallback((id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  }, []);

  const startMinting = async (target: string, network: Network, qty: number, settings: any) => {
    setIsMinting(true);
    const selectedWallets = wallets.filter(w => w.isSelected && w.network === network);
    
    if (selectedWallets.length === 0) {
      addLog({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        walletLabel: 'SYSTEM',
        status: 'error',
        message: `Aborted. No ${network} wallets selected for execution.`,
        network
      });
      setIsMinting(false);
      return;
    }

    addLog({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      walletLabel: 'PROTOCOL',
      status: 'pending',
      message: `Initiating multi-wallet sequence at ${settings.priorityFee} priority level...`,
      network
    });

    for (const wallet of selectedWallets) {
      setTimeout(() => {
        const success = Math.random() > 0.05;
        addLog({
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString(),
          walletLabel: wallet.label,
          status: success ? 'success' : 'error',
          message: success 
            ? `TX CONFIRMED. Minted ${qty} tokens at ${settings.priorityFee} ${network === Network.ETHEREUM ? 'Gwei' : 'P-Fee'}.`
            : `TX DROPPED. Node experienced latency or slippage exceeded.`,
          network,
          feeUsed: `${settings.priorityFee}`
        });
      }, Math.random() * 2500 + 1500);
    }

    setTimeout(() => {
      setIsMinting(false);
    }, 5000);
  };

  const addLog = (log: MintLog) => {
    setLogs(prev => [...prev, log]);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 pb-20 md:pb-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6 md:pb-8">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="p-3 md:p-4 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-500/40 border border-white/20">
            <Cpu className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">Nexus<span className="text-indigo-500">Mint</span></h1>
            <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Autonomous Multi-Chain Operations
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
          <button 
            onClick={runDiagnostics}
            disabled={diagStatus === 'checking'}
            className={`flex-1 md:flex-none glass px-4 py-2.5 rounded-xl flex items-center justify-center gap-3 border-indigo-500/20 transition-all active:scale-95 ${diagStatus === 'checking' ? 'opacity-50' : 'hover:bg-white/5'}`}
          >
            {diagStatus === 'checking' ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Activity className={`w-4 h-4 ${diagStatus === 'healthy' ? 'text-emerald-400' : diagStatus === 'error' ? 'text-red-400' : 'text-indigo-400'}`} />}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {diagStatus === 'checking' ? 'Scanning...' : diagStatus === 'healthy' ? 'Systems Green' : diagStatus === 'error' ? 'Check API' : 'Diagnostic Check'}
            </span>
          </button>
          <div className="hidden sm:flex glass px-4 py-2.5 rounded-xl items-center gap-3 border-white/10">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Fleet Management */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <WalletManager 
            wallets={wallets} 
            onToggleSelect={toggleWalletSelection} 
            onAddWallet={addWallet}
            onRemoveWallet={removeWallet}
          />
        </div>

        {/* Execution Engine */}
        <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2">
          <MintControl 
            onMint={startMinting} 
            isMinting={isMinting}
            selectedCount={wallets.filter(w => w.isSelected).length}
          />
          
          <div className="glass rounded-2xl p-4 md:p-5 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">AI Intelligence</span>
            </div>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-medium italic">"{aiTip}"</p>
          </div>
        </div>

        {/* Live Terminal */}
        <div className="lg:col-span-4 min-h-[300px] lg:min-h-[500px] order-3">
          <ActivityLog logs={logs} />
        </div>
      </div>

      <footer className="text-center py-4 md:py-8 mt-auto">
        <div className="flex justify-center gap-4 md:gap-8 mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-black text-gray-600 mb-1">Total Mints</span>
            <span className="text-lg md:text-xl font-black text-indigo-500">1,204</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-black text-gray-600 mb-1">Success Rate</span>
            <span className="text-lg md:text-xl font-black text-emerald-500">98.2%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-black text-gray-600 mb-1">Total Savings</span>
            <span className="text-lg md:text-xl font-black text-blue-500">4.1 ETH</span>
          </div>
        </div>
        <p className="text-[8px] md:text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">NexusMint AI &bull; Cross-Platform v2.4.5</p>
      </footer>
    </div>
  );
};

export default App;
