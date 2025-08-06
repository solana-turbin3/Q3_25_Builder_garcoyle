#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

use crate::state::{UserAccount, AnalysisData};


#[derive(Accounts)]
pub struct Initialize<'info>{
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"user_analysis", user.key().as_ref()],
        bump,
        space = 8 + UserAccount::INIT_SPACE,

    )]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, _bumps: &InitializeBumps) -> Result<()> {
        self.user_account.user = self.user.key();
        self.user_account.analyses = Vec::new();
        Ok(())
    }
}