#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;



declare_id!("8dFQyeTJfqKG64C7Nm49PwJsRAWBAMn6sqNp9vamzXSR");

#[program]
pub mod vault2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize <'info>{
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"vault", vault_state.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        init,
        payer = signer,
        seeds = [b"vault_state", signer.key().as_ref()],
        bump,
        space = 8 + VaultState::INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {
        self.vault_state.state_bump = bumps.vault_state;
        self.vault_state.vault_bump = bumps.vault;
        Ok(())
    }
    
}


#[account]
pub struct VaultState{
    vault_bump: u8,
    state_bump: u8
}

impl Space for VaultState{
    const INIT_SPACE: usize = 1+1;
}