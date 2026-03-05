import React, { useState, useRef } from 'react';
import Sidebar from '../components/common/Sidebar';
import { excelAPI } from '../services/api';

export default function ExcelAgent() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [formula, setFormula] = useState('');
  const [fLoading, setFLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await excelAPI.analyze(fd);
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || err.message });
    } finally { setLoading(false); }
  };

  const askFormula = async () => {
    if (!question.trim()) return;
    setFLoading(true);
    try {
      const res = await excelAPI.formulaAssist({ question, context: file?.name });
      setFormula(res.data.answer);
    } catch (err) {
      setFormula('Error: ' + (err.response?.data?.error || err.message));
    } finally { setFLoading(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, overflowX: 'hidden' }}>
        {/* Header */}
        <div className="page-header" style={{ padding: '20px 32px', borderBottom: '1px solid #1A2D45', background: '#080D16' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#E8EDF5' }}>Excel AI Agent</h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', marginTop: '4px' }}>
            Upload financial statements · Get AI analysis · Formula assistance
          </div>
        </div>

        <div className="page-content" style={{ padding: '28px 32px' }}>
          <div className="excel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Upload */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', letterSpacing: '0.08em', marginBottom: '16px' }}>
                ⬡ UPLOAD FINANCIAL DOCUMENT
              </div>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => inputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? '#C8A84B' : '#1A2D45'}`,
                  borderRadius: '12px', padding: '48px', textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'rgba(200,168,75,0.05)' : '#0D1520',
                  transition: 'all 0.2s', marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>⬡</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#E8EDF5', marginBottom: '8px' }}>
                  {file ? file.name : 'Drop your Excel file here'}
                </div>
                <div style={{ color: '#7A94B0', fontSize: '13px' }}>
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Click to change` : 'Supports .xlsx · .xls · .csv'}
                </div>
                <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </div>

              {file && (
                <button className="btn-primary" onClick={analyze} disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '14px', opacity: loading ? 0.7 : 1 }}>
                  {loading ? '⬡ Analysing with Claude...' : '⬡ Analyse Document'}
                </button>
              )}

              {/* Supported types */}
              <div style={{ marginTop: '24px', background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  SUPPORTED DOCUMENT TYPES
                </div>
                {[
                  'Annual Reports (P&L, Balance Sheet, Cash Flow)',
                  'Portfolio statements',
                  'Mutual fund NAV sheets',
                  'Corporate earnings data',
                  'NSE/BSE bulk deal sheets',
                  'FII/DII flow data',
                ].map(t => (
                  <div key={t} style={{ fontSize: '13px', color: '#7A94B0', padding: '6px 0', borderBottom: '1px solid #111D2E', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#00D68F' }}>✓</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div>
              {result?.error && (
                <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '8px', padding: '16px', color: '#FF4757', fontSize: '14px' }}>
                  ⚠️ {result.error}
                </div>
              )}

              {result && !result.error && (
                <>
                  <div style={{ background: '#0D1520', border: '1px solid rgba(200,168,75,0.2)', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C8A84B', letterSpacing: '0.08em', marginBottom: '12px' }}>◆ AI ANALYSIS</div>
                    <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#E8EDF5', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
                      {result.aiAnalysis}
                    </div>
                  </div>
                  <div style={{ background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px', padding: '20px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7A94B0', marginBottom: '12px' }}>FILE METADATA</div>
                    <div style={{ fontSize: '13px', color: '#E8EDF5' }}><b style={{ color: '#7A94B0' }}>Filename:</b> {result.filename}</div>
                    <div style={{ fontSize: '13px', color: '#E8EDF5', marginTop: '6px' }}><b style={{ color: '#7A94B0' }}>Sheets:</b> {result.sheets?.join(', ')}</div>
                    {result.rowCounts && Object.entries(result.rowCounts).map(([k, v]) => (
                      <div key={k} style={{ fontSize: '13px', color: '#E8EDF5', marginTop: '4px' }}><b style={{ color: '#7A94B0' }}>{k}:</b> {v} rows</div>
                    ))}
                  </div>
                </>
              )}

              {!result && !loading && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#3D5470' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>⬡</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Upload a file to see AI analysis</div>
                </div>
              )}
            </div>
          </div>

          {/* Formula assistant */}
          <div style={{ marginTop: '32px', background: '#0D1520', border: '1px solid #1A2D45', borderRadius: '10px', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D4FF', letterSpacing: '0.08em', marginBottom: '16px' }}>
              ⬡ EXCEL FORMULA ASSISTANT
            </div>
            <div className="excel-formula-row" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askFormula()}
                placeholder="e.g. How do I calculate CAGR in Excel for 5 years?"
                style={{ flex: 1 }}
              />
              <button className="btn-primary" onClick={askFormula} disabled={fLoading || !question.trim()} style={{ opacity: fLoading ? 0.7 : 1 }}>
                {fLoading ? 'Asking...' : 'Ask Claude →'}
              </button>
            </div>
            {formula && (
              <div style={{ background: '#080D16', border: '1px solid #1A2D45', borderRadius: '8px', padding: '20px', fontSize: '14px', lineHeight: '1.8', color: '#E8EDF5', whiteSpace: 'pre-wrap' }}>
                {formula}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
