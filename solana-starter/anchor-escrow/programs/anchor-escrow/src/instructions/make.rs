use anchor_lang::prelude::*;

use anchor_spl::{
    token_interface::{Mint, TokenAccount, TokenInterface}
};

#[derive(Accounts)]
pub struct Make<'info> {
    pub maker: Signer<'info>,
    pub mint_a: InterfaceAccount<'info>,
    pub mint_b: InterfaceAccount<'info>,
    #[account{
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = maker,
        associated_token::token_program = token_program,
    }]

    pub maker_ata_a: InterfaceAccount<'info, TokenAccount>,
    #[account{
        init,
        payer = maker,
        seeds = [b"escrow", maker.key().as_ref(), seed.to_lebytes().as_ref()],
        space = Escrow::INIT_SPACE,
        bump,
    }]

    pub escrow: Account<'info, Escrow>,
    #[account{
        init,
        payer = maker,
        associated_token::mint = mint_a,
        associated_token::authority = escrow,
        associated_token::token_program = token_program,
    }]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    pub associated_token_program: Interface<'info, TokenInterface>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,

}

impl<'info>Make<'info>{
    pub fn init_escrow(&mut self, ) -> Result<()> {
        self.escrow.set_inner(
            Escrow{
                seed,
                maker: self.maker.key(),
                mint_a: self.mint_a.key(),
                mint_b: self.mint_b.key(),
                recieve,
                bump: bumps.escrow

            }
        );
        Ok(())
    }

    pub fn deposit(&mut self, deposit: u64) -> Result<()> {
        let transfer_accounts: 
        
        Ok(())
    }
}