"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const turbin3_wallet_json_1 = __importDefault(require("./wallet/turbin3_wallet.json"));
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
// Define our Mint address
const mint = (0, umi_1.publicKey)("Goy7V5mYwS63GT9piLbnQMj5J6x7bAw9BQ23Hd8oCVap");
// Create a UMI connection
const umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(turbin3_wallet_json_1.default));
const signer = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_1.signerIdentity)((0, umi_1.createSignerFromKeypair)(umi, keypair)));
(async () => {
    try {
        // Start here
        let accounts = {}
            ??  ?
            :
        ;
    }
    // let data: DataV2Args = {
    //     ???
    // }
    // let args: CreateMetadataAccountV3InstructionArgs = {
    //     ???
    // }
    // let tx = createMetadataAccountV3(
    //     umi,
    //     {
    //         ...accounts,
    //         ...args
    //     }
    // )
    // let result = await tx.sendAndConfirm(umi);
    // console.log(bs58.encode(result.signature));
    finally {
    }
    // let data: DataV2Args = {
    //     ???
    // }
    // let args: CreateMetadataAccountV3InstructionArgs = {
    //     ???
    // }
    // let tx = createMetadataAccountV3(
    //     umi,
    //     {
    //         ...accounts,
    //         ...args
    //     }
    // )
    // let result = await tx.sendAndConfirm(umi);
    // console.log(bs58.encode(result.signature));
});
try { }
catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
}
();
