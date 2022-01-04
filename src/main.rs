mod db;
mod model;

use std::net::Ipv4Addr;

use agql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, Schema
};
use async_graphql as agql;
use async_graphql_rocket::{GraphQLQuery, GraphQLRequest, GraphQLResponse};
use model::mutation::MutationRoot;
use rocket::{figment::Figment, response::content, Config, State};
use sqlx::{mysql::MySqlPoolOptions};

use crate::model::{SwikitSchema, query::QueryRoot};


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
