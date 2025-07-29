"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const wba_vault_1 = require("./programs/wba_vault");
const turbin3_wallet_json_1 = __importDefault(require("./wallet/turbin3_wallet.json"));
// Import our keypair from the wallet file
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(turbin3_wallet_json_1.default));
// Commitment
const commitment = "finalized";
// Create a devnet connection
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
// Create our anchor provider
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(keypair), {
    commitment,
});
// Create our program
const program = new anchor_1.Program(wba_vault_1.IDL, "<address>", provider);
// Create a random keypair
const vaultState = new web3_js_1.PublicKey("<address>");
// Create the PDA for our enrollment account
// const vaultAuth = ???
// Create the vault key
// const vault = ???
// Execute our enrollment transaction
(async () => {
    try {
        // const signature = await program.methods
        // .deposit(new BN(<number>)    )
        // .accounts({
        //    ???
        // })
        // .signers([
        //     keypair
        // ]).rpc();
        // console.log(`Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
