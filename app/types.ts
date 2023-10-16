import { IdlAccounts, Idl, BN } from "@coral-xyz/anchor";
import { IdlEvent } from "@coral-xyz/anchor/dist/cjs/idl";
import {
    IdlTypes,
    TypeDef,
} from "@coral-xyz/anchor/dist/cjs/program/namespace/types";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import { BundledProgram } from "../target/types/bundled_program";

export type BundledProgramIdl = BundledProgram;

export type AnchorWallet = Wallet;

export type ClanType = IdlAccounts<BundledProgramIdl>["providerPool"];

type TypeDefDictionary<T extends IdlEvent[], Defined> = {
    [K in T[number]["name"]]: TypeDef<
        {
            name: K;
            type: {
                kind: "struct";
                fields: Extract<T[number], { name: K }>["fields"];
            };
        },
        Defined
    >;
};
type IdlEvents<T extends Idl> = TypeDefDictionary<
    NonNullable<T["events"]>,
    Record<string, never>
>;
export type SolclanProgEvents = IdlEvents<BundledProgramIdl>;