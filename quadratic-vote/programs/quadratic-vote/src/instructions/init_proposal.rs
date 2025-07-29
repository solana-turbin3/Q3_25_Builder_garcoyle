use anchor_lang::prelude::*;

use create::State::Dao;

#[derive(Accounts)]

pub struct InitProposalContext<'info>{
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(mut)]
    pub dao_account: Account<'info, Dao>,

    #[account(
        init,
        payer = creator,
        space = 8 + Proposal::INIT_SPACE,
        seeds = [b"proposal", dao.account.key().as_ref(), dao_account.proposal_count.to_le_bytes().as_ref]
    )]

    pub proposal: Account<'info, Proposal>,

    pub system_program: Program<'info, System>,
}

pub fn init_proposal(ctx: Context<InitProposalConext>, metadata: String) -> Result<()>{
    let proposal = & mut
}