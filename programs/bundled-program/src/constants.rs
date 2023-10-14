use anchor_lang::prelude::*;

pub const DISCRIMINATOR_LENGTH: usize = std::mem::size_of::<u64>(); //8
pub const PUBLIC_KEY_LENGTH: usize = std::mem::size_of::<Pubkey>(); //32
pub const TIMESTAMP_LENGTH: usize = std::mem::size_of::<i64>(); //8

pub const STRING_LENGTH_PREFIX: usize = 4;
pub const BOOL_SIZE: usize = std::mem::size_of::<bool>();
pub const I64_SIZE: usize = std::mem::size_of::<i64>();
pub const U64_SIZE: usize = std::mem::size_of::<u64>();
pub const U8_SIZE: usize = std::mem::size_of::<u8>();
pub const STATUS_ENUM_SIZE: usize = 1 + std::mem::size_of::<u8>();

pub const SYSTEM_SEED: &[u8] = b"SYSTEM";
