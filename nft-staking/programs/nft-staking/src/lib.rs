#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

mod state;
mod instructions;

use instructions::*;

declare_id!("EdYnhQZNxWhzJjfR1sojX5VXuSY6FLdHcxA1ksKZPrby");

#[program]
pub mod nft_staking {
    use super::*;

    pub fn initialize(ctx: Context<InitializeConfig>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
