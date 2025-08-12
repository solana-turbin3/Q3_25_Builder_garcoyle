#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

use crate::state::{UserAccount, AnalysisData};

#[derive(Accounts)]
#[instruction(timestamp: i64, deployment_cost: u64, transaction_cost: u64, daily_projection: u64)]
pub struct StoreResults<'info>{
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"user_account", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        mut,
        seeds = [b"analysis", timestamp.to_le_bytes().as_ref(), user_account.key().as_ref()],
        bump
    )]
    pub analysis_account: Account<'info, AnalysisData>,
    pub system_program: Program<'info, System>,
}

impl<'info> StoreResults<'info> {
    pub fn store(&mut self, deployment_cost: u64, transaction_cost: u64, daily_projection: u64, bumps: &StoreResultsBumps) -> Result<()> {
        //self.analysis_account.program_name = program_name;
        self.analysis_account.deployment_cost = deployment_cost;
        self.analysis_account.transaction_cost = transaction_cost;
        self.analysis_account.daily_projection = daily_projection;
        self.analysis_account.status = true; // Assuming status is set to true when results are stored
        //self.analysis_account.timestamp = self.analysis_account.timestamp; // Keep the original timestamp
        self.analysis_account.bump = bumps.analysis_account;
        Ok(())
    }
}