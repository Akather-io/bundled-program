import * as anchor from "@coral-xyz/anchor";

export function findSystemAccount(programId: anchor.web3.PublicKey) {
    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('SYSTEM')],
        programId
    )
}