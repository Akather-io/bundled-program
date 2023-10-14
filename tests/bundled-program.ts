import * as anchor from "@coral-xyz/anchor";
import { AnchorError, Program } from "@coral-xyz/anchor";
import { BundledProgram } from "../target/types/bundled_program";
import { findSystemAccount } from "./utils";
import { expect } from "chai";

describe("bundled-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BundledProgram as Program<BundledProgram>;
  const myWallet = anchor.Wallet.local();

  it("Is initialized!", async () => {
    const [systemAccount] = findSystemAccount(program.programId);
    const tx = await program.methods.initialize()
      .accounts({
        system: systemAccount,
        authority: myWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
  it("Cannot re-initialized!", async () => {
    const [systemAccount] = findSystemAccount(program.programId);
    try {
      const tx = await program.methods.initialize()
        .accounts({
          system: systemAccount,
          authority: myWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      console.log("Your transaction signature", tx);
    } catch (error) {
      expect(error).to.be.instanceOf(AnchorError);
      expect((error as AnchorError).error.errorCode.code).to.equal(
        "AlreadyInitialized"
      );
    }

  });

});
