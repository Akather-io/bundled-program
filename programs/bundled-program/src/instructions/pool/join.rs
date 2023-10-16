use crate::{constants::USER_POOL_SEED, errors::ErrorMessages, schemas::ProviderPool, UserPool};
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

#[derive(Accounts)]
pub struct JoinContext<'info> {
    #[account(mut)]
    pub pool: Account<'info, ProviderPool>,
    pub usdc_mint: Account<'info, token::Mint>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = auth
    )]
    pub usdc_user_token_account: Account<'info, token::TokenAccount>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = pool
    )]
    pub usdc_pool_token_account: Account<'info, token::TokenAccount>,
    #[account(
        init_if_needed,
        payer = auth,
        space = UserPool::LEN,
        seeds = [USER_POOL_SEED.as_ref(), pool.key().as_ref(), auth.key().as_ref()],
        bump

    )]
    pub user_pool: Account<'info, UserPool>,
    #[account(mut)]
    pub auth: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<JoinContext>, opt_num: u8, amount: u64) -> Result<()> {
    let pool = &mut ctx.accounts.pool;

    require!(opt_num > 0, ErrorMessages::InvalidOptionNumber);
    require!(amount > 0, ErrorMessages::InvalidAmount);

    let user_pool = &mut ctx.accounts.user_pool;

    user_pool.init(pool.key(), opt_num, amount)?;

    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token::Transfer {
            from: ctx.accounts.usdc_user_token_account.to_account_info(),
            to: ctx.accounts.usdc_pool_token_account.to_account_info(),
            authority: ctx.accounts.auth.to_account_info(),
        },
    );
    token::transfer(cpi_context, amount)?;

    Ok(())
}
