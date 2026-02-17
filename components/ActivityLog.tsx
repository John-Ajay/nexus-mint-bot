
import React from 'react';
import { MintLog, Network } from '../types';
import { Terminal, Circle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface ActivityLogProps {
  logs: MintLog[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          Live Minting Logs
        </h2>
        <div className="flex gap-1.5">
          <Circle className="w-2.5 h-2.5 fill-red-500 text-red-500" />
          <Circle className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
          <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mono text-sm pr-2 scroll-smooth">
        {logs.length === 0 ? (
          <div className="text-gray-600 h-full flex items-center justify-center italic">Waiting for operations...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 border-b border-white/5 pb-2 last:border-0 group">
              <div className="pt-1">
                {log.status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {log.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {log.status === 'pending' && <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-[10px] font-bold px-1.5 rounded uppercase ${log.network === Network.ETHEREUM ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                    {log.network}
                  </span>
                  <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">{log.timestamp}</span>
                </div>
                <div className="text-xs font-semibold text-indigo-300 mb-0.5">[{log.walletLabel}]</div>
                <div className={`text-xs ${log.status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                  {log.message}
                </div>
              </div>
            </div>
          )).reverse()
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
