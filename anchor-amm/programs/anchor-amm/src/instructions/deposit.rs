use anchor_lang::prelude::*;
use anchor_spl::(associated_token::AssociatedToken, token::{Mint, Token, TokenAccount})
use constant_product_curve::

pub struct Deposit<'info>{
    #[account(mut)]
    pub user: Signer<'info>,
    pub mint_x: Account<'info, Mint>,
    pub mint_y: Account<'info, Mint>,
    #[account(
        has_one = mint_x,
        has one = mint_y,
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
}
pub config: Account<'info, Config>,
#[account(
        mut,
        seeds = [b"lp", config.key.as_ref()],
        bump = config.lp_bump,
    )]