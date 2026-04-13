'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

const PlurioBrand = {
  yellow: '#F5E642',
  navy: '#1B1A2E',
  navyMid: '#2D2C45',
  gray: '#F7F7F9',
  grayMid: '#E8E8EC',
  muted: '#6B6B80',
  border: '#E2E2E8',
  white: '#FFFFFF',
}

const PlurioLogo = () => (
  <a href="https://plurio.ai" className="flex items-center gap-2.5 no-underline">
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: PlurioBrand.yellow,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <ellipse cx="12" cy="12" rx="9" ry="4.5" stroke={PlurioBrand.navy} strokeWidth="2"/>
        <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke={PlurioBrand.navy} strokeWidth="2"/>
        <circle cx="12" cy="12" r="2.5" fill={PlurioBrand.navy}/>
      </svg>
    </div>
    <div>
      <span style={{ fontSize: 20, fontWeight: 800, color: PlurioBrand.navy, letterSpacing: -0.5 }}>p<span style={{ color: PlurioBrand.navy }}>L</span>urio</span>
    </div>
  </a>
)

const processingSteps = [
  'Parsing transcript structure…',
  'Extracting key insights…',
  'Fact-checking claims…',
  'Crafting narrative arc…',
  'Generating intelligence report…',
]

export default function HomePage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileText, setFileText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const readFile = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(f)
    })

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.match(/\.(txt|md)$/i)) {
      setError('Please upload a .txt or .md transcript file.')
      return
    }
    if (f.size > 500_000) {
      setError('File too large (max 500KB). Please trim the transcript.')
      return
    }
    setError(null)
    setFile(f)
    const text = await readFile(f)
    setFileText(text)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const generateReport = async () => {
    if (!fileText) return
    setIsProcessing(true)
    setError(null)
    const interval = setInterval(() =>
      setProcessingStep(prev => Math.min(prev + 1, processingSteps.length - 1)), 2200)
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: fileText }),
      })
      clearInterval(interval)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Processing failed')
      }
      const data = await res.json()
      sessionStorage.setItem('plurio_report', JSON.stringify(data))
      sessionStorage.setItem('plurio_filename', file?.name || 'transcript.txt')
      router.push('/gate')
    } catch (err: unknown) {
      clearInterval(interval)
      setIsProcessing(false)
      setProcessingStep(0)
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: PlurioBrand.white, display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', borderBottom: `1px solid ${PlurioBrand.border}`,
        background: PlurioBrand.white,
      }}>
        <PlurioLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="https://plurio.ai" style={{ fontSize: 14, fontWeight: 600, color: PlurioBrand.muted, textDecoration: 'none' }}>
            About
          </a>
          <a href="https://plurio.ai" style={{
            fontSize: 14, fontWeight: 700, color: PlurioBrand.white,
            background: PlurioBrand.navy, padding: '9px 20px', borderRadius: 999,
            textDecoration: 'none', letterSpacing: 0.3,
          }}>
            BOOK A DEMO
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: 680, width: '100%', textAlign: 'center' }}>

          {/* Badge */}
          <div className="animate-fade-up opacity-0 anim-delay-1" style={{ marginBottom: 28 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: PlurioBrand.yellow, borderRadius: 999,
              padding: '6px 16px', fontSize: 12, fontWeight: 700,
              color: PlurioBrand.navy, letterSpacing: 0.5,
            }}>
              ✦ Plurio Intelligence Engine
            </span>
          </div>

          <h1 className="animate-fade-up opacity-0 anim-delay-2" style={{
            fontSize: 56, fontWeight: 800, lineHeight: 1.1,
            color: PlurioBrand.navy, marginBottom: 20, letterSpacing: -1.5,
          }}>
            Turn interviews into<br />
            <span style={{ color: PlurioBrand.navyMid, fontStyle: 'italic' }}>intelligence reports.</span>
          </h1>

          <p className="animate-fade-up opacity-0 anim-delay-3" style={{
            fontSize: 18, color: PlurioBrand.muted, lineHeight: 1.7,
            marginBottom: 52, maxWidth: 480, margin: '0 auto 52px',
          }}>
            Drop your transcript. Get a Plurio-branded PDF with extracted insights,
            key quotes, market signals, and editorial narrative — in seconds.
          </p>

          {/* Upload Zone */}
          <div className="animate-fade-up opacity-0 anim-delay-4" style={{ marginTop: 8 }}>
            {!isProcessing ? (
              <>
                <div
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? PlurioBrand.navy : file ? PlurioBrand.navy : PlurioBrand.grayMid}`,
                    borderRadius: 20,
                    padding: '52px 32px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isDragging ? PlurioBrand.gray : file ? PlurioBrand.gray : PlurioBrand.white,
                  }}
                >
                  {file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: PlurioBrand.yellow,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={PlurioBrand.navy} strokeWidth="2">
                          <path d="M9 12l2 2 4-4M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 16, color: PlurioBrand.navy, margin: 0 }}>{file.name}</p>
                        <p style={{ fontSize: 13, color: PlurioBrand.muted, marginTop: 4 }}>
                          {(file.size / 1024).toFixed(0)}KB · {fileText.split(/\s+/).length.toLocaleString()} words
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setFileText('') }}
                        style={{ fontSize: 12, color: PlurioBrand.muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: PlurioBrand.gray,
                        border: `1.5px solid ${PlurioBrand.grayMid}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={PlurioBrand.navyMid} strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="18" x2="12" y2="12" strokeLinecap="round"/>
                          <line x1="9" y1="15" x2="12" y2="12" strokeLinecap="round"/>
                          <line x1="15" y1="15" x2="12" y2="12" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: PlurioBrand.navy, margin: 0 }}>Drop your transcript here</p>
                        <p style={{ fontSize: 13, color: PlurioBrand.muted, marginTop: 4 }}>or click to browse · .txt or .md</p>
                      </div>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".txt,.md" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} style={{ display: 'none' }} />
                </div>

                {error && (
                  <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10, background: '#FFF0EE', border: '1px solid #FFCDC7', color: '#C0392B', fontSize: 13 }}>
                    {error}
                  </div>
                )}

                {file && (
                  <button
                    onClick={generateReport}
                    style={{
                      marginTop: 20, width: '100%', padding: '17px 32px',
                      borderRadius: 14, border: 'none', cursor: 'pointer',
                      background: PlurioBrand.navy, color: PlurioBrand.white,
                      fontSize: 16, fontWeight: 700, letterSpacing: 0.3,
                      fontFamily: 'inherit',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Generate Intelligence Report →
                  </button>
                )}
              </>
            ) : (
              /* Processing */
              <div style={{
                border: `1.5px solid ${PlurioBrand.border}`,
                borderRadius: 20, padding: '52px 32px', textAlign: 'center',
                background: PlurioBrand.gray,
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="dot-pulse" style={{ width: 10, height: 10, borderRadius: '50%', background: PlurioBrand.navy, animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: PlurioBrand.navy, marginBottom: 8 }}>
                  {processingSteps[processingStep]}
                </p>
                <p style={{ fontSize: 13, color: PlurioBrand.muted }}>
                  Step {processingStep + 1} of {processingSteps.length}
                </p>
                <div style={{ marginTop: 28, height: 4, borderRadius: 999, background: PlurioBrand.grayMid, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999, background: PlurioBrand.yellow,
                    width: `${((processingStep + 1) / processingSteps.length) * 100}%`,
                    transition: 'width 0.6s ease', border: `1px solid ${PlurioBrand.yellow}`,
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* What you get */}
          {!isProcessing && (
            <div className="animate-fade-up opacity-0 anim-delay-5" style={{ marginTop: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: PlurioBrand.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
                What you get
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {['Executive Summary', 'Key Insights', 'Notable Quotes', 'Market Signals', 'Action Recommendations', 'Plurio PDF Report'].map(item => (
                  <span key={item} style={{
                    fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999,
                    background: PlurioBrand.gray, color: PlurioBrand.navy,
                    border: `1px solid ${PlurioBrand.border}`,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${PlurioBrand.border}`, padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: 13, color: PlurioBrand.muted, margin: 0 }}>© 2025 Plurio by Elly Analytics</p>
        <a href="https://plurio.ai" style={{ fontSize: 13, color: PlurioBrand.muted, textDecoration: 'none', fontWeight: 600 }}>plurio.ai</a>
      </footer>
    </div>
  )
}
