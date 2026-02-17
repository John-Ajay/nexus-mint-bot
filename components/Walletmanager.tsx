
import React, { useState } from 'react';
import { Wallet, Network } from '../types';
import { Plus, Wallet as WalletIcon, Trash2, CheckCircle2, Key, X } from 'lucide-react';

interface WalletManagerProps {
  wallets: Wallet[];
  onToggleSelect: (id: string) => void;
  onAddWallet: (network: Network, privateKey?: string) => void;
  onRemoveWallet: (id: string) => void;
}

const WalletManager: React.FC<WalletManagerProps> = ({ wallets, onToggleSelect, onAddWallet, onRemoveWallet }) => {
  const [showImport, setShowImport] = useState(false);
  const [importNetwork, setImportNetwork] = useState<Network>(Network.ETHEREUM);
  const [keyInput, setKeyInput] = useState('');

  const handleImport = () => {
    if (!keyInput) return;
    onAddWallet(importNetwork, keyInput);
    setKeyInput('');
    setShowImport(false);
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <WalletIcon className="w-5 h-5 text-indigo-400" />
          Fleet Manager
        </h2>
        <button 
          onClick={() => setShowImport(true)}
          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          title="Import Private Key"
        >
          <Key className="w-4 h-4 text-yellow-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {wallets.length === 0 ? (
          <div className="text-gray-500 text-center py-10 italic">No wallets connected.</div>
        ) : (
          wallets.map(wallet => (
            <div 
              key={wallet.id}
              onClick={() => onToggleSelect(wallet.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group ${
                wallet.isSelected 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-white/5 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                   <div className={`w-2.5 h-2.5 rounded-full ${wallet.network === Network.ETHEREUM ? 'bg-blue-400' : 'bg-green-400'}`} />
                   {wallet.privateKey && <Key className="w-2 h-2 text-yellow-500 absolute -top-1 -right-1" />}
                </div>
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {wallet.label}
                    {wallet.isSelected && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                  </div>
                  <div className="text-[10px] text-gray-500 mono truncate w-24 group-hover:w-32 transition-all">{wallet.address}</div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="text-xs font-bold text-gray-300">{wallet.balance} {wallet.network === Network.ETHEREUM ? 'ETH' : 'SOL'}</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveWallet(wallet.id); }}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showImport && (
        <div className="absolute inset-0 bg-gray-900/95 p-6 z-20 flex flex-col border-t border-indigo-500/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Import Key</h3>
            <button onClick={() => setShowImport(false)}><X className="w-4 h-4 text-gray-500" /></button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setImportNetwork(Network.ETHEREUM)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border ${importNetwork === Network.ETHEREUM ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10'}`}
              >
                Ethereum
              </button>
              <button 
                onClick={() => setImportNetwork(Network.SOLANA)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border ${importNetwork === Network.SOLANA ? 'bg-emerald-600 border-emerald-400' : 'bg-white/5 border-white/10'}`}
              >
                Solana
              </button>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold">Private Key</label>
              <input 
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter private key hex or secret..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button 
              onClick={handleImport}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-all shadow-lg"
            >
              Confirm Import
            </button>
            <p className="text-[9px] text-gray-500 text-center italic">Keys are processed locally. Never share keys.</p>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-xs text-gray-400">Active Fleet:</span>
        <span className="text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 rounded text-xs">
          {wallets.filter(w => w.isSelected).length} Wallets
        </span>
      </div>
    </div>
  );
};

export default WalletManager;
