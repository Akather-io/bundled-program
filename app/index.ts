import {
    AnchorProvider,
    BN,
    Program,
    Wallet,
    web3,
} from "@coral-xyz/anchor";
import { DEFAULT_IDL, DEFAULT_PROGRAM_ID, DEFAULT_RPC_ENDPOINT } from "./constants";
import { AnchorWallet, BundledProgramIdl } from "./types";
import { createTokenMint, findProviderPoolAccount, findStrategiesAccount, findUsdcTokenAccount, masterWallet } from "./utils";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID, associatedAddress } from "@coral-xyz/anchor/dist/cjs/utils/token";

const connection = new web3.Connection(DEFAULT_RPC_ENDPOINT, "confirmed");

const inititalState = (
    wallet: web3.Keypair,
    programId: string = DEFAULT_PROGRAM_ID
) => {
    const anchorWallet = new Wallet(wallet) as AnchorWallet;
    const provider = new AnchorProvider(connection, anchorWallet, {
        commitment: "confirmed",
        skipPreflight: true,
    });
    const program = new Program<BundledProgramIdl>(DEFAULT_IDL, programId, provider);
    console.log("State initialized");

    return { provider, program, anchorWallet };
};
async function createProviderPool(wallet: web3.Keypair, mint: web3.PublicKey) {
    const { program } = inititalState(wallet);
    const expired_at = new BN(Math.floor(Date.now() / 1000));
    const fee = new BN(1);
    const share = new BN(500);
    const j_probability = 0;
    const j_return = 1;
    const j_cost = 2;
    const strategies = [
        {
            tokenSymbol: "BTC",
            weight: 50,
            longCall: {
                strikePrice: new BN(100),
                portion: 20,
            },
            shortCall: {
                strikePrice: new BN(100),
                portion: 30,
            },
            longPut: {
                strikePrice: new BN(100),
                portion: 30,
            },
            shortPut: {
                strikePrice: new BN(100),
                portion: 20,
            },
        },
        {
            tokenSymbol: "ETH",
            weight: 50,
            longCall: {
                strikePrice: new BN(100),
                portion: 30,
            },
            shortCall: {
                strikePrice: new BN(100),
                portion: 25,
            },
            longPut: {
                strikePrice: new BN(100),
                portion: 25,
            },
            shortPut: {
                strikePrice: new BN(100),
                portion: 20,
            },
        },
    ];

    const [pool] = findProviderPoolAccount(
        program.programId,
        wallet.publicKey
    );
    const [usdc_pool] = findUsdcTokenAccount(pool, mint)
    const [strategiesAccount] = findStrategiesAccount(program.programId, pool);

    console.log(pool.toBase58())
    console.log(usdc_pool.toBase58())
    console.log(strategiesAccount.toBase58())

    const tx = await program.methods.createProviderPool(
        expired_at,
        fee,
        share,
        j_probability,
        j_return,
        j_cost,
        strategies
    ).accounts({
        pool,
        auth: wallet.publicKey,
        strageties: strategiesAccount,
        usdcMint: mint,
        usdcPoolTokenAccount: usdc_pool,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY
    }).signers([wallet]).rpc()

    console.log(tx)

}
(async () => {
    // console.log(masterWallet.publicKey.toBase58())
    // const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);
    const mint = new web3.PublicKey('DoaUN9wst4qBUzAnCAUh6GeoJ6B2tByiKP3vcRLcCdPX');
    console.log(mint.toBase58())

    await createProviderPool(masterWallet.payer, mint)

})()