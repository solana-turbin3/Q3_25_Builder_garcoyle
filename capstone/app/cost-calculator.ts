import { Connection, clusterApiUrl } from '@solana/web3.js';
import { analyzeBinary } from './binary-analyzer';
import { SolanaClient } from './solana-client';

export interface CostAnalysis {
  deploymentCost: number;  // in lamports
  transactionCost: number; // in lamports  
  dailyProjection: number; // in lamports
}

export async function calculateDeploymentCost(filePath: string): Promise<number> {
  const analysis = analyzeBinary(filePath);
  const client = new SolanaClient();
  const rentPerByte = await client.getRentPerByte(); // Real rate instead of hardcoded
  return analysis.fileSize * rentPerByte;
}

export async function calculateTransactionCost(filePath: string): Promise<number> {
  const analysis = analyzeBinary(filePath);
  const client = new SolanaClient();
  const cuPrice = await client.getCurrentCUPrice(); // Real rate instead of hardcoded
  
  // Estimate CU usage from program
  const estimatedCUUsage = Math.min(Math.max(analysis.fileSize / 50, 5000), 200000);
  return estimatedCUUsage * cuPrice;
}

export function calculateDailyProjections(transactionCost: number, dailyTxCount: number = 100): number {
  return transactionCost * dailyTxCount;
}

// Add this function to your cost-calculator.ts
export async function calculateAllCosts(filePath: string): Promise<CostAnalysis> {
  const deploymentCost = await calculateDeploymentCost(filePath);
  const transactionCost = await calculateTransactionCost(filePath);
  const dailyProjection = calculateDailyProjections(transactionCost);
  
  return {
    deploymentCost,
    transactionCost,
    dailyProjection
  };
}