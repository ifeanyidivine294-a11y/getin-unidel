import { SubmissionRecord } from '../types';

const STORAGE_SPREADSHEET_ID_KEY = 'eg_google_spreadsheet_id';
const STORAGE_SPREADSHEET_TITLE_KEY = 'eg_google_spreadsheet_title';

export interface SheetConnectionInfo {
  spreadsheetId: string | null;
  spreadsheetTitle: string | null;
  spreadsheetUrl: string | null;
}

export function getConnectedSpreadsheetId(): string | null {
  try {
    return localStorage.getItem(STORAGE_SPREADSHEET_ID_KEY);
  } catch {
    return null;
  }
}

export function getConnectedSpreadsheetTitle(): string | null {
  try {
    return localStorage.getItem(STORAGE_SPREADSHEET_TITLE_KEY);
  } catch {
    return null;
  }
}

export function setConnectedSpreadsheet(id: string, title?: string): void {
  try {
    if (!id || !id.trim()) {
      localStorage.removeItem(STORAGE_SPREADSHEET_ID_KEY);
      localStorage.removeItem(STORAGE_SPREADSHEET_TITLE_KEY);
    } else {
      const cleanId = extractSpreadsheetId(id.trim());
      localStorage.setItem(STORAGE_SPREADSHEET_ID_KEY, cleanId);
      if (title) {
        localStorage.setItem(STORAGE_SPREADSHEET_TITLE_KEY, title);
      }
    }
  } catch (err) {
    console.warn('Failed to save spreadsheet to localStorage:', err);
  }
}

/**
 * Extracts spreadsheet ID from either a full Google Sheets URL or raw ID
 */
export function extractSpreadsheetId(urlOrId: string): string {
  const trimmed = urlOrId.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export const SHEET_COLUMNS = [
  'Submission ID',
  'Date',
  'Time',
  'Service Type',
  'Applicant Name',
  'Phone Number',
  'Email Address',
  'Payment Status',
  'Processing Status',
  'Summary Details',
  'Full Data / Notes'
];

/**
 * Extracts student email address accurately from any submission record structure
 */
export function extractRecordEmail(record: SubmissionRecord): string {
  if (record.email && record.email.trim() && record.email !== 'N/A' && record.email !== 'Optional - Not provided') {
    return record.email.trim();
  }
  const f = record.allFields || {};
  if (typeof f.email === 'string' && f.email.trim() && f.email !== 'N/A' && f.email !== 'Optional - Not provided') {
    return f.email.trim();
  }
  if (typeof f.emailAddress === 'string' && f.emailAddress.trim() && f.emailAddress !== 'N/A') {
    return f.emailAddress.trim();
  }
  if (typeof f.studentEmail === 'string' && f.studentEmail.trim() && f.studentEmail !== 'N/A') {
    return f.studentEmail.trim();
  }
  if (f.acceptanceLetter && typeof f.acceptanceLetter === 'object') {
    const acc = f.acceptanceLetter as any;
    if (acc.email && typeof acc.email === 'string' && acc.email.trim()) {
      return acc.email.trim();
    }
  }
  return '';
}

/**
 * Creates a dedicated "Easy Getin - UNIDEL Student Submissions" spreadsheet in the user's Google Drive/Sheets
 */
export async function createEasyGetinSpreadsheet(
  accessToken: string,
  customTitle?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; title: string }> {
  const title = customTitle || 'Easy Getin — UNIDEL Student Submissions';

  const payload = {
    properties: {
      title
    },
    sheets: [
      {
        properties: {
          title: 'Submissions',
          gridProperties: {
            rowCount: 1000,
            columnCount: 11,
            frozenRowCount: 1
          }
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: SHEET_COLUMNS.map((col) => ({
                  userEnteredValue: { stringValue: col },
                  userEnteredFormat: {
                    backgroundColor: { red: 0.043, green: 0.075, blue: 0.169 },
                    textFormat: {
                      bold: true,
                      foregroundColor: { red: 1, green: 1, blue: 1 },
                      fontSize: 10
                    },
                    horizontalAlignment: 'CENTER'
                  }
                }))
              }
            ]
          }
        ]
      }
    ]
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Sheets API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  setConnectedSpreadsheet(spreadsheetId, title);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title
  };
}

/**
 * Updates Row 1 in an existing Google Sheet to match the updated 11-column structure with Email Address
 */
export async function updateSpreadsheetHeaders(
  accessToken: string,
  spreadsheetId: string
): Promise<{ success: boolean; message: string }> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const targets = ['Submissions!A1:K1', 'Sheet1!A1:K1', 'A1:K1'];
  let updated = false;

  for (const target of targets) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
      target
    )}?valueInputOption=USER_ENTERED`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: target,
          majorDimension: 'ROWS',
          values: [SHEET_COLUMNS]
        })
      });

      if (res.ok) {
        updated = true;
        break;
      }
    } catch {
      // continue to next target
    }
  }

  if (!updated) {
    return {
      success: false,
      message: 'Could not update sheet headers. Please verify spreadsheet edit permissions.'
    };
  }

  return {
    success: true,
    message: 'Spreadsheet headers updated successfully with Email Address in Column G!'
  };
}

/**
 * Verifies access to an existing spreadsheet and returns its details
 */
export async function verifySpreadsheetAccess(
  accessToken: string,
  spreadsheetId: string
): Promise<{ title: string; sheets: string[] }> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cleanId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Could not access Google Sheet (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const title = data.properties?.title || 'Connected Spreadsheet';
  const sheets = (data.sheets || []).map((s: any) => s.properties?.title || 'Sheet1');

  setConnectedSpreadsheet(cleanId, title);

  return { title, sheets };
}

/**
 * Appends a submission record directly to the connected Google Sheet
 */
export async function appendSubmissionToSheet(
  accessToken: string,
  spreadsheetId: string,
  record: SubmissionRecord
): Promise<boolean> {
  const cleanId = extractSpreadsheetId(spreadsheetId);

  // Format row values matching the 11 headers
  const emailValue = extractRecordEmail(record);

  const rowValues = [
    record.submissionId,
    record.date,
    record.time,
    record.service,
    record.fullName,
    record.phoneNumber,
    emailValue,
    record.paymentStatus || 'Pending',
    record.processingStatus || 'Submitted',
    record.notes || '',
    JSON.stringify(record.allFields || {})
  ];

  // Try appending to "Submissions" tab, or fallback to Sheet1 or range A:K
  const range = 'Submissions!A:K';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [rowValues]
      })
    });

    if (!response.ok) {
      // If Submissions tab does not exist, try general range A:K
      const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/A:K:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      });

      if (!fallbackRes.ok) {
        const err = await fallbackRes.text();
        console.error('Failed to append to Google Sheet:', err);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Error appending row to Google Sheet:', err);
    return false;
  }
}

/**
 * Batch syncs multiple submission records to the connected Google Sheet
 */
export async function syncSubmissionsBatchToSheet(
  accessToken: string,
  spreadsheetId: string,
  records: SubmissionRecord[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!records || records.length === 0) {
    return { success: true, count: 0 };
  }

  const cleanId = extractSpreadsheetId(spreadsheetId);

  const rows = records.map((record) => {
    const emailVal = extractRecordEmail(record);
    return [
      record.submissionId,
      record.date,
      record.time,
      record.service,
      record.fullName,
      record.phoneNumber,
      emailVal,
      record.paymentStatus || 'Pending',
      record.processingStatus || 'Submitted',
      record.notes || '',
      JSON.stringify(record.allFields || {})
    ];
  });

  const range = 'Submissions!A:K';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  try {
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: rows })
    });

    if (!res.ok) {
      const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/A:K:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
      res = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: rows })
      });
    }

    if (!res.ok) {
      const err = await res.text();
      return { success: false, count: 0, error: err };
    }

    return { success: true, count: records.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Network error' };
  }
}
