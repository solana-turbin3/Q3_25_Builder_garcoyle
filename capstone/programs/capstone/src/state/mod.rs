#![allow(unexpected_cfgs)]
#![allow(deprecated)]

use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserAccount{
    user: Pubkey,
    analysis_request_id: u64,
    deployment_cost: u64,
    transaction_cost: u64,
    daily_projection: u64,
    status: bool
}