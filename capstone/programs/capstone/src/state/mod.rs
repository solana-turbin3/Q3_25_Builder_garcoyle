#![allow(unexpected_cfgs)]
#![allow(deprecated)]


use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserAccount{
    pub user: Pubkey,
    // #[max_len(100)]
    // pub analyses: Vec<AnalysisData>,
    // save bump
    pub bump: u8
}

#[account]
#[derive(InitSpace)]
pub struct AnalysisData{
    #[max_len(100)]
    pub program_name: String,
    //pub analysis_request_id: u64,
    pub deployment_cost: u64,
    pub transaction_cost: u64,
    pub daily_projection: u64,
    pub status: bool,
    pub timestamp: i64,
    pub bump: u8,
}