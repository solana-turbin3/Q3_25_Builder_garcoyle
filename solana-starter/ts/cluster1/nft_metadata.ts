import wallet from "./wallet/turbin3_wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://gateway.irys.xyz/Ato8ZC5y9icdrnEZZQVdbs4Hu65xoBXKj81MHjpU1dbk"
        const metadata = {
            name: "turbin-rug",
            symbol: "TRBR",
            description: "rug",
            image: "https://gateway.irys.xyz/Ato8ZC5y9icdrnEZZQVdbs4Hu65xoBXKj81MHjpU1dbk",
            attributes: [
                {trait_type: 'color', value: 'purple'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://gateway.irys.xyz/Ato8ZC5y9icdrnEZZQVdbs4Hu65xoBXKj81MHjpU1dbk"
                    },
                ]
            },
            creators: [{address: keypair.publicKey, share: 100}]
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
