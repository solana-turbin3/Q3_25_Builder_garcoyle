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
        seeds = [b"user_account", user.key().as_ref()],
        bump,
        space = 8 + UserAccount::INIT_SPACE,

    )]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {
        self.user_account.user = self.user.key();
        // self.user_account.analyses = Vec::new();
        //self.user_account.analyses = vec![];
        self.user_account.bump = bumps.user_account;
        Ok(())
    }
}

// seeds = [b"analysis", seed.to_le_bytes().as_ref() + user_account.key.as_ref()