use anchor_lang::prelude::*;

pub mod constants;

pub mod instructions;
pub mod schemas;

pub use instructions::*;
pub use schemas::*;

pub mod errors;
pub use errors::*;

declare_id!("HzJPfyiji8iDsZq3PqDqnaKRL9ZnjubzkpjHzxgoEuUN");

#[program]
pub mod bundled_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }
}
