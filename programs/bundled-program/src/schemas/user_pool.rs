use crate::{constants::*, errors::ErrorMessages};
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserPool {
    pub pool: Pubkey,
    pub opt_num: u8,
    pub deposited: bool,
}

impl UserPool {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + U8_SIZE + BOOL_SIZE;
    pub fn init(&mut self, pool: Pubkey, opt_num: u8, deposited: bool) -> Result<()> {
        require!(pool == Pubkey::default(), ErrorMessages::AlreadyInitialized);
        self.pool = pool;
        self.opt_num = opt_num;
        self.deposited = deposited;
        Ok(())
    }
}
