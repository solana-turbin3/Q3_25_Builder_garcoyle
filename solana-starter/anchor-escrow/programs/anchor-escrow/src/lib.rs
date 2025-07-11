#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

// use
use instructions::*;
use state::*;

declare_id!("D3sgRzgAwbejmCNeSAv7h5tzKCkuq5KANv5bNL3NuWzn");

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.init_escrow(seed, recieve, &ctx.bumps)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
