"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const turbin3_wallet_json_1 = __importDefault(require("./wallet/turbin3_wallet.json"));
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const umi_uploader_irys_1 = require("@metaplex-foundation/umi-uploader-irys");
// Create a devnet connection
const umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com');
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(turbin3_wallet_json_1.default));
const signer = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_uploader_irys_1.irysUploader)());
umi.use((0, umi_1.signerIdentity)(signer));
(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
        // const image = ???
        // const metadata = {
        //     name: "?",
        //     symbol: "?",
        //     description: "?",
        //     image: "?",
        //     attributes: [
        //         {trait_type: '?', value: '?'}
        //     ],
        //     properties: {
        //         files: [
        //             {
        //                 type: "image/png",
        //                 uri: "?"
        //             },
        //         ]
        //     },
        //     creators: []
        // };
        // const myUri = ???
        // console.log("Your metadata URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
