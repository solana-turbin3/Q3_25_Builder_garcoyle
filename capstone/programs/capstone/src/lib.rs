#![allow(unexpected_cfgs, deprecated)]
mod state;
mod instructions;

use anchor_lang::prelude::*;
use instructions::Initialize;


declare_id!("31QevmMYhUm7KiF5VfRoxpEoKY4FsnUCHCyYmEKvg47E");

#[program]
pub mod capstone {
   
    use super::*;

    pub fn request_analysis(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;
        Ok(())
    }
}

