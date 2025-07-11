import wallet from "./wallet/turbin3_wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

//umi.use(irysUploader({address: "https://devnet.irys.xyz/"}));
umi.use(irysUploader()); // setting plug in of irys
umi.use(signerIdentity(signer)); // setting the signer 

(async () => {
    try {
        //1. Load image

        const image = await readFile("/home/garcoyle/solana-starter/ts/cluster1/images/generug.png")

        //2. Convert image to generic file.
        const genericFile = createGenericFile(image, "random.png", {contentType: "image/png"}) // creates a buffer file (byte array)
        //3. Upload image

        const [myUri] = await umi.uploader.upload([genericFile]) //in array format
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
