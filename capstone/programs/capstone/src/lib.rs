#![allow(unexpected_cfgs, deprecated)]
mod state;
mod instructions;

use anchor_lang::prelude::*;
use instructions::*;


declare_id!("31QevmMYhUm7KiF5VfRoxpEoKY4FsnUCHCyYmEKvg47E");

#[program]
pub mod capstone {
   
    use crate::state::AnalysisData;

    use super::*;

    pub fn request_analysis(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;
        Ok(())
    }

    pub fn analysis_setup(ctx: Context<Analysis>, timestamp: i64, program_name: String) -> Result<()> {
        ctx.accounts.analysis(timestamp, program_name, &ctx.bumps)?;
        Ok(())
    }

    pub fn store_results(ctx: Context<StoreResults>, timestamp: i64, deployment_cost: u64, transaction_cost: u64, daily_projection: u64) -> Result<()> {
        ctx.accounts.store(deployment_cost, transaction_cost, daily_projection, &ctx.bumps)?;
        Ok(())
    }

    pub fn get_analysis(ctx: Context<GetAnalysis>, timestamp: i64) -> Result<()> {
        ctx.accounts.get()?;
        Ok(())
    }

    
}

