import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Capstone } from "../target/types/capstone";
import * as anchor from "@coral-xyz/anchor";
import { AnchorClient } from "./anchor-client";

const anchorClient = new AnchorClient();
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const provider = AnchorProvider.env();
const program = anchor.workspace.Capstone as Program<Capstone>;

export async function monitorAnalysisAccounts() {
  // Use the simpler approach - get all analysis accounts directly
  const analysisAccounts = await program.account.analysisData.all();

  console.log(`Found ${analysisAccounts.length} analysis accounts`);
  
  // Check each account
  for (const account of analysisAccounts) {
    try {
      // Check if analysis needs processing (status = false)
      if (!account.account.status) {
        console.log(`Found unprocessed analysis: ${account.publicKey.toBase58()}`);
        console.log("Analysis Data:", account.account);
        
        // Start your backend processing here
        await processAnalysis(account.publicKey, account.account);
      }
    } catch (error) {
      console.log(`Could not process analysis data for ${account.publicKey.toBase58()}`);
    }
  }
}
async function processAnalysis(accountPubkey: PublicKey, analysisData: any) {
  console.log(`Processing analysis for account: ${accountPubkey.toBase58()}`);
  
  try {
    // 1. Find the program file (keep your existing logic)
    const programName = analysisData.programName;
    const timestamp = analysisData.timestamp;
    
    const possiblePaths = [
      `./uploads/analysis_${timestamp}.so`,
      `./uploads/${programName}.so`,
      `./target/deploy/${programName}.so`,
      `./programs/${programName}/target/deploy/${programName}.so`
    ];
    
    const fs = require('fs');
    let filePath = null;
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        filePath = path;
        break;
      }
    }
    
    if (!filePath) {
      console.error(`No .so file found for ${programName}. Checked:`, possiblePaths);
      return;
    }
    
    console.log(`Found file: ${filePath}`);
    
    // 2. Use AnchorClient instead of manual cost calculation
    const success = await anchorClient.storeAnalysisResults(
      accountPubkey, 
      analysisData, 
      filePath
    );
    
    if (success) {
      console.log(`✅ Full backend processing complete for ${programName}`);
    } else {
      console.error(`❌ Backend processing failed for ${programName}`);
    }
    
  } catch (error) {
    console.error(`❌ Failed to process analysis: ${error}`);
  }
}

// Subscribe to all program account changes
const subscriptionId = connection.onProgramAccountChange(
  program.programId,
  (keyedAccountInfo, context) => {
    console.log("Program account changed:", keyedAccountInfo.accountId.toBase58());
    // Only process if it's an analysis account that changed
    checkSpecificAccount(keyedAccountInfo.accountId);
  },
  {
    commitment: "confirmed",
    encoding: "base64"
  }
);

async function checkSpecificAccount(accountId: PublicKey) {
  try {
    const analysisData = await program.account.analysisData.fetch(accountId);
    if (!analysisData.status) {
      console.log(`New unprocessed analysis detected: ${accountId.toBase58()}`);
      await processAnalysis(accountId, analysisData);
    }
  } catch (error) {
    // Not an analysis account, ignore
  }
}