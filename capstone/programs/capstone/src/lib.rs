use anchor_lang::prelude::*;

declare_id!("31QevmMYhUm7KiF5VfRoxpEoKY4FsnUCHCyYmEKvg47E");

#[program]
pub mod capstone {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
