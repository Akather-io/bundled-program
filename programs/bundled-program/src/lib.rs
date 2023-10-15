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

    pub fn create_provider_pool(
        ctx: Context<CreatePool>,
        expired_at: i64,
        fee: u64,
        share: u64,
        j_probability: u8,
        j_return: u8,
        j_cost: u8,
        strategies: Vec<Strategy>,
    ) -> Result<()> {
        instructions::pool::create_pool::handler(
            ctx,
            expired_at,
            fee,
            share,
            j_probability,
            j_return,
            j_cost,
            strategies,
        )
    }
}
