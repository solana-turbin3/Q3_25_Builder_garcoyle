#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        seeds =[b"account", account_state.key().as_ref()],
        bump,
    )]
    pub user_account: SystemAccount<'info>,
    #[account(
        init,
        payer = signer,
        seeds = [b"analysis", signer.key().as_ref(), analysis_id],
        bump,
        space = 8 + UserAccount::INIT_SPACE,

    )]
    pub vault_state: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}

