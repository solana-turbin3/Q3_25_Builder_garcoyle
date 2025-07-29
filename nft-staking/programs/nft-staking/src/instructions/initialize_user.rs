use anchor_lang:: prelude ::*;


use anchor_spl::{self, metadata::mpl_token_metadata::instructions::Use};

use crate::state::{UserAccount};

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"user".as_ref(), user.key.as_ref()],
        bump,
        space = 8 + UserAccount::INIT_SPACE,

    )]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,

}

impl<'info> InitializeUser<'info> {

    pub fn initialize_user(&mut self, points_per_stake: u8, max_stake: u8, freeze_period: u32, bumps: &InitializeConfigBumps) -> Result<()> {
        
        self.config.set_inner(UserAccount{
            points: 0,
            amount_staked: 0,
            bump: bumps.user_account
        });

        Ok(())
    }
}

