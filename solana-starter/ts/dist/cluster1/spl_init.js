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
(async () => {
    try {
        // Start here
        // const mint = ???
        // create a new token mint
        const mint = await (0, spl_token_1.createMint)(connection, keypair, keypair.publicKey, null, 6);
        // console log the mint id
        console.log('Mint Address: ', mint);
    }
    catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();
