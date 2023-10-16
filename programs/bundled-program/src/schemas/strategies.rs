use crate::{constants::*, errors::ErrorMessages};
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Strategies {
    pool: Pubkey,
    strategies: Vec<Strategy>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct Strategy {
    pub token_symbol: String,
    pub weight: u8,
    pub long_call: Option<StrategyCall>,
    pub short_call: Option<StrategyCall>,
    pub long_put: Option<StrategyCall>,
    pub short_put: Option<StrategyCall>,
}

impl Strategy {
    pub const LEN: usize = STRING_LENGTH_PREFIX
        + SYMBOL_MAX_LENGTH
        + U8_SIZE
        + (4 * std::mem::size_of::<Option<StrategyCall>>());
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct StrategyCall {
    pub strike_price: u64,
    pub portion: u8,
}

impl StrategyCall {
    pub const LEN: usize = U64_SIZE + U8_SIZE;
}

impl Strategies {
    pub const LEN: usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + VECTOR_OVERHEAD_SIZE;
    pub fn calculate_size(size: u8) -> usize {
        Strategies::LEN + (size as usize * Strategy::LEN)
    }
    pub fn init(&mut self, pool: Pubkey, strategies: Vec<Strategy>) -> Result<()> {
        require!(
            self.pool == Pubkey::default(),
            ErrorMessages::AlreadyInitialized
        );
        self.pool = pool;
        self.strategies = strategies;
        Ok(())
    }
}
