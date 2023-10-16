use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};
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
    // #[account(address = mint::USDC)]
    pub usdc_mint: Box<Account<'info, token::Mint>>,
    #[account(
        init,
        payer = auth,
        associated_token::mint = usdc_mint,
        associated_token::authority = pool
    )]
    pub usdc_pool_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub auth: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
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

    strategies_acc.init(pool.key(), strategies)?;

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
