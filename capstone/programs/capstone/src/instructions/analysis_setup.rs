#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

use crate::state::{UserAccount, AnalysisData};

#[derive(Accounts)]
#[instruction(timestamp: i64, program_name: String)]
pub struct Analysis<'info>{
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
    mut,
    seeds = [b"user_account", user.key().as_ref()],
    bump
    )]
pub user_account: Account<'info, UserAccount>,
    #[account(
        init,
        payer = user,
        seeds = [b"analysis", timestamp.to_le_bytes().as_ref(),  user_account.key().as_ref()],
        bump,
        space = 8 + AnalysisData::INIT_SPACE,

    )]
    pub analysis_account: Account<'info, AnalysisData>,
    pub system_program: Program<'info, System>,
}

impl<'info> Analysis<'info> {
    pub fn analysis(&mut self, timestamp:i64, program_name: String, 
        bumps: &AnalysisBumps) -> Result<()> {
        self.analysis_account.bump = bumps.analysis_account;
        self.analysis_account.timestamp = timestamp;
        self.analysis_account.program_name = program_name;
        self.analysis_account.status = false; // Assuming status is false when analysis is set up
        Ok(())
    }
}

