use anchor_lang::{accounts::system_account, prelude::*};

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        close_account, transfer_checked, CloseAccount, Mint, TokenAccount, TokenInterface,
        TransferChecked,
    },
};
use crate::Escrow;

#[derive(Accounts)]

pub struct Take<'info>{
    pub taker: Signer<'info>,
    pub maker: SystemAccount<'info>,
    pub mint_a: InterfaceAccount<'info, Mint>,
    pub mint_b: InterfaceAccount<'info, Mint>,
    pub taker_ata_a: InterfaceAccount<'info, TokenAccount>,
}
