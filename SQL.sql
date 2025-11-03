ALTER TABLE [Documento Anexo]
ADD [Pdf Base64] NVARCHAR(MAX) NULL;


CREATE TABLE [Documento Anexo Archivo] (
  [Id Documento Anexo] INT NOT NULL PRIMARY KEY,
  [Pdf Base64] NVARCHAR(MAX) NULL,          -- base64 del PDF (si así lo quieres)
  [Tamano Bytes] INT NULL,                  -- opcional: tamaño real del PDF
  [Hash Sha256] VARBINARY(32) NULL,         -- opcional: integridad del archivo
  [Creado] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

ALTER TABLE [Documento Anexo Archivo]
ADD CONSTRAINT FK_DocAnexoArchivo_DocAnexo
FOREIGN KEY ([Id Documento Anexo])
REFERENCES [Documento Anexo]([Id Documento Anexo])
ON DELETE CASCADE;



ALTER TABLE [Documento Anexo]
ADD CONSTRAINT DF_DocumentoAnexo_Fecha
DEFAULT GETDATE() FOR [Fecha Documento Anexo];