import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Capstone } from "../target/types/capstone";

describe("capstone", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.capstone as Program<Capstone>;

  // it("Is initialized!", async () => {
  //   // Add your test here.

  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });

  it("Creates user account", async () => {
    const userAccount = anchor.web3.Keypair.generate();
    const tx = await program.methods
      // Replace 'requestAnalysis' with the correct method name as defined in your IDL, e.g. 'initialize'
      .initialize()
      .accounts({
        user: anchor.AnchorProvider.env().wallet.publicKey,
        userAccount: userAccount.publicKey,
      })
      .rpc();
    console.log("User account created with transaction signature", tx);
  }
);});
