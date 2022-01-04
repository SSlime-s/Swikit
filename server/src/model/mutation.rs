use agql::{InputObject, Object};
use async_graphql as agql;
use sqlx::MySqlPool;

use crate::{db::PageRecord, model::Page};


#[derive(InputObject)]
pub struct CreatePageInput {
    title: String,
    source: String,
}

#[derive(InputObject)]
pub struct UpdatePageInput {
    id: i32,
    title: Option<String>,
    source: Option<String>,
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_page(
        &self,
        ctx: &agql::Context<'_>,
        input: CreatePageInput,
    ) -> Result<Page, agql::Error> {
        let pool = ctx.data::<MySqlPool>()?;
        let mut tx = pool.begin().await?;
        let sql = r#"
            INSERT INTO pages (
                title, source, create_time, update_time
            ) values (
                ?, ?, current_timestamp, current_timestamp
            );
        "#;
        let last_insert_id = sqlx::query(sql)
            .bind(&input.title)
            .bind(&input.source)
            .execute(&mut tx)
            .await?
            .last_insert_id() as i32;
        let last_insert_row: PageRecord = sqlx::query_as("SELECT * FROM pages WHERE id = ?")
            .bind(last_insert_id)
            .fetch_one(&mut tx)
            .await?;

        let sql = r#"
            INSERT INTO page_revisions (
                page_id, source, author, create_time
            ) values (
                ?, ?, ?, ?
            );
        "#;
        sqlx::query(sql)
            .bind(last_insert_row.id)
            .bind(&last_insert_row.source)
            .bind("example@example.com") // FIXME
            .bind(&last_insert_row.update_time)
            .execute(&mut tx)
            .await?;
        tx.commit().await?;

        let gql_page = last_insert_row.into();
        Ok(gql_page)
    }
}
