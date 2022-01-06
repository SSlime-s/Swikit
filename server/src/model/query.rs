use agql::Object;
use async_graphql as agql;
use sqlx::MySqlPool;

use crate::{db::PageRecord, model::Page};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn answer(&self, ctx: &agql::Context<'_>) -> Result<i32, agql::Error> {
        let pool = ctx.data::<MySqlPool>()?;
        let (answer,): (i32,) = sqlx::query_as("SELECT 62;").fetch_one(pool).await?;
        Ok(answer)
    }

    async fn page(&self, ctx: &agql::Context<'_>, id: i32) -> Result<Option<Page>, agql::Error> {
        let pool = ctx.data::<MySqlPool>()?;
        let page_record: Option<PageRecord> = sqlx::query_as("SELECT * FROM pages WHERE id = ?;")
            .bind(id)
            .fetch_optional(pool)
            .await?;
        let page = page_record.map(Into::into);
        Ok(page)
    }

    async fn page_by_title(
        &self,
        ctx: &agql::Context<'_>,
        title: String,
    ) -> Result<Option<Page>, agql::Error> {
        let pool = ctx.data::<MySqlPool>()?;
        let page_record: Option<PageRecord> = sqlx::query_as("SELECT * FROM pages WHERE title = ?")
            .bind(title)
            .fetch_optional(pool)
            .await?;
        let page = page_record.map(Into::into);
        Ok(page)
    }
}
