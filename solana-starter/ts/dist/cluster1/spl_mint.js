"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const turbin3_wallet_json_1 = __importDefault(require("./wallet/turbin3_wallet.json"));
// Import our keypair from the wallet file
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(turbin3_wallet_json_1.default));
//Create a Solana devnet connection
const commitment = "confirmed";
const connection = new web3_js_1.Connection("https://api.devnet.solana.com", commitment);
const token_decimals = 1000000n;
// Mint address
const mint = new web3_js_1.PublicKey("Goy7V5mYwS63GT9piLbnQMj5J6x7bAw9BQ23Hd8oCVap");
(async () => {
    try {
        // Create an ATA
        const ata = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);
        // Mint to ATA
        const mintTx = await (0, spl_token_1.mintTo)(connection, keypair, mint, ata.address, keypair.publicKey, 1n * token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
    }
    catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();
