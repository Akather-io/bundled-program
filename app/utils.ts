import * as web3 from "@solana/web3.js";
import * as fs from "fs";
import dotenv from "dotenv";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { Wallet } from "@coral-xyz/anchor";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { DEFAULT_RPC_ENDPOINT } from "./constants";

dotenv.config({ path: "./app/.env.local" });


const connection = new web3.Connection(DEFAULT_RPC_ENDPOINT, "confirmed");

import wallet from '/home/leo/.config/solana/id.json'
const SIGNER_WALLET = web3.Keypair.fromSecretKey(new Uint8Array(wallet));

export const masterWallet = new Wallet(SIGNER_WALLET);

export async function initializeKeypair(
    connection: web3.Connection,
    keyName?: String
): Promise<web3.Keypair> {
    if (keyName || !process.env.PRIVATE_KEY) {
        console.log("Creating .env file");
        const signer = web3.Keypair.generate();
        fs.writeFileSync(
            keyName ? `app/${keyName}.json` : "app/.env.local",
            keyName
                ? `[${signer.secretKey.toString()}]`
                : `PRIVATE_KEY=[${signer.secretKey.toString()}]`
        );
        await airdropSolIfNeeded(signer, connection);

        return signer;
    }

    console.log("Initializing keypair");

    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);

    console.log("Public key:", keypairFromSecretKey.publicKey.toBase58());

    await airdropSolIfNeeded(keypairFromSecretKey, connection);
    return keypairFromSecretKey;
}

export function keypairFromKeyName(keyName: String) {
    const key = require(`./${keyName}.json`);

    const secret = key as number[];
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
    return keypairFromSecretKey;
}

export async function airdropSolIfNeeded(
    signer: web3.Keypair,
    connection: web3.Connection
) {
    const balance = await connection.getBalance(signer.publicKey);
    console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);

    if (balance < 1 * web3.LAMPORTS_PER_SOL) {
        console.log("Airdropping 2 SOL...");
        const airdropSignature = await connection.requestAirdrop(
            signer.publicKey,
            1 * web3.LAMPORTS_PER_SOL
        );

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature,
        });

        const newBalance = await connection.getBalance(signer.publicKey);
        console.log("New balance is", newBalance / web3.LAMPORTS_PER_SOL);
    }
}

export function getTxUrl(tx) {
    return `https://solana.fm/tx/${tx}?cluster=devnet-solana`;
}

export const sleepTX = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));


export function findSystemAccount(programId: web3.PublicKey) {
    return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("SYSTEM")],
        programId
    );
}

export function findProviderPoolAccount(
    programId: web3.PublicKey,
    provider: web3.PublicKey
) {
    return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("PROVIDER_POOL"), provider.toBuffer()],
        programId
    );
}

export function findStrategiesAccount(
    programId: web3.PublicKey,
    pool: web3.PublicKey
) {
    return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("STRATEGIES"), pool.toBuffer()],
        programId
    );
}
export const USDC_MINT = new web3.PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr')
export function findUsdcTokenAccount(
    user: web3.PublicKey,
    mint: web3.PublicKey = USDC_MINT
) {
    return web3.PublicKey.findProgramAddressSync(
        [
            user.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mint.toBuffer()
        ],
        ASSOCIATED_PROGRAM_ID
    );
}

export async function createTokenMint(creator: Wallet, to: web3.PublicKey, amount = 1000000) {
    const mint = await createMint(
        connection,
        creator.payer,
        creator.publicKey,
        null,
        9
    );

    console.log("Mint created: ", mint.toBase58());


    //   const tokenAccount = await mint.createAccount(anchorWallet.publicKey);
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        creator.payer,
        mint,
        to
    );

    console.log("Token account created: ", tokenAccount.address.toBase58());


    await mintTo(
        connection,
        creator.payer,
        mint,
        tokenAccount.address,
        creator.payer,
        100000000000
    );

    console.log(`Token minted to ${tokenAccount.address.toBase58()}`);

    return mint;
}
