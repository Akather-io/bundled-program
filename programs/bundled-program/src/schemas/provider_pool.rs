use crate::{constants::*, errors::ErrorMessages};
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct ProviderPool {
    pub admin: Pubkey,
    pub expired_at: i64,
    pub fee: u64,
    pub share: u64,
    pub j_probability: JudgementLevel,
    pub j_return: JudgementLevel,
    pub j_cost: JudgementLevel,
}

#[derive(AnchorDeserialize, AnchorSerialize, PartialEq, Eq, Clone, Copy)]
pub enum JudgementLevel {
    HIGH,
    MEDIUM,
    LOW,
}

impl From<u8> for JudgementLevel {
    fn from(val: u8) -> Self {
        match val {
            0 => JudgementLevel::HIGH,
            1 => JudgementLevel::MEDIUM,
            2 => JudgementLevel::LOW,
            _ => panic!("Invalid CurrencyType"),
        }
    }
}

impl Default for JudgementLevel {
    fn default() -> Self {
        JudgementLevel::HIGH
    }
}

impl ProviderPool {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH
        + I64_SIZE
        + U64_SIZE
        + U64_SIZE
        + ENUM_SIZE
        + ENUM_SIZE
        + ENUM_SIZE;

    pub fn init(
        &mut self,
        admin: Pubkey,
        expired_at: i64,
        fee: u64,
        share: u64,
        j_probability: JudgementLevel,
        j_return: JudgementLevel,
        j_cost: JudgementLevel,
    ) -> Result<()> {
        require!(
            self.admin == Pubkey::default(),
            ErrorMessages::AlreadyInitialized
        );
        self.admin = admin;
        self.expired_at = expired_at;
        self.fee = fee;
        self.share = share;
        self.j_probability = j_probability;
        self.j_return = j_return;
        self.j_cost = j_cost;
        Ok(())
    }
}
