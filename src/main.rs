use std::net::Ipv4Addr;

use agql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, InputObject, Object, Schema, SimpleObject,
};
use async_graphql as agql;
use async_graphql_rocket::{GraphQLQuery, GraphQLRequest, GraphQLResponse};
use chrono::NaiveDateTime;
use rocket::{figment::Figment, response::content, Config, State};
use sqlx::prelude::*;
use sqlx::{mysql::MySqlPoolOptions, MySqlPool};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn answer(&self, ctx: &agql::Context<'_>) -> Result<i32, agql::Error> {
        let pool = ctx.data::<MySqlPool>()?;
        let (answer,): (i32,) = sqlx::query_as("SELECT 62;").fetch_one(pool).await?;
        Ok(answer)
    }
}

#[derive(SimpleObject)]
struct Page {
    id: u64,
    title: String,
    source: String,
}

#[derive(InputObject)]
struct CreatePageInput {
    title: String,
    source: String,
}

#[derive(Debug, FromRow)]
struct PageRecord {
    id: u64,
    title: String,
    source: String,
    create_time: NaiveDateTime,
    update_time: NaiveDateTime,
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
            .bind(input.title.clone())
            .bind(input.source.clone())
            .execute(&mut tx)
            .await?
            .last_insert_id();
        tx.commit().await?;
        let gql_page = Page {
            id: last_insert_id,
            title: input.title,
            source: input.source,
        };
        Ok(gql_page)
    }
}

pub type SwikitSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[rocket::get("/")]
fn graphql_playground() -> content::Html<String> {
    content::Html(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[rocket::get("/graphql?<query..>")]
async fn graphql_query(schema: &State<SwikitSchema>, query: GraphQLQuery) -> GraphQLResponse {
    query.execute(schema).await
}

#[rocket::post("/graphql", data = "<request>", format = "application/json")]
async fn graphql_request(schema: &State<SwikitSchema>, request: GraphQLRequest) -> GraphQLResponse {
    request.execute(schema).await
}

#[rocket::launch]
async fn rocket() -> _ {
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(r#"mysql://root:password@Swikit-db:3306/Swikit"#)
        .await
        .unwrap();
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(pool)
        .finish();
    let figment = Figment::from(rocket::Config::default())
        .merge((Config::PORT, 8088))
        .merge((Config::ADDRESS, Ipv4Addr::new(0, 0, 0, 0)));

    rocket::custom(figment).manage(schema).mount(
        "/",
        rocket::routes![graphql_playground, graphql_query, graphql_request],
    )
}
