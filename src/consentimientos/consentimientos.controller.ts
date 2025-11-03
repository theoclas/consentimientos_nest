import { Controller, Get, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { join } from 'path';
import { readdir } from 'fs/promises';
import * as fs from 'fs/promises';
import puppeteer from 'puppeteer';
import { createHash } from 'crypto';
import { DocumentoAnexoService } from '../documento-anexo/documento-anexo.service';
import { SavePdfDto } from './dto/save-pdf.dto';

@Controller('consentimientos')
export class ConsentimientosController {
  constructor(
    private readonly documentoAnexoService: DocumentoAnexoService,
  ) { }

  @Get()
  async listar(): Promise<string[]> {
    try {
      const dir = join(process.cwd(), 'public', 'Consentimientos');
      const entries = await readdir(dir, { withFileTypes: true });

      return entries
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((n) => n.toLowerCase().endsWith('.html'))
        .sort((a, b) => a.localeCompare(b, 'es'));

    } catch {
      throw new HttpException(
        'No se pudo leer la carpeta public/Consentimientos',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('pdf')
  async crearPdf(@Body() body: SavePdfDto) {
    if (!body?.html) {
      throw new HttpException('html requerido', HttpStatus.BAD_REQUEST);
    }

    const baseDir = 'C:\\CeereSio\\Documentos';
    await fs.mkdir(baseDir, { recursive: true });

    const safeDoc = (body.pacienteDoc || 'sin_doc').replace(/[^a-zA-Z0-9_-]/g, '');
    const ts = new Date().toISOString().replace(/[:]/g, '-').replace('T', '_').replace('Z', '');
    const filename = `consentimiento_${safeDoc}_${ts}.pdf`;
    const filePath = join(baseDir, filename);

    // ✅ Abrir navegador (Chrome instalado)
    let browser;
    try {
      browser = await puppeteer.launch({
        channel: 'chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch {
      // ✅ Fallback: ruta manual si falla
      browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--no-first-run',
          '--no-default-browser-check'
        ],
      });
    }

    try {
      const page = await browser.newPage();

      // 1) Timeouts razonables
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);

      // 2) Interceptar peticiones: permitir SOLO localhost y data:
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const url = req.url();
        const allow =
          url.startsWith('http://localhost:3000/') ||
          url.startsWith('http://127.0.0.1:3000/') ||
          url.startsWith('data:');

        if (allow) return req.continue();   // permitimos recursos locales
        return req.abort();                 // bloqueamos externos (CDNs, fonts, analytics, etc.)
      });

      // 3) (Opcional) Sanitizar HTML: quitar <script> y <link> externos
      let htmlSanit = body.html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
      htmlSanit = htmlSanit.replace(/<link[^>]+href=["']https?:\/\/[^"']+["'][^>]*>/gi, '');

      // 4) Cargar el HTML con espera menos estricta
      try {
        await page.setContent(htmlSanit, {
          waitUntil: 'domcontentloaded',   // evita colgarse por recursos externos
          timeout: 60000,
        });
      } catch {
        // Fallback: sin interceptación, por si bloqueamos algo que sí necesitas
        page.removeAllListeners('request');
        await page.setRequestInterception(false);
        await page.setContent(htmlSanit, { waitUntil: 'load', timeout: 60000 });
      }

      await new Promise((r) => setTimeout(r, 200));

      const pdfBuffer = await page.pdf({
        printBackground: true,
        format: 'A4',
        margin: { top: '10mm', right: '10mm', bottom: '12mm', left: '10mm' },
      });

      await fs.writeFile(filePath, pdfBuffer);
      
      const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      if (!pdfBase64.startsWith('JVBER')) throw new Error('PDF no se codificó bien');

      const tamanoBytes = pdfBuffer.length;
      const hashSha256 = createHash('sha256').update(pdfBuffer).digest();

      const anexo = await this.documentoAnexoService.create({
        documentoEntidad: safeDoc,
        documentoAnexo: filename,
        descripcionDocumentoAnexo: filename,
        // descripcionDocumentoAnexo: body.descripcion ?? 'Consentimiento firmado',
        rutaCarpeta: baseDir,
      });
      
      await this.documentoAnexoService.saveArchivoBase64(
        anexo.idDocumentoAnexo,
        pdfBase64,
        tamanoBytes,
        hashSha256,
      );

      return {
        ok: true,
        msg: "PDF generado exitosamente",
        anexoId: anexo.idDocumentoAnexo,
        filePath,
        sizeBytes: tamanoBytes,
      };

    } finally {
      await browser.close();
    }
  }
}
