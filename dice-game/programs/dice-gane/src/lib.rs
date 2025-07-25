use anchor_lang::prelude::*;

declare_id!("fxLapzhraW3E214fY6ZYhHd6z5Q6VB4wkJUDUzYG9KD");

#[program]
pub mod dice_gane {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
