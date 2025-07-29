"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const wba_vault_1 = require("./programs/wba_vault");
const turbin3_wallet_json_1 = __importDefault(require("./wallet/turbin3_wallet.json"));
/// J8qKEmQpadFeBuXAVseH8GNrvsyBhMT8MHSVD3enRgJz
// Import our keypair from the wallet file
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(turbin3_wallet_json_1.default));
// Commitment
const commitment = "confirmed";
// Create a devnet connection
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
// Create our anchor provider
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(keypair), {
    commitment,
});
// Create our program
const program = new anchor_1.Program(wba_vault_1.IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o", provider);
// Create a random keypair
const vaultState = web3_js_1.Keypair.generate();
console.log(`Vault public key: ${vaultState.publicKey.toBase58()}`);
// Create the PDA for our enrollment account
// Seeds are "auth", vaultState
// const vaultAuth = ???
// Create the vault key
// Seeds are "vault", vaultAuth
// const vault = ???
// Execute our enrollment transaction
(async () => {
    try {
        // const signature = await program.methods.initialize()
        // .accounts({
        //     ???
        // }).signers([keypair, vaultState]).rpc();
        // console.log(`Init success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
