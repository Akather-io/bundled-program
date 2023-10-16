use anchor_lang::prelude::*;

pub const DISCRIMINATOR_LENGTH: usize = std::mem::size_of::<u64>(); //8
pub const PUBLIC_KEY_LENGTH: usize = std::mem::size_of::<Pubkey>(); //32
pub const TIMESTAMP_LENGTH: usize = std::mem::size_of::<i64>(); //8

pub const STRING_LENGTH_PREFIX: usize = 4;
pub const BOOL_SIZE: usize = std::mem::size_of::<bool>();
pub const I64_SIZE: usize = std::mem::size_of::<i64>();
pub const U64_SIZE: usize = std::mem::size_of::<u64>();
pub const U8_SIZE: usize = std::mem::size_of::<u8>();
pub const ENUM_SIZE: usize = 1 + std::mem::size_of::<u8>();
pub const VECTOR_OVERHEAD_SIZE: usize = 4;

pub const SYSTEM_SEED: &[u8] = b"SYSTEM";
pub const PROVIDER_POOL_SEED: &[u8] = b"PROVIDER_POOL";
pub const STRATEGIES_SEED: &[u8] = b"STRATEGIES";
pub const USER_POOL_SEED: &[u8] = b"USER_POOL";
pub const SYMBOL_MAX_LENGTH: usize = 5;
