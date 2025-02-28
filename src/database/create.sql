CREATE TABLE componente
  (
     codigo       INTEGER,
     descricao    TEXT,
     peso_liquido REAL DEFAULT 1,
     estoque      REAL DEFAULT 0.0,
     custo        REAL DEFAULT 0,01,
     tipo         INTEGER DEFAULT 1,
     embalagem    TEXT DEFAULT 'KG',
     ean          TEXT,
     PRIMARY KEY(codigo)
  );

CREATE TABLE componente_receita
  (
     receita_codigo    INTEGER NOT NULL,
     componente_codigo INTEGER NOT NULL,
     medida            REAL,
     componente_required          INT,
     PRIMARY KEY (receita_codigo, componente_codigo),
     FOREIGN KEY (receita_codigo) REFERENCES receita(codigo),
     FOREIGN KEY (componente_codigo) REFERENCES componente(codigo)
  );

CREATE TABLE producao
  (
     total_produzido REAL,
     codigo          INTEGER,
     componente_id   INTEGER,
     medida          REAL,
     data            TEXT,
     FOREIGN KEY(codigo) REFERENCES componente(codigo),
     FOREIGN KEY(componente_id) REFERENCES componente(codigo)
  );

CREATE TABLE receita
  (
     codigo     INTEGER PRIMARY KEY,
     rendimento REAL,
     secao      INTEGER,
     bancada    TEXT,
     FOREIGN KEY (codigo) REFERENCES componente(codigo)
  ) 