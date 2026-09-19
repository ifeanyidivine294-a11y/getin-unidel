import { SubmissionRecord } from '../types';
import { getAccessToken } from './googleAuthService';
import { getConnectedSpreadsheetId, appendSubmissionToSheet } from './googleSheetsService';

const STORAGE_KEY = 'eg_submissions';
const COUNTER_KEY = 'eg_submission_counter';
const SHEETS_URL_KEY = 'eg_google_sheets_url';

export const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzROYxGuWTsJVRlBpbx60bZcJScAoGB_SK5RE2OFNH33Qm93yZ1WzhnAnYDXs6ItqazCA/exec';

/**
 * Get configured Google Sheets Webhook URL from localStorage, environment, or active default
 */
export function getGoogleSheetsWebhookUrl(): string {
  try {
    const custom = localStorage.getItem(SHEETS_URL_KEY);
    if (custom && custom.trim().length > 0) return custom.trim();
  } catch {}
  
  // Client env if provided
  const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
  if (envUrl && envUrl.trim().length > 0) return envUrl.trim();

  return DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;
}

/**
 * Save custom Google Sheets Webhook URL
 */
export function setGoogleSheetsWebhookUrl(url: string): void {
  try {
    if (!url || url.trim().length === 0) {
      localStorage.removeItem(SHEETS_URL_KEY);
    } else {
      localStorage.setItem(SHEETS_URL_KEY, url.trim());
    }
  } catch {}
}

/**
 * Returns the next unique Submission ID in format EG-2026-0001, EG-2026-0002, etc.
 */
export function getNextSubmissionId(): string {
  try {
    const raw = localStorage.getItem(COUNTER_KEY);
    let nextNum = raw ? parseInt(raw, 10) + 1 : 1;
    if (isNaN(nextNum) || nextNum < 1) nextNum = 1;
    localStorage.setItem(COUNTER_KEY, nextNum.toString());
    return `EG-2026-${String(nextNum).padStart(4, '0')}`;
  } catch {
    const fallbackRandom = Math.floor(1000 + Math.random() * 9000);
    return `EG-2026-${fallbackRandom}`;
  }
}

/**
 * Persists submission to local storage, server API, and Google Sheets webhook
 */
export async function recordSubmission(
  payload: Omit<SubmissionRecord, 'date' | 'time' | 'submissionId'> & { submissionId?: string }
): Promise<SubmissionRecord> {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];

  const submissionId = payload.submissionId || getNextSubmissionId();

  const record: SubmissionRecord = {
    ...payload,
    submissionId,
    date: dateStr,
    time: timeStr,
    paymentStatus: payload.paymentStatus || 'Pending',
    processingStatus: payload.processingStatus || 'Submitted',
    notes: payload.notes || ''
  };

  // 1. Always store locally in browser localStorage as durable backup
  try {
    const existing = getLocalSubmissions();
    existing.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  // 2. Dispatch to backend API (which also checks server-side GOOGLE_SHEETS_WEBHOOK_URL)
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.submissionId) {
        record.submissionId = data.submissionId;
      }
    }
  } catch (err) {
    console.log('Server endpoint note: stored in local database.', err);
  }

  // 3. Dispatch directly to Google Sheets Webhook if URL is configured
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (webhookUrl && webhookUrl.startsWith('https://script.google.com')) {
    try {
      // Use no-cors mode to safely send cross-origin payload to Google Apps Script Web App
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      });
      console.log('Successfully dispatched submission directly to Google Sheet Web App:', submissionId);
    } catch (sheetErr) {
      console.warn('Direct Google Sheet dispatch failed:', sheetErr);
    }
  }

  // 4. Direct Google Workspace Sheets OAuth Sync if user is authenticated and has a connected sheet
  try {
    const token = getAccessToken();
    const sheetId = getConnectedSpreadsheetId();
    if (token && sheetId) {
      appendSubmissionToSheet(token, sheetId, record)
        .then((ok) => {
          if (ok) {
            console.log('Successfully saved row to authenticated Google Sheet:', record.submissionId);
          }
        })
        .catch((err) => {
          console.warn('Failed to append row to Google Sheet:', err);
        });
    }
  } catch (oauthErr) {
    console.warn('OAuth sheet sync check skipped:', oauthErr);
  }

  return record;
}

/**
 * Retrieve all local submissions
 */
export function getLocalSubmissions(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all submissions (for test resets)
 */
export function clearSubmissions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COUNTER_KEY);
  } catch {
    // ignore
  }
}

