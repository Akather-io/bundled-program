use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct SystemSetting {
    pub admin: Pubkey,
    pub initialized: bool,
}

impl SystemSetting {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + BOOL_SIZE;
}
