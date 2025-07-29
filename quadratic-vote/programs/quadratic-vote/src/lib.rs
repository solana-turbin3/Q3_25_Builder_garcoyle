use anchor_lang::prelude::*;

declare_id!("Hxcb4FmhAd3zZ9oSFWTBRgNZ8VW1pYZyKbHVfA9xmeam");

#[program]
pub mod quadratic_vote {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
