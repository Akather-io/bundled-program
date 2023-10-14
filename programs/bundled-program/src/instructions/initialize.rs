use crate::{constants::SYSTEM_SEED, schemas::system::SystemSetting, ErrorMessages};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = authority,
        space = SystemSetting::LEN,
        seeds = [SYSTEM_SEED.as_ref()],
        bump
    )]
    pub system: Account<'info, SystemSetting>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let system = &mut ctx.accounts.system;

    require!(
        system.initialized == false,
        ErrorMessages::AlreadyInitialized
    );

    system.admin = *ctx.accounts.authority.key;
    system.initialized = true;
    Ok(())
}
