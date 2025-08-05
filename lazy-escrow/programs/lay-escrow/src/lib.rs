use anchor_lang::prelude::*;

declare_id!("BTCMgGJycDNs5PYfB7DaWazvtXZr5TfwHquvu7qWXQHp");

#[program]
pub mod lay_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
