import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function apiPlugin(): Plugin {
  return {
    name: 'easy-getin-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 1. Submit endpoint
        if (req.url?.startsWith('/api/submit') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const record = JSON.parse(body);
              const dataDir = path.resolve(__dirname, 'data');
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
              }
              const dataFilePath = path.join(dataDir, 'submissions.json');
              let existing: any[] = [];
              try {
                if (fs.existsSync(dataFilePath)) {
                  existing = JSON.parse(fs.readFileSync(dataFilePath, 'utf8') || '[]');
                }
              } catch (e) {
                existing = [];
              }

              const count = existing.length + 1;
              if (!record.submissionId || !record.submissionId.startsWith('EG-2026-')) {
                record.submissionId = `EG-2026-${String(count).padStart(4, '0')}`;
              }

              existing.unshift(record);
              fs.writeFileSync(dataFilePath, JSON.stringify(existing, null, 2));

              // Forward to Google Sheets Webhook
              const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbzROYxGuWTsJVRlBpbx60bZcJScAoGB_SK5RE2OFNH33Qm93yZ1WzhnAnYDXs6ItqazCA/exec';
              let syncedToGoogleSheets = false;
              let googleSheetsResponse = null;
              if (webhookUrl && webhookUrl.trim().length > 0) {
                try {
                  const sheetRes = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(record)
                  });
                  if (sheetRes.ok) {
                    syncedToGoogleSheets = true;
                    try {
                      googleSheetsResponse = await sheetRes.json();
                    } catch {
                      googleSheetsResponse = { status: 'success' };
                    }
                    console.log('Google Sheets Webhook sync success for:', record.submissionId, googleSheetsResponse);
                  } else {
                    console.warn('Google Sheets Webhook returned status:', sheetRes.status);
                  }
                } catch (webhookErr) {
                  console.warn('Google Sheets Webhook dispatch failed:', webhookErr);
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                submissionId: record.submissionId,
                totalRecorded: existing.length,
                syncedToGoogleSheets,
                googleSheetsResponse,
                record
              }));
            } catch (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        // 2. Submissions list endpoint
        if (req.url === '/api/submissions' && req.method === 'GET') {
          const dataFilePath = path.resolve(__dirname, 'data/submissions.json');
          let existing: any[] = [];
          try {
            if (fs.existsSync(dataFilePath)) {
              existing = JSON.parse(fs.readFileSync(dataFilePath, 'utf8') || '[]');
            }
          } catch (e) {
            existing = [];
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ count: existing.length, submissions: existing }));
          return;
        }

        // 3. Status endpoint
        if (req.url === '/api/status' && req.method === 'GET') {
          const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbzROYxGuWTsJVRlBpbx60bZcJScAoGB_SK5RE2OFNH33Qm93yZ1WzhnAnYDXs6ItqazCA/exec';
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'online',
            googleSheetsWebhookConfigured: Boolean(webhookUrl && webhookUrl.trim().length > 0),
            googleSheetsWebhookUrl: webhookUrl,
            storagePath: 'data/submissions.json'
          }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
