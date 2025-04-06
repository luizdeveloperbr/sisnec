use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _migrations = vec![
        Migration {
            version: 1,
            description: "create table componente",
            sql: "CREATE TABLE Componente
                (
                    codigo       INTEGER,
                    descricao    TEXT,
                    peso_liquido REAL DEFAULT 1,
                    estoque      REAL DEFAULT 0.0,
                    custo        REAL DEFAULT 0.01,
                    tipo         INTEGER DEFAULT 1,
                    embalagem    TEXT DEFAULT 'KG',
                    ean          TEXT,
                    PRIMARY KEY(codigo)
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create table receita",
            sql: "CREATE TABLE Receita
                (
                    codigo     INTEGER PRIMARY KEY,
                    rendimento REAL,
                    secao      INTEGER,
                    bancada    TEXT,
                    FOREIGN KEY (codigo) REFERENCES Componente(codigo)
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create table componente_receita",
            sql: "CREATE TABLE Componente_Receita
                (
                    receita_codigo    INTEGER NOT NULL,
                    componente_codigo INTEGER NOT NULL,
                    medida            REAL,
                    componente_required          INT DEFAULT 0,
                    PRIMARY KEY (receita_codigo, componente_codigo),
                    FOREIGN KEY (receita_codigo) REFERENCES Receita(codigo),
                    FOREIGN KEY (componente_codigo) REFERENCES Componente(codigo)
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "insert componentes",
            sql: "INSERT OR IGNORE INTO Componente (codigo, descricao, peso_liquido, tipo, custo) VALUES 
                (3605892, 'queijo ralado parmesão kg', 1.0, 1, 123.94),
                (2736926, 'requeijão culinario 1,800kg', 1.8, 1, 49.51),
                (87432, 'massa salgada kg (uso)', 1.0, 6, 3.32),
                (22012, 'queijo mussarela p/ fatiar kg', 1.0, 1, 38.40);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "insert componente",
            sql: "INSERT OR IGNORE INTO Componente (codigo, descricao, peso_liquido, tipo) VALUES (12467, 'pão rech c/ queijo', 1.0, 6);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "insert receita",
            sql: "INSERT OR IGNORE INTO Receita (codigo, rendimento, secao) VALUES (12467, 12, 35);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "insert medidas dos componentes",
            sql: "INSERT OR IGNORE INTO Componente_Receita (receita_codigo, componente_codigo, medida) VALUES 
                (12467, 3605892, 0.120), 
                (12467, 2736926, 0.5), 
                (12467, 87432, 12), 
                (12467, 22012, 1.2);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "create Producao table",
            sql: "CREATE TABLE Producao
            (
                total_produzido REAL,
                codigo          INTEGER,
                componente_id   INTEGER,
                medida          REAL,
                data            TEXT,
                FOREIGN KEY(codigo) REFERENCES Componente(codigo),
                FOREIGN KEY(componente_id) REFERENCES Componente(codigo)
            );
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::new()
                // .add_migrations("sqlite:data.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
