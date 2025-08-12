import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { Capstone } from "../target/types/capstone";
import * as anchor from "@coral-xyz/anchor";
import { calculateAllCosts, CostAnalysis } from "./cost-calculator";
import { analyzeBinary, ProgramAnalysis } from "./binary-analyzer";

export class AnchorClient {
  private program: Program<Capstone>;
  private provider: AnchorProvider;

  constructor() {
    this.provider = AnchorProvider.env();
    this.program = anchor.workspace.Capstone as Program<Capstone>;
  }

  async storeAnalysisResults(
    accountPubkey: PublicKey, 
    analysisData: any,
    filePath: string
  ): Promise<boolean> {
    try {
      console.log(`📊 Calculating costs for: ${filePath}`);
      
      // 1. Use your integrated backend pipeline
      const binaryAnalysis = analyzeBinary(filePath);
      const costs: CostAnalysis = await calculateAllCosts(filePath);
      
      // 2. Validate the calculated costs
      if (!this.validateCosts(costs, binaryAnalysis)) {
        console.error("❌ Cost validation failed");
        return false;
      }
      
      console.log(`✓ Validated costs - Deployment: ${costs.deploymentCost}, Transaction: ${costs.transactionCost}`);
      
      // 3. Derive user account PDA
      const userAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), analysisData.user.toBuffer()],
        this.program.programId
      )[0];
      
      // 4. Store results on-chain with retry logic
      await this.storeWithRetry(
        analysisData.timestamp,
        costs.deploymentCost,
        costs.transactionCost, 
        costs.dailyProjection,
        analysisData.user,
        userAccount,
        accountPubkey
      );
      
      console.log(`✅ Results stored successfully for ${binaryAnalysis.programName}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to store analysis results: ${error}`);
      return false;
    }
  }

  private validateCosts(costs: CostAnalysis, binaryAnalysis: ProgramAnalysis): boolean {
    // Validate deployment cost (should be reasonable for file size)
    const maxDeploymentCost = binaryAnalysis.fileSize * 10000000; // 10M lamports per byte max
    if (costs.deploymentCost <= 0 || costs.deploymentCost > maxDeploymentCost) {
      console.error(`Invalid deployment cost: ${costs.deploymentCost}`);
      return false;
    }
    
    // Validate transaction cost (reasonable CU range)
    const minTransactionCost = 5000; // 5K lamports minimum 
    const maxTransactionCost = 1000000000; // 1 SOL maximum
    if (costs.transactionCost < minTransactionCost || costs.transactionCost > maxTransactionCost) {
      console.error(`Invalid transaction cost: ${costs.transactionCost}`);
      return false;
    }
    
    // Validate daily projection
    if (costs.dailyProjection <= 0 || costs.dailyProjection < costs.transactionCost) {
      console.error(`Invalid daily projection: ${costs.dailyProjection}`);
      return false;
    }
    
    return true;
  }

  private async storeWithRetry(
    timestamp: BN,
    deploymentCost: number,
    transactionCost: number,
    dailyProjection: number,
    user: PublicKey,
    userAccount: PublicKey,
    analysisAccount: PublicKey,
    maxRetries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.program.methods
          .storeResults(
            timestamp,
            new BN(deploymentCost),
            new BN(transactionCost), 
            new BN(dailyProjection)
          )
          .accountsPartial({
            user: user,
            userAccount: userAccount,
            analysisAccount: analysisAccount,
          })
          .rpc();
        
        return; // Success!
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed: ${error}`);
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}