'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const PlurioPDFDownload = dynamic(() => import('../../components/PlurioPDFDownload'), {
  ssr: false,
  loading: () => (
    <button disabled style={{
      width: '100%', padding: '16px', borderRadius: 12, border: 'none',
      background: '#E8E8EC', color: '#6B6B80', fontSize: 15, fontWeight: 700,
      fontFamily: 'inherit', cursor: 'not-allowed',
    }}>
      Loading PDF engine…
    </button>
  ),
})

const B = {
  yellow: '#F5E642', navy: '#1B1A2E', navyMid: '#2D2C45',
  gray: '#F7F7F9', grayMid: '#E8E8EC', muted: '#6B6B80',
  border: '#E2E2E8', white: '#FFFFFF',
}

type Insight = { number: number; headline: string; body: string; evidence: string }
type Quote = { quote: string; speaker: string; context: string }
type Signal = { signal: string; implication: string }
type Action = { action: string; priority: 'high' | 'medium' | 'low'; for_whom: string }
interface Report {
  meta: { title: string; subtitle: string; guest_name: string; guest_title: string; interviewer_name: string; publication_date: string; read_time: string; tags: string[] }
  executive_summary: string; guest_bio: string
  key_insights: Insight[]; notable_quotes: Quote[]
  market_signals: Signal[]; recommended_actions: Action[]
  closing_thought: string
}

const priorityColors = (p: string) => {
  if (p === 'high') return { bg: '#FFF0EE', text: '#C0392B', border: '#FFCDC7' }
  if (p === 'medium') return { bg: '#FFF9E0', text: '#8B7000', border: '#F5E642' }
  return { bg: B.gray, text: B.muted, border: B.border }
}

const PlurioLogo = () => (
  <a href="https://plurio.ai" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: B.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <ellipse cx="12" cy="12" rx="9" ry="4.5" stroke={B.navy} strokeWidth="2"/>
        <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke={B.navy} strokeWidth="2"/>
        <circle cx="12" cy="12" r="2.5" fill={B.navy}/>
      </svg>
    </div>
    <span style={{ fontSize: 20, fontWeight: 800, color: B.navy, letterSpacing: -0.5 }}>pLurio</span>
  </a>
)

const SectionLabel = ({ children, color = B.muted }: { children: string; color?: string }) => (
  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color, marginBottom: 16, margin: '0 0 16px' }}>
    {children}
  </p>
)

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: B.white, border: `1.5px solid ${B.border}`, borderRadius: 16, padding: 28, ...style }}>
    {children}
  </div>
)

export default function GatePage() {
  const [report, setReport] = useState<Report | null>(null)
  const [gated, setGated] = useState(true)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('plurio_report')
    if (!stored) { router.push('/'); return }
    try { setReport(JSON.parse(stored)) } catch { router.push('/') }
  }, [router])

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) { setFormError('Please enter a valid email.'); return }
    setSubmitting(true); setFormError('')
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false); setGated(false)
    setTimeout(() => document.getElementById('report-top')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  if (!report) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: B.white }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[0,1,2].map(i => <div key={i} className="dot-pulse" style={{ width: 10, height: 10, borderRadius: '50%', background: B.navy, animationDelay: `${i*0.2}s` }} />)}
      </div>
    </div>
  )

  const safeFilename = report.meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60)

  return (
    <div style={{ minHeight: '100vh', background: B.gray, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: B.white, borderBottom: `1px solid ${B.border}`, padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <PlurioLogo />
        <button onClick={() => router.push('/')} style={{ fontSize: 13, fontWeight: 600, color: B.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
          ← New report
        </button>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Report Header */}
        <div id="report-top" style={{ marginBottom: 36 }} className="animate-fade-up opacity-0 anim-delay-1">

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {report.meta.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: B.yellow, color: B.navy, letterSpacing: 0.5 }}>
                {tag.toUpperCase()}
              </span>
            ))}
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 800, color: B.navy, lineHeight: 1.15, marginBottom: 14, letterSpacing: -0.8 }}>
            {report.meta.title}
          </h1>
          <p style={{ fontSize: 18, color: B.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 580 }}>
            {report.meta.subtitle}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, fontSize: 13, color: B.muted }}>
            <span>🕐 {report.meta.read_time}</span>
            <span style={{ color: B.border }}>·</span>
            <span>{report.meta.publication_date}</span>
            <span style={{ color: B.border }}>·</span>
            <span>Interview with <strong style={{ color: B.navy }}>{report.meta.guest_name}</strong></span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="animate-fade-up opacity-0 anim-delay-2" style={{ marginBottom: 20 }}>
          <Card style={{ borderLeft: `4px solid ${B.yellow}` }}>
            <SectionLabel>Executive Summary</SectionLabel>
            <p style={{ fontSize: 17, color: B.navy, lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
              {report.executive_summary}
            </p>
          </Card>
        </div>

        {/* First insight - always visible */}
        {report.key_insights[0] && (
          <div className="animate-fade-up opacity-0 anim-delay-3" style={{ marginBottom: 20 }}>
            <Card>
              <SectionLabel>Key Insights</SectionLabel>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: B.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800, color: B.navy }}>
                  01
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: B.navy, margin: '0 0 8px', lineHeight: 1.3 }}>
                    {report.key_insights[0].headline}
                  </h3>
                  <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, margin: 0 }}>
                    {report.key_insights[0].body}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* GATE */}
        {gated ? (
          <div style={{ position: 'relative', marginBottom: 20 }} className="animate-fade-up opacity-0 anim-delay-4">
            {/* Blurred preview */}
            <div className="gate-blur" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} aria-hidden>
              {report.key_insights.slice(1, 3).map((insight, i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: B.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800, color: B.navy }}>
                      0{i + 2}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: B.navy, margin: '0 0 8px' }}>{insight.headline}</h3>
                      <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, margin: 0 }}>{insight.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {report.notable_quotes[0] && (
                <Card>
                  <blockquote style={{ fontSize: 17, fontStyle: 'italic', color: B.navy, lineHeight: 1.65, margin: 0 }}>
                    &ldquo;{report.notable_quotes[0].quote}&rdquo;
                  </blockquote>
                </Card>
              )}
            </div>

            {/* Gate form overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, transparent 0%, rgba(247,247,249,0.9) 30%, rgba(247,247,249,1) 60%)' }}>
              <div style={{ width: '100%', maxWidth: 440, marginTop: 80, padding: '0 16px' }}>
                <div style={{ background: B.white, border: `1.5px solid ${B.border}`, borderRadius: 20, padding: 36, boxShadow: '0 8px 40px rgba(27,26,46,0.08)' }}>

                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: B.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={B.navy} strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: B.navy, margin: '0 0 8px' }}>Get Full Report</h2>
                    <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>
                      Unlock all {report.key_insights.length} insights, quotes, and the full Plurio PDF — free.
                    </p>
                  </div>

                  <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input
                      type="email" placeholder="your@email.com" value={email}
                      onChange={e => setEmail(e.target.value)} required
                      style={{ padding: '13px 16px', borderRadius: 10, border: `1.5px solid ${B.border}`, fontSize: 14, fontFamily: 'inherit', color: B.navy, outline: 'none', background: B.white }}
                      onFocus={e => e.target.style.borderColor = B.navy}
                      onBlur={e => e.target.style.borderColor = B.border}
                    />
                    <input
                      type="text" placeholder="Company (optional)" value={company}
                      onChange={e => setCompany(e.target.value)}
                      style={{ padding: '13px 16px', borderRadius: 10, border: `1.5px solid ${B.border}`, fontSize: 14, fontFamily: 'inherit', color: B.navy, outline: 'none', background: B.white }}
                      onFocus={e => e.target.style.borderColor = B.navy}
                      onBlur={e => e.target.style.borderColor = B.border}
                    />
                    {formError && <p style={{ fontSize: 12, color: '#C0392B', margin: 0 }}>{formError}</p>}
                    <button type="submit" disabled={submitting} style={{
                      padding: '15px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: B.navy, color: B.white, fontSize: 15, fontWeight: 700,
                      fontFamily: 'inherit', opacity: submitting ? 0.7 : 1, marginTop: 4,
                    }}>
                      {submitting ? 'Unlocking…' : 'Get Full Report + PDF →'}
                    </button>
                    <p style={{ fontSize: 11, color: B.muted, textAlign: 'center', margin: '4px 0 0' }}>
                      No spam. Plurio only. Unsubscribe anytime.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* UNLOCKED */
          <div className="animate-fade-in opacity-0" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Remaining insights */}
            {report.key_insights.slice(1).map((insight, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: B.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800, color: B.navy }}>
                    {String(insight.number || i + 2).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: B.navy, margin: '0 0 8px', lineHeight: 1.3 }}>{insight.headline}</h3>
                    <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, margin: insight.evidence ? '0 0 12px' : 0 }}>{insight.body}</p>
                    {insight.evidence && (
                      <blockquote style={{ margin: 0, padding: '10px 14px', borderLeft: `3px solid ${B.yellow}`, background: '#FDFBE8', borderRadius: '0 8px 8px 0', fontSize: 13, color: B.navyMid, fontStyle: 'italic', lineHeight: 1.6 }}>
                        &ldquo;{insight.evidence}&rdquo;
                      </blockquote>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {/* Notable Quotes */}
            {report.notable_quotes.length > 0 && (
              <Card>
                <SectionLabel>Notable Quotes</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {report.notable_quotes.map((q, i) => (
                    <div key={i} style={{ paddingBottom: i < report.notable_quotes.length - 1 ? 20 : 0, borderBottom: i < report.notable_quotes.length - 1 ? `1px solid ${B.border}` : 'none' }}>
                      <blockquote style={{ fontSize: 17, fontStyle: 'italic', color: B.navy, lineHeight: 1.65, margin: '0 0 10px' }}>
                        &ldquo;{q.quote}&rdquo;
                      </blockquote>
                      <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>
                        — <strong style={{ color: B.navy }}>{q.speaker}</strong> · {q.context}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Market Signals */}
            {report.market_signals.length > 0 && (
              <Card>
                <SectionLabel color="#8B7000">Market Signals</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {report.market_signals.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: B.yellow, border: `2px solid ${B.navyMid}`, marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: B.navy, margin: '0 0 3px' }}>{s.signal}</p>
                        <p style={{ fontSize: 13, color: B.muted, margin: 0, lineHeight: 1.6 }}>{s.implication}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recommended Actions */}
            {report.recommended_actions.length > 0 && (
              <Card>
                <SectionLabel>Recommended Actions</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {report.recommended_actions.map((a, i) => {
                    const c = priorityColors(a.priority)
                    return (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: c.bg, color: c.text, border: `1px solid ${c.border}`, letterSpacing: 0.5, flexShrink: 0, marginTop: 2 }}>
                          {a.priority.toUpperCase()}
                        </span>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: B.navy, margin: '0 0 2px' }}>{a.action}</p>
                          <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>For: {a.for_whom}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Closing thought */}
            <Card style={{ background: B.navy, border: 'none' }}>
              <SectionLabel color={B.yellow}>Closing Thought</SectionLabel>
              <p style={{ fontSize: 18, fontStyle: 'italic', color: B.white, lineHeight: 1.7, margin: 0 }}>
                {report.closing_thought}
              </p>
            </Card>

            {/* Guest bio */}
            <Card>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: B.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20, fontWeight: 800, color: B.navy }}>
                  {report.meta.guest_name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: B.navy, margin: '0 0 2px' }}>{report.meta.guest_name}</p>
                  <p style={{ fontSize: 13, color: B.muted, margin: '0 0 8px' }}>{report.meta.guest_title}</p>
                  <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.65, margin: 0 }}>{report.guest_bio}</p>
                </div>
              </div>
            </Card>

            {/* Download */}
            <div style={{ background: B.navy, borderRadius: 20, padding: 40, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: B.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={B.navy} strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: B.white, margin: '0 0 8px' }}>Download PDF Report</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 28 }}>
                Beautifully formatted, Plurio-branded — ready to share or publish.
              </p>
              <div style={{ maxWidth: 320, margin: '0 auto' }}>
                <PlurioPDFDownload report={report} filename={safeFilename} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${B.border}`, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: B.white }}>
        <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>© 2025 Plurio by Elly Analytics</p>
        <a href="https://plurio.ai" style={{ fontSize: 13, color: B.muted, textDecoration: 'none', fontWeight: 600 }}>plurio.ai</a>
      </footer>
    </div>
  )
}
