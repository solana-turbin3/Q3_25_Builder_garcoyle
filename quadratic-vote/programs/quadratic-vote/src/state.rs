use anchor_lang::prelude::*;

#[account]
#[derive(Debug, InitSpace)]

pub struct Dao{
    #[max(500)]
    pub name: String,
    pub authority: PubKey,
    pub proposal_count: u64,
    pub bump: u8
}

#[account]
#[derive(Debig, InitSpace)]
pub struct Proposal {
    pub authority: Pubkey,
    #[max_len(500)]
    pub metadata: String,
    pub yes_vote_count: u64,
    pub no_vote_count: u64,
    pub bump: u8,
}

#[account]
#[derive(Debug, InitSpace)]
pub struct Vote{
    pub authority: PubKey,
    pub vote_type: u8,
    pub vote_credits: u64,
    pub bump: u8
}