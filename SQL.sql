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


CREATE VIEW [dbo].[Cnsta nest Pacientes Formula]
AS
SELECT dbo.Entidad.[Documento Entidad], dbo.EntidadIII.[Edad EntidadIII], dbo.EntidadII.[Dirección EntidadII], dbo.EntidadII.[Id Ciudad], dbo.Ciudad.Ciudad, dbo.EntidadII.[Teléfono No 1 EntidadII], dbo.EntidadII.[Teléfono No 2 EntidadII], 
                  dbo.EntidadII.[Teléfono Celular EntidadII], dbo.EntidadIII.[Fecha Nacimiento EntidadIII], dbo.EntidadIII.[Id Unidad de Medida Edad], dbo.EntidadIII.[Id Sexo], dbo.Sexo.Sexo, dbo.EntidadIII.[Id Estado Civil], dbo.[Estado Civil].[Estado Civil], 
                  dbo.Sexo.[Descripción Sexo]
FROM     dbo.Entidad INNER JOIN
                  dbo.EntidadII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadII.[Documento Entidad] INNER JOIN
                  dbo.EntidadIII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadIII.[Documento Entidad] INNER JOIN
                  dbo.Ciudad ON dbo.EntidadII.[Id Ciudad] = dbo.Ciudad.[Id Ciudad] INNER JOIN
                  dbo.Sexo ON dbo.EntidadIII.[Id Sexo] = dbo.Sexo.[Id Sexo] INNER JOIN
                  dbo.[Estado Civil] ON dbo.EntidadIII.[Id Estado Civil] = dbo.[Estado Civil].[Id Estado Civil]
GO




