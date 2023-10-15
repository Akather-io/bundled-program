use crate::schemas::ProviderPool;
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
    pub usdc_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub auth: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<JoinContext>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let auth = &ctx.accounts.auth.key();

    Ok(())
}
