import React, { useState, useEffect } from 'react';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  getCurrentUser
} from '../services/googleAuthService';
import {
  getConnectedSpreadsheetId,
  getConnectedSpreadsheetTitle,
  createEasyGetinSpreadsheet,
  verifySpreadsheetAccess,
  syncSubmissionsBatchToSheet,
  setConnectedSpreadsheet,
  extractSpreadsheetId,
  updateSpreadsheetHeaders,
  SHEET_COLUMNS
} from '../services/googleSheetsService';
import {
  getLocalSubmissions,
  getGoogleSheetsWebhookUrl,
  setGoogleSheetsWebhookUrl
} from '../services/submissionService';
import {
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  X,
  AlertCircle,
  PlusCircle,
  Link as LinkIcon,
  LogOut,
  ShieldCheck,
  Table,
  Mail,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Columns3,
  Code
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpdatingHeaders, setIsUpdatingHeaders] = useState(false);
  const [showColumnsList, setShowColumnsList] = useState(true);
  const [showAppsScript, setShowAppsScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [sheetTitle, setSheetTitle] = useState<string | null>(null);
  const [customSheetInput, setCustomSheetInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  useEffect(() => {
    // Check initial state
    setSheetId(getConnectedSpreadsheetId());
    setSheetTitle(getConnectedSpreadsheetTitle());

    const unsubscribe = initAuth(
      (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );

    const currentUser = getCurrentUser();
    const currentToken = getAccessToken();
    if (currentUser) setUser(currentUser);
    if (currentToken) setToken(currentToken);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setStatusMessage({
          type: 'success',
          text: `Signed in as ${res.user.email || res.user.displayName || 'Google User'}`
        });

        // If sheet already connected, verify it
        const currentSheetId = getConnectedSpreadsheetId();
        if (currentSheetId) {
          try {
            const verified = await verifySpreadsheetAccess(res.accessToken, currentSheetId);
            setSheetTitle(verified.title);
          } catch {
            // keep existing title
          }
        }
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to sign in with Google. Please try again.'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logoutGoogle();
      setUser(null);
      setToken(null);
      setStatusMessage({
        type: 'info',
        text: 'Signed out of Google.'
      });
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleCreateNewSheet = async () => {
    const activeToken = token || getAccessToken();
    if (!activeToken) {
      setStatusMessage({
        type: 'error',
        text: 'Please sign in with Google first before creating your spreadsheet.'
      });
      return;
    }

    setIsCreatingSheet(true);
    setStatusMessage(null);

    try {
      const result = await createEasyGetinSpreadsheet(activeToken);
      setSheetId(result.spreadsheetId);
      setSheetTitle(result.title);

      setStatusMessage({
        type: 'success',
        text: `Created "${result.title}" in your Google Drive!`
      });

      // Automatically sync local submissions
      const locals = getLocalSubmissions();
      if (locals.length > 0) {
        setIsSyncing(true);
        const syncRes = await syncSubmissionsBatchToSheet(activeToken, result.spreadsheetId, locals);
        if (syncRes.success) {
          setSyncedCount(syncRes.count);
          setStatusMessage({
            type: 'success',
            text: `Created sheet and synced ${syncRes.count} existing submissions!`
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to create sheet:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to create Google Sheet. Ensure pop-ups or permissions are allowed.'
      });
    } finally {
      setIsCreatingSheet(false);
      setIsSyncing(false);
    }
  };

  const handleConnectExistingSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSheetInput.trim()) return;

    const activeToken = token || getAccessToken();
    if (!activeToken) {
      setStatusMessage({
        type: 'error',
        text: 'Please sign in with Google first.'
      });
      return;
    }

    const cleanId = extractSpreadsheetId(customSheetInput);
    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const verified = await verifySpreadsheetAccess(activeToken, cleanId);
      setSheetId(cleanId);
      setSheetTitle(verified.title);
      setCustomSheetInput('');

      setStatusMessage({
        type: 'success',
        text: `Connected to "${verified.title}"!`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Could not access spreadsheet. Check that your Google account has edit access.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncAllNow = async () => {
    const activeToken = token || getAccessToken();
    if (!activeToken || !sheetId) {
      setStatusMessage({
        type: 'error',
        text: 'Please ensure you are signed in and a Google Sheet is connected.'
      });
      return;
    }

    const submissions = getLocalSubmissions();
    if (submissions.length === 0) {
      setStatusMessage({
        type: 'info',
        text: 'No local submissions to sync yet. Make a submission to test!'
      });
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const res = await syncSubmissionsBatchToSheet(activeToken, sheetId, submissions);
      if (res.success) {
        setSyncedCount(res.count);
        setStatusMessage({
          type: 'success',
          text: `Successfully synced all ${res.count} submissions to your Google Sheet!`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to sync submissions.'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Sync failed.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateHeaders = async () => {
    const activeToken = token || getAccessToken();
    if (!activeToken || !sheetId) {
      setStatusMessage({
        type: 'error',
        text: 'Please ensure you are signed in and a Google Sheet is connected.'
      });
      return;
    }

    setIsUpdatingHeaders(true);
    setStatusMessage(null);

    try {
      const res = await updateSpreadsheetHeaders(activeToken, sheetId);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: res.message
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to update sheet headers.'
      });
    } finally {
      setIsUpdatingHeaders(false);
    }
  };

  const appsScriptCode = `function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Submissions") || ss.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission ID", "Date", "Time", "Service Type",
        "Applicant Name", "Phone Number", "Email Address",
        "Payment Status", "Processing Status", "Summary Details", "Full Data / Notes"
      ]);
    }
    var data = JSON.parse(e.postData.contents);
    var email = data.email || (data.allFields && (data.allFields.email || data.allFields.emailAddress || data.allFields.studentEmail)) || "";
    sheet.appendRow([
      data.submissionId || "",
      data.date || new Date().toISOString().split("T")[0],
      data.time || "",
      data.service || "",
      data.fullName || "",
      data.phoneNumber || "",
      email,
      data.paymentStatus || "Pending",
      data.processingStatus || "Submitted",
      data.notes || "",
      JSON.stringify(data.allFields || {})
    ]);
    return ContentService.createTextOutput(JSON.stringify({ result: "success", submissionId: data.submissionId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleDisconnectSheet = () => {
    setConnectedSpreadsheet('');
    setSheetId(null);
    setSheetTitle(null);
    setStatusMessage({
      type: 'info',
      text: 'Disconnected spreadsheet.'
    });
  };

  const localSubmissions = getLocalSubmissions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#0B132B] text-white p-6 sm:p-7 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-white">
                  Google Sheets Direct Sync
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Direct integration with your personal Google account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer relative"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2.5 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : statusMessage.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* STEP 1: GOOGLE ACCOUNT AUTHENTICATION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Google Account Connection
              </span>
              {user && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authenticated
                </span>
              )}
            </div>

            {!user ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3">
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Authorize your Google Account to automatically create and sync UNIDEL student submissions directly to your Google Sheets.
                </p>

                {/* Official Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all text-xs sm:text-sm font-semibold text-slate-800 hover:border-slate-400 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google Profile'}
                      className="w-10 h-10 rounded-full border border-emerald-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                      {(user.displayName || user.email || 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      {user.displayName || 'Google User'}
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: CONNECTED SPREADSHEET */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Google Sheet Destination
            </span>

            {sheetId ? (
              <div className="bg-white border-2 border-emerald-400/60 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Table className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {sheetTitle || 'Easy Getin — UNIDEL Student Submissions'}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-xs">
                        ID: {sheetId}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <span>Open Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">{localSubmissions.length}</span> submissions stored locally.
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUpdateHeaders}
                      disabled={isUpdatingHeaders}
                      title="Update and align Row 1 headers with Email Address in Column G"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Columns3 className={`w-3.5 h-3.5 ${isUpdatingHeaders ? 'animate-spin' : ''}`} />
                      <span>{isUpdatingHeaders ? 'Updating...' : 'Update Headers (Add Email Col)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSyncAllNow}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync All Submissions'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDisconnectSheet}
                      className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1-Click Create Button */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Create "Easy Getin UNIDEL Submissions" Sheet
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Automatically creates a pre-formatted spreadsheet in your Google Drive with columns for student details, contact info, letters, and payment status.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateNewSheet}
                    disabled={isCreatingSheet || !user}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isCreatingSheet ? 'Creating in Google Drive...' : '1-Click Create & Connect'}</span>
                  </button>
                  {!user && (
                    <p className="text-[11px] text-amber-700">
                      * Please sign in with Google in Step 1 first.
                    </p>
                  )}
                </div>

                {/* Or paste existing spreadsheet link */}
                <form onSubmit={handleConnectExistingSheet} className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Or link an existing Google Sheet:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste Google Sheet URL or Spreadsheet ID"
                      value={customSheetInput}
                      onChange={(e) => setCustomSheetInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isSyncing || !customSheetInput.trim() || !user}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Link</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* STEP 3: SPREADSHEET STRUCTURE & INTEGRATION DETAILS */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowColumnsList(!showColumnsList)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <Columns3 className="w-4 h-4 text-emerald-600" />
                <span>Spreadsheet Column Layout (11 Columns)</span>
                {showColumnsList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Email in Col G
              </span>
            </div>

            {showColumnsList && (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] text-slate-500">
                  Every submission from the Acceptance Letter, Affidavit of Good Conduct, and Registration forms writes into these columns:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                  {SHEET_COLUMNS.map((col, idx) => (
                    <div
                      key={col}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${
                        col === 'Email Address'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 font-medium'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] font-mono shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="truncate">{col}</span>
                      {col === 'Email Address' && (
                        <span className="ml-auto text-[8px] bg-emerald-600 text-white px-1 py-0.2 rounded font-bold uppercase">
                          Updated
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: GOOGLE APPS SCRIPT ALTERNATIVE AUTOMATION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAppsScript(!showAppsScript)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <Code className="w-4 h-4 text-blue-600" />
                <span>Google Apps Script Automation (Optional)</span>
                {showAppsScript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[10px] text-slate-500 font-medium">
                Webhook Sync
              </span>
            </div>

            {showAppsScript && (
              <div className="space-y-3 pt-1">
                <p className="text-[11px] text-slate-600">
                  If you prefer Google Apps Script to auto-append rows via webhook, paste this script into your Google Sheet (<strong>Extensions &gt; Apps Script</strong>) and deploy as a Web App:
                </p>

                <div className="relative bg-slate-900 rounded-xl p-3 text-emerald-400 font-mono text-[10px] leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans font-medium transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <pre>{appsScriptCode}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Real-time synchronization active for all submitted forms
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
