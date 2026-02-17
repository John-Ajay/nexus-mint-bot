
import React, { useState } from 'react';
import { Network, ContractAnalysis } from '../types';
import { Zap, ShieldAlert, BrainCircuit, Loader2, Link as LinkIcon, Gauge } from 'lucide-react';
import { analyzeContract } from '../services/geminiService';

interface MintControlProps {
  onMint: (contractAddress: string, network: Network, quantity: number, settings: any) => void;
  isMinting: boolean;
  selectedCount: number;
}

const MintControl: React.FC<MintControlProps> = ({ onMint, isMinting, selectedCount }) => {
  const [target, setTarget] = useState('');
  const [network, setNetwork] = useState<Network>(Network.ETHEREUM);
  const [quantity, setQuantity] = useState(1);
  const [priorityFee, setPriorityFee] = useState(2.5); // Gwei or Priority level
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!target) return;
    setIsAnalyzing(true);
    try {
      // Logic to extract contract from URL if needed
      const contractData = target.includes('opensea.io') || target.includes('http') 
        ? `I am providing a link: ${target}. Extract the contract address and network type.`
        : target;
      const result = await analyzeContract(contractData, network);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startMint = () => {
    if (!target || selectedCount === 0) return;
    onMint(target, network, quantity, { priorityFee });
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Execution Engine
        </h2>
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setNetwork(Network.ETHEREUM)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${network === Network.ETHEREUM ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-white'}`}
          >
            Ethereum
          </button>
          <button 
            onClick={() => setNetwork(Network.SOLANA)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${network === Network.SOLANA ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-white'}`}
          >
            Solana
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5 uppercase font-black tracking-widest">Contract Address / URL</label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x... or Opensea/Mint URL"
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-24 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-all mono ring-0 focus:ring-2 focus:ring-indigo-500/10"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !target}
              className="absolute right-2 top-2 bottom-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-4 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all disabled:opacity-30"
            >
              {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
              Audit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-gray-500 mb-1.5 uppercase font-black tracking-widest">Mints per Wallet</label>
            <input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-1.5 uppercase font-black tracking-widest">
              {network === Network.ETHEREUM ? 'Priority Fee (Gwei)' : 'Priority fee'}
            </label>
            <div className="relative">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                <Gauge className="w-4 h-4" />
               </div>
               <input 
                type="number" 
                step="0.1"
                value={priorityFee}
                onChange={(e) => setPriorityFee(parseFloat(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-bold text-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-top-4 duration-500 ${analysis.riskScore > 50 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${analysis.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Gemini Intelligence Scan</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${analysis.riskScore > 50 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
              Risk: {analysis.riskScore}/100
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed italic">"{analysis.summary}"</p>
        </div>
      )}

      <button 
        onClick={startMint}
        disabled={isMinting || !target || selectedCount === 0}
        className={`w-full py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${
          isMinting 
            ? 'bg-gray-800' 
            : 'bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-500/20'
        } disabled:opacity-30`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {isMinting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            Broadcasting transactions...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-current text-yellow-400" />
            Engage Protocol
          </>
        )}
      </button>

      <div className="flex justify-between items-center text-[9px] text-gray-600 uppercase font-black tracking-widest px-1">
        <span>Target: {selectedCount} Nodes</span>
        <span>Network: {network}</span>
      </div>
    </div>
  );
};

export default MintControl;
