import * as anchor from "@coral-xyz/anchor";
import { AnchorError, Program } from "@coral-xyz/anchor";
import { BundledProgram } from "../target/types/bundled_program";
import {
  USDC_MINT,
  findProviderPoolAccount,
  findStrategiesAccount,
  findSystemAccount,
  findUsdcTokenAccount,
  findUserPoolAccount,
} from "./utils";
import { expect, use } from "chai";
import * as chaibn from "chai-bn";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID, associatedAddress } from "@coral-xyz/anchor/dist/cjs/utils/token";
use(chaibn.default(anchor.BN));

describe("bundled-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BundledProgram as Program<BundledProgram>;
  const myWallet = anchor.Wallet.local();

  it("Is initialized!", async () => {
    const [systemAccount] = findSystemAccount(program.programId);
    const tx = await program.methods
      .initialize()
      .accounts({
        system: systemAccount,
        authority: myWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();
    // console.log("Your transaction signature", tx);
  });
  it("Cannot re-initialized!", async () => {
    const [systemAccount] = findSystemAccount(program.programId);
    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          system: systemAccount,
          authority: myWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      // console.log("Your transaction signature", tx);
    } catch (error) {
      expect(error).to.be.instanceOf(AnchorError);
      expect((error as AnchorError).error.errorCode.code).to.equal(
        "AlreadyInitialized"
      );
    }
  });
  it("Can create provider pool!", async () => {
    const [pool] = findProviderPoolAccount(
      program.programId,
      myWallet.publicKey
    );
    const [usdc_pool] = findUsdcTokenAccount(pool)
    const [strategiesAccount] = findStrategiesAccount(program.programId, pool);
    const expired_at = new anchor.BN(Math.floor(Date.now() / 1000));
    const fee = new anchor.BN(1);
    const share = new anchor.BN(500);
    const j_probability = 0;
    const j_return = 1;
    const j_cost = 2;
    const strategies = [
      {
        tokenSymbol: "BTC",
        weight: 50,
        longCall: {
          strikePrice: new anchor.BN(100),
          portion: 20,
        },
        shortCall: {
          strikePrice: new anchor.BN(100),
          portion: 30,
        },
        longPut: {
          strikePrice: new anchor.BN(100),
          portion: 30,
        },
        shortPut: {
          strikePrice: new anchor.BN(100),
          portion: 20,
        },
      },
      {
        tokenSymbol: "ETH",
        weight: 50,
        longCall: {
          strikePrice: new anchor.BN(100),
          portion: 30,
        },
        shortCall: {
          strikePrice: new anchor.BN(100),
          portion: 25,
        },
        longPut: {
          strikePrice: new anchor.BN(100),
          portion: 25,
        },
        shortPut: {
          strikePrice: new anchor.BN(100),
          portion: 20,
        },
      },
    ];

    const tx = await program.methods
      .createProviderPool(
        expired_at,
        fee,
        share,
        j_probability,
        j_return,
        j_cost,
        strategies
      )
      .accounts({
        pool,
        auth: myWallet.publicKey,
        strageties: strategiesAccount,
        usdcMint: USDC_MINT,
        usdcPoolTokenAccount: usdc_pool,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      })
      .rpc();

    const poolAccount = await program.account.providerPool.fetch(pool);

    expect(poolAccount.admin.toBase58()).to.equal(
      myWallet.publicKey.toBase58()
    );

    expect(poolAccount.fee).to.be.a.bignumber.that.equal(fee);
    expect(poolAccount.expiredAt).to.be.a.bignumber.that.equal(expired_at);

    expect(poolAccount.share).to.be.a.bignumber.that.equal(share);
  });

  it("User can join pool!", async () => {
    const [pool] = findProviderPoolAccount(
      program.programId,
      myWallet.publicKey
    );
    const [usdc_pool] = findUsdcTokenAccount(pool)
    const [strategiesAccount] = findStrategiesAccount(program.programId, pool);
    const expired_at = new anchor.BN(Math.floor(Date.now() / 1000));
    const fee = new anchor.BN(1);
    const share = new anchor.BN(500);
    const j_probability = 0;
    const j_return = 1;
    const j_cost = 2;
    const strategies = [
      {
        tokenSymbol: "BTC",
        weight: 50,
        longCall: {
          strikePrice: new anchor.BN(100),
          portion: 20,
        },
        shortCall: {
          strikePrice: new anchor.BN(100),
          portion: 30,
        },
        longPut: {
          strikePrice: new anchor.BN(100),
          portion: 30,
        },
        shortPut: {
          strikePrice: new anchor.BN(100),
          portion: 20,
        },
      },
      {
        tokenSymbol: "ETH",
        weight: 50,
        longCall: {
          strikePrice: new anchor.BN(100),
          portion: 30,
        },
        shortCall: {
          strikePrice: new anchor.BN(100),
          portion: 25,
        },
        longPut: {
          strikePrice: new anchor.BN(100),
          portion: 25,
        },
        shortPut: {
          strikePrice: new anchor.BN(100),
          portion: 20,
        },
      },
    ];

    await program.methods
      .createProviderPool(
        expired_at,
        fee,
        share,
        j_probability,
        j_return,
        j_cost,
        strategies
      )
      .accounts({
        pool,
        auth: myWallet.publicKey,
        strageties: strategiesAccount,
        usdcMint: USDC_MINT,
        usdcPoolTokenAccount: usdc_pool,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      })
      .rpc();

    const poolAccount = await program.account.providerPool.fetch(pool);

    const [usdc_user] = findUsdcTokenAccount(myWallet.publicKey)
    const amount = new anchor.BN(2).mul(new anchor.BN(10).pow(new anchor.BN(9)))
    const [user_pool] = findUserPoolAccount(program.programId, pool, myWallet.publicKey)
    await program.methods.join(1, amount).accounts({
      pool,
      usdcMint: USDC_MINT,
      usdcUserTokenAccount: usdc_user,
      usdcPoolTokenAccount: usdc_pool,
      userPool: user_pool,
      auth: myWallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY
    })
  });
});
