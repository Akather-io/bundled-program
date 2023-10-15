import * as anchor from "@coral-xyz/anchor";

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
