use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorMessages {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Already initialized")]
    AlreadyInitialized,
    #[msg("Invalid option number")]
    InvalidOptionNumber,
}
