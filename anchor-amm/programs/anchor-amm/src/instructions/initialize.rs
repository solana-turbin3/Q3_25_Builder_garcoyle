use anchor_lang::prelude::*;
use anchor_spl::(associated_token::AssociatedToken, token::{Mint, Token, TokenAccount})

use create::state::Config;

#[derive(Accounts)]

#[instruction(seeds)]
pub struct Initialize<'info>{
    #[account(mut)]
    pub iniitalize: Signer<'info>,
    pub mint_x:Account<'info, Mint>,
    pub mint_y: Account<'info, Mint>,

    #[account(
        init,
        payer = initializer,
        seeds = [b"lp", config.key.as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = config,

    )]
    pub mint_lp:Account<'info, Mint>,
    #[account{
        init,
        payer = initializer,
        associated_token::mint = mint_x,
        associated_token::authority = config,

    }]
    pub vault_x: Account<'info, TokenAccount>,
     #[account{
        init,
        payer = initializer,
        associated_token::mint = mint_y,
        associated_token::authority = config,

    }]
    pub vault_y: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = initializer,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump,
        space = 8 + Config::INIT_SPACE

    )]

    pub config: Account<'info, Config>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info>Initialize<'info>{
    pub fn init(&mut self, seed:u64, fee:u16, authority:Option<Pubkey>, bumps:InitializeBumps)-> Result<()>{
        self.config.set_intter(Config
            {
              seed,
              auhtority,
              mint_x: self.mint_x.key(),
              mint_y: self.mint_y.key(),
              fee,
              locked: false,
              config_bump: bumps.config,
              lp_bump: bumps.mint_lp
            });
    }
}