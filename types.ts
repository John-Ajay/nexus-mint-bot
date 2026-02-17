
export enum Network {
  ETHEREUM = 'Ethereum',
  SOLANA = 'Solana'
}

export interface Wallet {
  id: string;
  address: string;
  network: Network;
  label: string;
  balance: string;
  isSelected: boolean;
  privateKey?: string; // Stored only for simulation
}

export interface MintLog {
  id: string;
  timestamp: string;
  walletLabel: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  network: Network;
  feeUsed?: string;
}

export interface ContractAnalysis {
  riskScore: number;
  functions: string[];
  vulnerabilities: string[];
  summary: string;
}
