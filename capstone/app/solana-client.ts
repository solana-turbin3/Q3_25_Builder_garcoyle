import { Connection, clusterApiUrl } from '@solana/web3.js';

export class SolanaClient {
  private connection: Connection;

  constructor(cluster: string = 'devnet') {
    this.connection = new Connection(clusterApiUrl(cluster as any), 'confirmed');
  }

  async getRentPerByte(): Promise<number> {
    const rentFor1Byte = await this.connection.getMinimumBalanceForRentExemption(1);
    return rentFor1Byte;
  }

  async getCurrentCUPrice(): Promise<number> {
    try {
      // Get recent prioritization fees from the network
      const recentFees = await this.connection.getRecentPrioritizationFees();
      
      if (recentFees.length > 0) {
        // Calculate average from recent fees
        const totalFees = recentFees.reduce((sum, fee) => sum + fee.prioritizationFee, 0);
        const averageFee = totalFees / recentFees.length;
        return Math.max(averageFee, 1); // Ensure minimum of 1 lamport per CU
      }
      
      // Fallback if no recent fees available
      return 1; // Base rate when no priority fees
      
    } catch (error) {
      console.error('Failed to fetch CU pricing:', error);
      return 1; // Fallback base rate
    }
  }

  async getNetworkRates() {
    const rentPerByte = await this.getRentPerByte();
    const cuPrice = await this.getCurrentCUPrice();
    
    return {
      rentPerByte,
      lamportsPerCU: cuPrice
    };
  }
}