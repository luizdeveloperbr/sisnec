use tauri_plugin_sql::{Migration, MigrationKind};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create table componente",
        sql: "CREATE TABLE Componente (codigo INTEGER PRIMARY KEY, descricao TEXT, peso_liquido REAL, estoque REAL, custo REAL, tipo INTEGER);",
        kind: MigrationKind::Up
    }, Migration {
        version: 2,
        description: "create table receita",
        sql: "CREATE TABLE Receita (codigo INTEGER PRIMARY KEY, rendimento REAL,  FOREIGN KEY (codigo) REFERENCES Componente(codigo));",
        kind: MigrationKind::Up
    }, Migration {
        version: 3,
        description:"create table receita_componente",
        sql: "CREATE TABLE Componente_Receita (receita_codigo INTEGER NOT NULL, componente_codigo INTEGER NOT NULL, medida REAL, PRIMARY KEY (receita_codigo, componente_codigo), FOREIGN KEY (receita_codigo) REFERENCES Receita(codigo), FOREIGN KEY (componente_codigo) REFERENCES Componente(codigo));",
        kind:MigrationKind::Up
    }, Migration {
        version: 4,
        description: "insert componentes",
        sql:"INSERT INTO Componente (codigo, descricao, peso_liquido, tipo, custo)
            VALUES 
            (3605892, 'queijo ralado parmesão kg', 1.0, 1, 123.94),
            (2736926, 'requeijão culinario 1,800kg', 1.8, 1, 49.51),
            (87432, 'massa salgada kg (uso)', 1.0, 6, 3.32),
            (22012, 'queijo mussarela p/ fatiar kg', 1.0, 1, 38.40);
            ",
        kind: MigrationKind::Up
    }, Migration {
        version: 5,
        description: "insert receita",
        sql:"INSERT INTO Componente (codigo, descricao, peso_liquido, tipo) VALUES (12467, 'pão rech c/ queijo', 1.0, 6);",
        kind: MigrationKind::Up
    }, Migration {
        version: 6,
        description: "insert medidas",
        sql:"INSERT INTO Receita (codigo, rendimento) VALUES (12467, 12);",
        kind: MigrationKind::Up
    }, Migration {
        version: 7,
        description: "insert medidas dos coponentes",
        sql:"INSERT INTO Componente_Receita (receita_codigo, componente_codigo, medida) VALUES (12467, 3605892, 0.120), (12467, 2736926, 0.5), (12467, 87432, 12), (12467, 22012, 1.2);",
        kind: MigrationKind::Up
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:data.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
