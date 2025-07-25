#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

declare_id!("AcnK7pdh4iWJxhNw4k3S3PEZYgHjE6RsRLZpkgqPYqKq");

#[program]
pub mod anchor_marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
