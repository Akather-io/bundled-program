import * as anchor from "@coral-xyz/anchor";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

export function findSystemAccount(programId: anchor.web3.PublicKey) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("SYSTEM")],
    programId
  );
}

export function findProviderPoolAccount(
  programId: anchor.web3.PublicKey,
  provider: anchor.web3.PublicKey
) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PROVIDER_POOL"), provider.toBuffer()],
    programId
  );
}

export function findStrategiesAccount(
  programId: anchor.web3.PublicKey,
  pool: anchor.web3.PublicKey
) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("STRATEGIES"), pool.toBuffer()],
    programId
  );
}
export const USDC_MINT = new anchor.web3.PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr')
export function findUsdcTokenAccount(
  user: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey = USDC_MINT
) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      user.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer()
    ],
    ASSOCIATED_PROGRAM_ID
  );
}
