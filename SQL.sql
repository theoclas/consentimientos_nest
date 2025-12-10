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
                  dbo.Sexo.[Descripción Sexo], dbo.Entidad.[Primer Apellido Entidad], dbo.Entidad.[Segundo Apellido Entidad], dbo.Entidad.[Primer Nombre Entidad], dbo.Entidad.[Segundo Nombre Entidad], dbo.Entidad.[Nombre Completo Entidad]
FROM     dbo.Entidad INNER JOIN
                  dbo.EntidadII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadII.[Documento Entidad] INNER JOIN
                  dbo.EntidadIII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadIII.[Documento Entidad] INNER JOIN
                  dbo.Ciudad ON dbo.EntidadII.[Id Ciudad] = dbo.Ciudad.[Id Ciudad] INNER JOIN
                  dbo.Sexo ON dbo.EntidadIII.[Id Sexo] = dbo.Sexo.[Id Sexo] INNER JOIN
                  dbo.[Estado Civil] ON dbo.EntidadIII.[Id Estado Civil] = dbo.[Estado Civil].[Id Estado Civil]
GO




CREATE VIEW [dbo].[Cnsta Nest Profesional info general]
AS
SELECT TOP (100) PERCENT dbo.Entidad.[Documento Entidad] AS [Documento Profesional], dbo.[Tipo de Documento].[Tipo de Documento] AS [Tipo de Documento Profesional], 
                  dbo.[Tipo de Documento].[Descripción Tipo de Documento] AS [Descripción Tipo de Documento Profesional], ISNULL(dbo.Entidad.[Primer Nombre Entidad] + N' ', '') + ISNULL(dbo.Entidad.[Segundo Nombre Entidad] + N' ', '') 
                  + ISNULL(dbo.Entidad.[Primer Apellido Entidad] + N' ', '') + ISNULL(dbo.Entidad.[Segundo Apellido Entidad], '') AS [Nombres Profesional], dbo.EntidadII.[Dirección EntidadII] AS [Dirección Profesional], 
                  dbo.Barrio.Barrio AS [Barrio Profesional], dbo.Ciudad.Ciudad AS [Ciudad Profesional], dbo.EntidadII.[Teléfono No 1 EntidadII] AS [Teléfono No 1 Profesional], dbo.EntidadII.[Teléfono No 2 EntidadII] AS [Teléfono No 2 Profesional], 
                  dbo.EntidadII.[Teléfono Celular EntidadII] AS [Teléfono Celular Profesional], dbo.[Empresa Celular].[Empresa Celular] AS [Empresa Celular Profesional], dbo.EntidadII.[Beeper EntidadII] AS [Beeper Profesional], 
                  dbo.EntidadII.[E-mail Nro 1 EntidadII] AS [E-mail Profesional], dbo.Entidad.[Observaciones Entidad] AS [Sigla Profesional], dbo.Entidad.[Registro Médico]
FROM     dbo.[Tipo de Documento] RIGHT OUTER JOIN
                  dbo.Función RIGHT OUTER JOIN
                  dbo.Entidad INNER JOIN
                  dbo.[Función Por Entidad] ON dbo.Entidad.[Documento Entidad] = dbo.[Función Por Entidad].[Documento Entidad] LEFT OUTER JOIN
                  dbo.[Empresa Celular] RIGHT OUTER JOIN
                  dbo.Ciudad RIGHT OUTER JOIN
                  dbo.Barrio RIGHT OUTER JOIN
                  dbo.EntidadII ON dbo.Barrio.[Id Barrio] = dbo.EntidadII.[Id Barrio] ON dbo.Ciudad.[Id Ciudad] = dbo.Barrio.[Id Ciudad] ON dbo.[Empresa Celular].[Id Empresa Celular] = dbo.EntidadII.[Id Empresa Celular] ON 
                  dbo.Entidad.[Documento Entidad] = dbo.EntidadII.[Documento Entidad] ON dbo.Función.[Id Función] = dbo.[Función Por Entidad].[Id Función] ON 
                  dbo.[Tipo de Documento].[Id Tipo de Documento] = dbo.Entidad.[Id Tipo de Documento]
WHERE  (dbo.Función.Función = N'Profesional') AND (dbo.Entidad.[Id Estado] <> 8)
ORDER BY [Nombres Profesional]
GO

CREATE VIEW [dbo].[Cnsta Nest Objetos Medicamentos]
AS
SELECT dbo.Capítulo.Capítulo, dbo.Subcapítulo.Subcapítulo, dbo.Objeto.[Código Objeto], dbo.Objeto.[Descripción Objeto]
FROM     dbo.Capítulo INNER JOIN
                  dbo.Subcapítulo ON dbo.Capítulo.[Id Capítulo] = dbo.Subcapítulo.[Id Capítulo] INNER JOIN
                  dbo.Objeto ON dbo.Subcapítulo.[Id Subcapítulo] = dbo.Objeto.[Id Subcapítulo]
WHERE  (dbo.Capítulo.Capítulo LIKE N'%medi%')
GO
