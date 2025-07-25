use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Offer {
    // Details of the offer made, e.g. what who made it and what they want in return.
    // Identifier of the offer
    pub id: u64,
    // Who made the offer
    pub maker: Pubkey,
    // The token mint of the token being offered
    pub token_mint_a: Pubkey,
    // The token miny of the token wanted
    pub token_mint_b: Pubkey,
    // The account of token b being wanted
    pub token_b_wanted_amount: u64,
    // Used to calculate the address for this account, we save it as a performance optimization
    pub bump: u8,
}
