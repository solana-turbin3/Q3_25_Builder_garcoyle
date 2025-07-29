#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

mod instructions;
mod state;

// use
use instructions::*;
//use state::*;

declare_id!("D3sgRzgAwbejmCNeSAv7h5tzKCkuq5KANv5bNL3NuWzn");

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, recieve: u64, deposit: u64) -> Result<()> {
        ctx.accounts.init_escrow(seed, recieve, &ctx.bumps)?;
        ctx.accounts.deposit(deposit)?;
        Ok(())
    }

    pub fn take(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.deposit()?;
        ctx.accounts.withdraw_and_close_vault()?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
