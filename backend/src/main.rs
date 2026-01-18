mod engine_ffi;

use axum::{
    routing::{get, post},
    Router,
    Json,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use engine_ffi::SafeTable;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Serve static files from the "dist" directory
    let serve_dir = tower_http::services::ServeDir::new("dist")
        .not_found_service(tower_http::services::ServeFile::new("dist/index.html"));

    let app = Router::new()
        .route("/api/test-engine", get(test_engine))
        .fallback_service(serve_dir);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[derive(Serialize)]
struct EngineResult {
    sum_result: f64,
    message: String,
}

async fn test_engine() -> Json<EngineResult> {
    // Create a table, set some values, verify logic
    let table = SafeTable::new();
    table.set_number(0, 0, 10.5); // A1
    table.set_number(1, 0, 20.0); // A2
    
    // Test SUM
    let result = table.eval("=SUM");
    
    Json(EngineResult {
        sum_result: result,
        message: "Calculated via C++ Engine".to_string(),
    })
}
