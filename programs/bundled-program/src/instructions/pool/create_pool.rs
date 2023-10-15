use anchor_lang::prelude::*;

use crate::{
    constants::{PROVIDER_POOL_SEED,STRATEGIES_SEED}, 
    schemas::{ProviderPool,JudgementLevel, Strategies, Strategy}, 
};

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(
        init, 
        payer = auth, 
        space = ProviderPool::LEN, 
        seeds = [PROVIDER_POOL_SEED.as_ref(), auth.key().as_ref()], 
        bump
    )]
    pub pool: Account<'info, ProviderPool>,
    #[account(
        init,
        payer = auth,
        space = Strategies::calculate_size(2),
        seeds = [STRATEGIES_SEED.as_ref(), pool.key().as_ref()],
        bump

    )]
    pub strageties: Account<'info, Strategies>,
    #[account(mut)]
    pub auth: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreatePool>,
    expired_at: i64,
    fee: u64,
    share: u64,
    j_probability: u8,
    j_return: u8,
    j_cost: u8,
    strategies: Vec<Strategy>
) -> Result<()> {
    let pool =&mut ctx.accounts.pool;
    let strategies_acc = &mut ctx.accounts.strageties;
    let admin = ctx.accounts.auth.key();

    strategies_acc.init(pool.key(), strategies);

    pool.init(
        admin, 
        expired_at, 
        fee, 
        share, 
        JudgementLevel::from(j_probability), 
        JudgementLevel::from(j_return), 
        JudgementLevel::from(j_cost)
    )
    
}
