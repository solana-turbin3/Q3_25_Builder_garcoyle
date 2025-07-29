use anchor_lang::prelude::*;

use anchor_spl::{
    associates::AssociatedToken,
    metadata::{MasterEditionAccount, MetadataAccount},
    token_interface::{transfer_checked, TransferChecked, Mint, TokenAccount, TokenInterface}
};

#[derive(Account)]

pub struct UnList<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        seed = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    pub maker_mint: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = maker
    )]
    pub maker_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
        seeds = [marketplace.key().as_ref, maker_mint.key().as_ref],
        bump,
    )]
    pub listing: Account<'info, listing>,

    #[account(
        associated_token::mint = maker_mint,
        associated_token::authority=listing,
    )]
    pub vault_ata: InterfaceAccount<'info, TokenAccount>,

    pub system_program:Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub metadata_program: Program<'info, Metadata>
}

impl <'info> UnList <'info>{
        pub fn transfer(&mut self, amount: u64, bump: &UnlistBumps) -> Result<()> {
            self.unlist.set_inner(Unlisting{
                maker_ata: self.maker_ata.key(),
                maker_mint: self.maker_mint.key(),
                vaultbump: bumps.vault
            });
        }

        pub fn closing_vault(&mut self, amount: u64, bump: &VaultBumps) -> Result<()> {
            self.close.set_inner(Closing{
                vault: self.vault_ata.key(),
                maker

            })

        }

        Ok(())

    }
}