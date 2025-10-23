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