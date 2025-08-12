#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

use crate::state::{UserAccount, AnalysisData};

#[derive(Accounts)]
#[instruction(timestamp: i64)]
pub struct GetAnalysis<'info>{
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        seeds = [b"user_account", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        seeds = [b"analysis", timestamp.to_le_bytes().as_ref(), user_account.key().as_ref()],
        bump
    )]
    pub analysis_account: Account<'info, AnalysisData>,
    pub system_program: Program<'info, System>,
}

impl<'info> GetAnalysis<'info> {
    pub fn get(&mut self) -> Result<()> {
        Ok(())
    }
}