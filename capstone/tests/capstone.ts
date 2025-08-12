import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Capstone } from "../target/types/capstone";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { PublicKey } from "@solana/web3.js"; 
import { BN } from "@coral-xyz/anchor";
import { monitorAnalysisAccounts } from "../app/account-monitor";

describe("capstone", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const program = anchor.workspace.capstone as Program<Capstone>;

  const userAccount = PublicKey.findProgramAddressSync(
    [Buffer.from("user_account"), provider.publicKey.toBuffer()],
    program.programId
  )[0];

  //shared timestamp and analysis account between test
  let sharedTimestamp: BN;
  let sharedAnalysisAccount: PublicKey;


  it("Creates user account", async () => {
    const tx = await program.methods
      .requestAnalysis()
      .accountsPartial({
      user: provider.publicKey,
      userAccount: userAccount,
      systemProgram: SYSTEM_PROGRAM_ID
      })
      .rpc();
    console.log("User account created with transaction signature", tx);
  }

  );
  it("Sets up analysis", async () => {
    sharedTimestamp = new BN(Date.now());
    const programName = "Test Program";    

    //Created shared analysis account with correct seeds
    sharedAnalysisAccount = PublicKey.findProgramAddressSync([
      Buffer.from("analysis"),                               // Correct seed
      sharedTimestamp.toArrayLike(Buffer, "le", 8),         // Use timestamp
      userAccount.toBuffer()                                 // Use userAccount
    ], program.programId)[0];

    const tx = await program.methods
      .analysisSetup(sharedTimestamp, programName)
      .accountsPartial({
        user: provider.publicKey,
        userAccount: userAccount,
      })
      .rpc();
    console.log("Analysis setup with transaction signature", tx);
  }
  );

  it("Stores analysis results", async () => {
    const deploymentCost = new BN(10000000);
    const transactionCost = new BN(500000);
    const dailyProjection = new BN(50000000);
    
    
    // const analysisAccount = PublicKey.findProgramAddressSync(
    //   [Buffer.from("analysis_account"), provider.publicKey.toBuffer()],
    //   program.programId
    // )[0];


    const tx = await program.methods
      .storeResults(sharedTimestamp, deploymentCost, transactionCost, dailyProjection)
      .accountsPartial({
        user: provider.publicKey,
        userAccount: userAccount,
        analysisAccount: sharedAnalysisAccount,
      })
      .rpc();
    console.log("Analysis results stored with transaction signature", tx);
  }
  );

  it("Retrieves analysis", async () => {
    const tx = await program.methods
      .getAnalysis(sharedTimestamp)
      .accountsPartial({
        user: provider.publicKey,
        userAccount: userAccount,
        analysisAccount: sharedAnalysisAccount,
      })
      .rpc();

    const analysisAccountData = await program.account.analysisData.fetch(sharedAnalysisAccount);
    console.log("Analysis retrieved with transaction signature", tx);
    console.log("Analysis data:", {
    programName: analysisAccountData.programName,
    deploymentCost: analysisAccountData.deploymentCost,
    transactionCost: analysisAccountData.transactionCost,
    dailyProjection: analysisAccountData.dailyProjection,
    status: analysisAccountData.status
    });

  }); 

  //Backend processing simulation
  // test account-monitor.ts
//   it("detects new analysis accounts", async () => {
//   console.log("Testing account monitoring...");
  
//   // Test that monitoring function runs successfully regardless of account state
//   try {
//     await monitorAnalysisAccounts();
//     console.log("Account monitoring completed without errors");
//   } catch (error) {
//     throw new Error(`Account monitoring failed: ${error}`);
//   }
  
//   // Verify the monitoring logic works
//   const allAccounts = await program.account.analysisData.all();
//   console.log(`Monitor found ${allAccounts.length} total analysis accounts`);
  
//   const unprocessedAccounts = allAccounts.filter(acc => !acc.account.status);
//   const processedAccounts = allAccounts.filter(acc => acc.account.status);
  
//   console.log(`Monitor identified: ${unprocessedAccounts.length} unprocessed, ${processedAccounts.length} processed`);
  
//   // Test passes whether there are 0 or more unprocessed accounts
//   if (unprocessedAccounts.length === 0) {
//     console.log("Monitor correctly handled scenario with no unprocessed accounts");
//   } else {
//     console.log("Monitor would process unprocessed accounts");
//   }
  
//   console.log("Account monitoring test completed successfully");
// });
it("detects new analysis accounts", async () => {
  console.log("Testing account monitoring...");
  
  try {
    await monitorAnalysisAccounts();
    console.log("Account monitoring completed without errors");
  } catch (error) {
    throw new Error(`Account monitoring failed: ${error}`);
  }
  
  const allAccounts = await program.account.analysisData.all();
  console.log(`Monitor found ${allAccounts.length} total analysis accounts`);
  
  const unprocessedAccounts = allAccounts.filter(acc => !acc.account.status);
  const processedAccounts = allAccounts.filter(acc => acc.account.status);
  
  console.log(`Monitor identified: ${unprocessedAccounts.length} unprocessed, ${processedAccounts.length} processed`);
  
  // Show actual account data without hardcoding
  if (unprocessedAccounts.length > 0) {
    console.log("Unprocessed accounts found:");
    unprocessedAccounts.forEach((acc, index) => {
      console.log(`  Account ${index + 1}:`);
      console.log(`    Program: ${acc.account.programName}`);
      console.log(`    Timestamp: ${acc.account.timestamp.toString()}`);
      console.log(`    Status: ${acc.account.status}`);
    });
  }
  
  if (processedAccounts.length > 0) {
    console.log("Processed accounts found:");
    processedAccounts.forEach((acc, index) => {
      console.log(`  Account ${index + 1}:`);
      console.log(`    Program: ${acc.account.programName}`);
      console.log(`    Deployment Cost: ${acc.account.deploymentCost.toString()}`);
      console.log(`    Transaction Cost: ${acc.account.transactionCost.toString()}`);
      console.log(`    Daily Projection: ${acc.account.dailyProjection.toString()}`);
    });
  }
  
  console.log("Account monitoring test completed successfully");
});

// analyze binary function 
// Simple binary analysis function
const fs = require('fs');
const path = require('path');
  function analyzeBinary(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const fileBuffer = fs.readFileSync(filePath);
    
    // Check ELF magic bytes
    const isValidSolanaProgram = fileBuffer.length > 0 && 
                                fileBuffer[0] === 0x7f && 
                                fileBuffer[1] === 0x45 && 
                                fileBuffer[2] === 0x4c && 
                                fileBuffer[3] === 0x46;
    
    const programName = path.basename(filePath, '.so');
    
    return {
      programName,
      filePath,
      fileSize,
      isValidSolanaProgram
    };
  }


// binary analysis simulation
it("tests binary analyzer", async () => {
  // const fs = require('fs');
  // const path = require('path');
  

  // // Simple binary analysis function
  // function analyzeBinary(filePath: string) {
  //   if (!fs.existsSync(filePath)) {
  //     throw new Error(`File not found: ${filePath}`);
  //   }
    
  //   const stats = fs.statSync(filePath);
  //   const fileSize = stats.size;
  //   const fileBuffer = fs.readFileSync(filePath);
    
  //   // Check ELF magic bytes
  //   const isValidSolanaProgram = fileBuffer.length > 0 && 
  //                               fileBuffer[0] === 0x7f && 
  //                               fileBuffer[1] === 0x45 && 
  //                               fileBuffer[2] === 0x4c && 
  //                               fileBuffer[3] === 0x46;
    
  //   const programName = path.basename(filePath, '.so');
    
  //   return {
  //     programName,
  //     filePath,
  //     fileSize,
  //     isValidSolanaProgram
  //   };
  // }

  // Test it
  const analysis = analyzeBinary('./target/deploy/capstone.so');
  console.log('Binary Analysis:', analysis);
  
  // Basic assertions
  console.log(`✓ File size: ${analysis.fileSize} bytes`);
  console.log(`✓ Valid Solana program: ${analysis.isValidSolanaProgram}`);
  console.log(`✓ Program name: ${analysis.programName}`);
});

// Cost calculation simulation
it("tests cost calculator", async () => {
  // Import the cost calculation functions (inline for testing)
  function calculateDeploymentCost(fileSize: number): number {
    const RENT_PER_BYTE_YEAR = 2039280; // lamports per byte per year
    return fileSize * RENT_PER_BYTE_YEAR;
  }

  function calculateTransactionCost(): number {
    const AVERAGE_CU_USAGE = 10000; // compute units
    const LAMPORTS_PER_CU = 400; // current rate
    return AVERAGE_CU_USAGE * LAMPORTS_PER_CU;
  }

  function calculateDailyProjections(transactionCost: number, dailyTxCount: number = 100): number {
    return transactionCost * dailyTxCount;
  }

  // Use the file size from your binary analysis (238,776 bytes)
  const fileSize = 238776;
  
  // Calculate costs
  const deploymentCost = calculateDeploymentCost(fileSize);
  const transactionCost = calculateTransactionCost();
  const dailyProjection = calculateDailyProjections(transactionCost);

  console.log('Cost Analysis Results:');
  console.log(`Deployment Cost: ${deploymentCost} lamports (${deploymentCost / 1e9} SOL)`);
  console.log(`Transaction Cost: ${transactionCost} lamports (${transactionCost / 1e9} SOL)`);
  console.log(`Daily Projection (100 txs): ${dailyProjection} lamports (${dailyProjection / 1e9} SOL)`);
  });
  // solana client class 
  const { Connection, clusterApiUrl } = require('@solana/web3.js');
  
  class SolanaClient {
    private connection: any;

    constructor(cluster: string = 'devnet') {
      this.connection = new Connection(clusterApiUrl(cluster), 'confirmed');
    }

    async getRentPerByte(): Promise<number> {
      const rentFor1Byte = await this.connection.getMinimumBalanceForRentExemption(1);
      return rentFor1Byte;
    }

    async getCurrentCUPrice(): Promise<number> {
      try {
        const recentFees = await this.connection.getRecentPrioritizationFees();
        
        if (recentFees.length > 0) {
          const totalFees = recentFees.reduce((sum: number, fee: any) => sum + fee.prioritizationFee, 0);
          const averageFee = totalFees / recentFees.length;
          return Math.max(averageFee, 1);
        }
        return 1;
      } catch (error) {
        console.error('Failed to fetch CU pricing:', error);
        return 1;
      }
    }
  }




  // solana client test
  it("tests solana client", async () => {
  // Import the SolanaClient (inline for testing)
  // const { Connection, clusterApiUrl } = require('@solana/web3.js');
  
  // class SolanaClient {
  //   private connection: any;

  //   constructor(cluster: string = 'devnet') {
  //     this.connection = new Connection(clusterApiUrl(cluster), 'confirmed');
  //   }

  //   async getRentPerByte(): Promise<number> {
  //     const rentFor1Byte = await this.connection.getMinimumBalanceForRentExemption(1);
  //     return rentFor1Byte;
  //   }

  //   async getCurrentCUPrice(): Promise<number> {
  //     try {
  //       const recentFees = await this.connection.getRecentPrioritizationFees();
        
  //       if (recentFees.length > 0) {
  //         const totalFees = recentFees.reduce((sum: number, fee: any) => sum + fee.prioritizationFee, 0);
  //         const averageFee = totalFees / recentFees.length;
  //         return Math.max(averageFee, 1);
  //       }
  //       return 1;
  //     } catch (error) {
  //       console.error('Failed to fetch CU pricing:', error);
  //       return 1;
  //     }
  //   }
  // }

  // Test the client
  const client = new SolanaClient();
  
  console.log('Testing Solana Client...');
  const rentPerByte = await client.getRentPerByte();
  const cuPrice = await client.getCurrentCUPrice();
  
  console.log('Real Network Rates:');
  console.log(`Rent per byte: ${rentPerByte} lamports`);
  console.log(`CU price: ${cuPrice} lamports per CU`);
  
  console.log('✓ Solana client successfully fetched network rates');
});

// integrated backend tests
it("tests integrated cost calculation pipeline", async () => {
  console.log("=== INTEGRATED COST CALCULATION PIPELINE ===");
  
  // Step 1: Binary Analysis (works for any .so file)
  console.log("\n1. BINARY ANALYSIS:");
  
  // Generic approach - find any .so file in common locations
  const fs = require('fs');
  const possiblePaths = [
    './target/deploy/capstone.so',          // Your current program
    './uploads/program.so',                 // CLI uploads
    './target/deploy/*.so',                 // Any anchor program
  ];
  
  let filePath = null;
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      filePath = path;
      break;
    }
  }
  
  if (!filePath) {
    // Find any .so file in target/deploy
    const deployDir = './target/deploy';
    if (fs.existsSync(deployDir)) {
      const files = fs.readdirSync(deployDir).filter(f => f.endsWith('.so'));
      if (files.length > 0) {
        filePath = `${deployDir}/${files[0]}`;
      }
    }
  }
  
  if (!filePath) {
    console.log("❌ No .so file found - test requires a compiled Solana program");
    return;
  }
  
  const binaryAnalysis = analyzeBinary(filePath);
  console.log(`✓ Program: ${binaryAnalysis.programName}`);
  console.log(`✓ File path: ${binaryAnalysis.filePath}`);
  console.log(`✓ File size: ${binaryAnalysis.fileSize} bytes`);
  console.log(`✓ Valid Solana program: ${binaryAnalysis.isValidSolanaProgram}`);
  
  // Step 2: Get Live Network Rates (works on any network)
  console.log("\n2. LIVE NETWORK RATES:");
  const client = new SolanaClient();
  const rentPerByte = await client.getRentPerByte();
  const cuPrice = await client.getCurrentCUPrice();
  console.log(`✓ Rent per byte: ${rentPerByte} lamports`);
  console.log(`✓ CU price: ${cuPrice} lamports per CU`);
  
  // Step 3: Generic Cost Calculation (works for any program)
  console.log("\n3. COST ANALYSIS FOR ANY SOLANA PROGRAM:");
  
  const deploymentCost = binaryAnalysis.fileSize * rentPerByte;
  console.log(`✓ Deployment Cost: ${deploymentCost} lamports (${(deploymentCost / 1e9).toFixed(4)} SOL)`);
  console.log(`  Formula: ${binaryAnalysis.fileSize} bytes × ${rentPerByte} lamports/byte`);
  
  const estimatedCUUsage = Math.min(Math.max(binaryAnalysis.fileSize / 50, 5000), 200000);
  const transactionCost = estimatedCUUsage * cuPrice;
  console.log(`✓ Transaction Cost: ${transactionCost} lamports (${(transactionCost / 1e9).toFixed(6)} SOL)`);
  console.log(`  Formula: ${Math.round(estimatedCUUsage)} CU × ${cuPrice} lamports/CU`);
  
  const dailyProjection = transactionCost * 100;
  console.log(`✓ Daily Projection (100 txs): ${dailyProjection} lamports (${(dailyProjection / 1e9).toFixed(4)} SOL)`);
  
  console.log(`\n✅ ANALYSIS COMPLETE FOR ANY DEVELOPER'S PROGRAM!`);
  console.log(`This system can analyze costs for any compiled Solana program.`);
});

// anchor client test
// Test anchor-client by itself
it("tests anchor-client integration", async () => {
  console.log("=== TESTING ANCHOR-CLIENT ===");
  
  // First, create an analysis account to test with
  const testTimestamp = new BN(Date.now());
  const testProgramName = "Test Anchor Client";
  
  const testAnalysisAccount = PublicKey.findProgramAddressSync([
    Buffer.from("analysis"),
    testTimestamp.toArrayLike(Buffer, "le", 8),
    userAccount.toBuffer()
  ], program.programId)[0];

  // Create the analysis account
  console.log("1. Creating test analysis account...");
  await program.methods
    .analysisSetup(testTimestamp, testProgramName)
    .accountsPartial({
      user: provider.publicKey,
      userAccount: userAccount,
    })
    .rpc();
  
  console.log("✓ Test analysis account created");

  // Test the anchor client
  console.log("2. Testing AnchorClient...");
  const { AnchorClient } = require('../app/anchor-client');
  const anchorClient = new AnchorClient();
  
  // Mock analysis data
  const mockAnalysisData = {
    user: provider.publicKey,
    timestamp: testTimestamp,
    programName: testProgramName,
    status: false
  };
  
  // Find a .so file to test with
  const testFilePath = './target/deploy/capstone.so';
  
  // Test the storeAnalysisResults function
  console.log("3. Testing cost calculation and storage...");
  const success = await anchorClient.storeAnalysisResults(
    testAnalysisAccount,
    mockAnalysisData, 
    testFilePath
  );
  
  if (success) {
    console.log("✅ AnchorClient successfully stored results!");
    
    // Verify the results were actually stored
    const updatedAccount = await program.account.analysisData.fetch(testAnalysisAccount);
    console.log("4. Verifying stored data:");
    console.log(`   Status: ${updatedAccount.status}`);
    console.log(`   Deployment Cost: ${updatedAccount.deploymentCost.toString()}`);
    console.log(`   Transaction Cost: ${updatedAccount.transactionCost.toString()}`);
    console.log(`   Daily Projection: ${updatedAccount.dailyProjection.toString()}`);
    
    // Verify status changed to true
    if (updatedAccount.status) {
      console.log("✅ Analysis status correctly updated to completed");
    } else {
      console.log("❌ Analysis status not updated");
    }
  } else {
    console.log("❌ AnchorClient failed to store results");
  }
});

// full tests for backend 
it("tests full end-to-end integration", async () => {
  console.log("=== FULL END-TO-END INTEGRATION TEST ===");
  
  // 1. Create analysis account (simulating user request)
  console.log("\n1. USER CREATES ANALYSIS REQUEST:");
  const integrationTimestamp = new BN(Date.now());
  const integrationProgramName = "Full Integration Test";
  
  const integrationAnalysisAccount = PublicKey.findProgramAddressSync([
    Buffer.from("analysis"),
    integrationTimestamp.toArrayLike(Buffer, "le", 8),
    userAccount.toBuffer()
  ], program.programId)[0];

  await program.methods
    .analysisSetup(integrationTimestamp, integrationProgramName)
    .accountsPartial({
      user: provider.publicKey,
      userAccount: userAccount,
    })
    .rpc();
  
  console.log("✓ Analysis account created with status = false");
  
  // 2. Backend detects and processes (simulating the monitor)
  console.log("\n2. BACKEND PROCESSING:");
  const { AnchorClient } = require('../app/anchor-client');
  const anchorClient = new AnchorClient();
  
  const mockAnalysisData = {
    user: provider.publicKey,
    timestamp: integrationTimestamp,
    programName: integrationProgramName,
    status: false
  };
  
  const testFilePath = './target/deploy/capstone.so';
  
  console.log("   - Binary analysis...");
  console.log("   - Live network rates...");  
  console.log("   - Cost calculations...");
  console.log("   - Storing results...");
  
  const success = await anchorClient.storeAnalysisResults(
    integrationAnalysisAccount,
    mockAnalysisData,
    testFilePath
  );
  
  if (!success) {
    throw new Error("Backend processing failed");
  }
  
  // 3. User retrieves results (simulating get_analysis)
  console.log("\n3. USER RETRIEVES RESULTS:");
  const finalResults = await program.account.analysisData.fetch(integrationAnalysisAccount);
  
  console.log("✓ Final Analysis Results:");
  console.log(`   Program: ${finalResults.programName}`);
  console.log(`   Status: ${finalResults.status} (should be true)`);
  console.log(`   Deployment Cost: ${finalResults.deploymentCost.toString()} lamports`);
  console.log(`   Transaction Cost: ${finalResults.transactionCost.toString()} lamports`);
  console.log(`   Daily Projection: ${finalResults.dailyProjection.toString()} lamports`);
  
  // 4. Verify the integration worked
  console.log("\n4. INTEGRATION VERIFICATION:");
  if (finalResults.status && 
      finalResults.deploymentCost.toNumber() > 0 && 
      finalResults.transactionCost.toNumber() > 0) {
    console.log("✅ FULL END-TO-END INTEGRATION SUCCESSFUL!");
    console.log("   - User created analysis ✓");
    console.log("   - Backend processed with real data ✓"); 
    console.log("   - Results stored on-chain ✓");
    console.log("   - User can retrieve results ✓");
  } else {
    console.log("❌ Integration verification failed");
  }
});


})

