-- CreateTable
CREATE TABLE "usuario" (
    "usuario_codigo" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "email_1" TEXT NOT NULL,
    "email_2" TEXT,
    "telefone" TEXT NOT NULL,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pais" (
    "codigo_pais" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "email_1" TEXT NOT NULL,
    "email_2" TEXT,
    "telefone" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario_codigo" TEXT NOT NULL,
    CONSTRAINT "pais_usuario_codigo_fkey" FOREIGN KEY ("usuario_codigo") REFERENCES "usuario" ("usuario_codigo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "baba" (
    "codigo_baba" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "email_1" TEXT NOT NULL,
    "email_2" TEXT,
    "telefone" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "status_cadastro" TEXT NOT NULL DEFAULT 'Ativa',
    "foto" TEXT,
    "antecedentes_pdf" TEXT,
    "usuario_codigo" TEXT NOT NULL,
    CONSTRAINT "baba_usuario_codigo_fkey" FOREIGN KEY ("usuario_codigo") REFERENCES "usuario" ("usuario_codigo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "filhos" (
    "codigo_filhos" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "alergias" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario_codigo" TEXT NOT NULL,
    CONSTRAINT "filhos_usuario_codigo_fkey" FOREIGN KEY ("usuario_codigo") REFERENCES "usuario" ("usuario_codigo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_1_key" ON "usuario"("email_1");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_2_key" ON "usuario"("email_2");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_telefone_key" ON "usuario"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "pais_cpf_key" ON "pais"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "pais_email_1_key" ON "pais"("email_1");

-- CreateIndex
CREATE UNIQUE INDEX "pais_email_2_key" ON "pais"("email_2");

-- CreateIndex
CREATE UNIQUE INDEX "pais_telefone_key" ON "pais"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "baba_cpf_key" ON "baba"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "baba_email_1_key" ON "baba"("email_1");

-- CreateIndex
CREATE UNIQUE INDEX "baba_email_2_key" ON "baba"("email_2");

-- CreateIndex
CREATE UNIQUE INDEX "baba_telefone_key" ON "baba"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "filhos_cpf_key" ON "filhos"("cpf");
