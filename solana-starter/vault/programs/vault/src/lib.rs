use anchor_lang::prelude::*;

declare_id!("hRxt1YjTD67bSwwv7bXozqmQrif9Je3Y5MY8ovVLy7Z"); // declare_id: specifies the programs on chain address

#[program] // specifies the module containing the program's instruction logic
pub mod vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.inititalize(&ctx.bumps)
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>) -> Result<()> {
        //ctx.accounts.deposit(amount)
        Ok(())
    }
}

#[derive(Accounts)] // applied to structs to indicate a list of accounts required by an instruction

// #[accounts] create custom account types for the program
pub struct Initialize {
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
        seeds = [b"state", signer.key().as_ref()],
        bump
        space = VaultState::INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>

}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()>{
        self.vault_state.state_bump = bumps.vault_state;
        self.vault_state.vault_bump = bumps.vault;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        seeds = [b"state", signer.key().as_ref()],
        bump
        space = vault_state.state_bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>

}

impl<'info> Deposit<'info> {
    pub fn initialize(&mut self, amount: u64) -> Result<()>{
        let cpi_program: = self.system.to_account();
        let cpi_account: = Transfer {
            from: self.signer.to_account_info(),
            to: self.vault.to_account_info()
        }
        let cpi_ctx = CpiContext::new(cpi_program, accounts )
        transfer(cpi_ctx, amount)?;
        Ok(())
    }
}


pub struct VaultState {
    pub vault_bump: u8,
    pub state_bump: u8,
}

impl Space for VaultState{
    const INIT_SPACE: usize = 1 + 1;
}