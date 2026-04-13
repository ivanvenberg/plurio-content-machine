'use client'

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { useState } from 'react'

// Real Plurio brand colors
const YELLOW = '#F5E642'
const YELLOW_PALE = '#FDFBE8'
const NAVY = '#1B1A2E'
const NAVY_MID = '#2D2C45'
const WHITE = '#FFFFFF'
const GRAY = '#F7F7F9'
const GRAY_MID = '#E8E8EC'
const MUTED = '#6B6B80'
const BORDER = '#E2E2E8'

const s = StyleSheet.create({
  // ── COVER ───────────────────────────────────────────────────────────────
  coverPage: {
    fontFamily: 'Helvetica',
    backgroundColor: NAVY,
    flexDirection: 'column',
    minHeight: '100%',
  },
  coverTopBar: {
    height: 5,
    backgroundColor: YELLOW,
  },
  coverNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 52,
    paddingTop: 32,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  coverLogoBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: YELLOW,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  coverLogoRow: { flexDirection: 'row', alignItems: 'center' },
  coverLogoText: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: WHITE },
  coverNavTag: {
    fontSize: 8, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2, fontFamily: 'Helvetica',
  },
  coverBody: {
    flex: 1,
    paddingHorizontal: 52,
    paddingTop: 64,
    paddingBottom: 48,
    justifyContent: 'center',
  },
  coverBadge: {
    alignSelf: 'flex-start',
    backgroundColor: YELLOW,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 32,
  },
  coverBadgeText: {
    fontSize: 9, fontFamily: 'Helvetica-Bold',
    color: NAVY, letterSpacing: 1,
  },
  coverTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 42,
    color: WHITE,
    lineHeight: 1.2,
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  coverSubtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.65, marginBottom: 48,
    maxWidth: 420, fontFamily: 'Helvetica',
  },
  coverDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 36 },
  coverMeta: { flexDirection: 'row', gap: 36, flexWrap: 'wrap' },
  coverMetaItem: { gap: 5 },
  coverMetaLabel: {
    fontSize: 8, color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.5, fontFamily: 'Helvetica',
  },
  coverMetaValue: {
    fontSize: 13, color: WHITE, fontFamily: 'Helvetica-Bold',
  },
  coverTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 40 },
  coverTag: {
    backgroundColor: YELLOW,
    borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  coverTagText: {
    fontSize: 8, fontFamily: 'Helvetica-Bold',
    color: NAVY, letterSpacing: 1,
  },
  coverFooter: {
    paddingHorizontal: 52, paddingBottom: 32, paddingTop: 20,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  coverFooterLeft: { fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'Helvetica' },
  coverFooterRight: { fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'Helvetica' },

  // ── INNER PAGES ──────────────────────────────────────────────────────────
  innerPage: {
    fontFamily: 'Helvetica',
    backgroundColor: GRAY,
    paddingHorizontal: 44,
    paddingTop: 36,
    paddingBottom: 60,
  },
  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  pageHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pageHeaderLogoBox: {
    width: 20, height: 20, borderRadius: 5,
    backgroundColor: YELLOW,
    alignItems: 'center', justifyContent: 'center',
  },
  pageHeaderLogo: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: NAVY },
  pageHeaderSection: { fontSize: 9, color: MUTED, letterSpacing: 1.5, fontFamily: 'Helvetica' },

  sectionLabel: {
    fontSize: 8, letterSpacing: 2, fontFamily: 'Helvetica-Bold',
    color: MUTED, marginBottom: 14,
  },
  sectionLabelYellow: {
    fontSize: 8, letterSpacing: 2, fontFamily: 'Helvetica-Bold',
    color: '#8B7000', marginBottom: 14,
  },

  // Cards
  card: {
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
  },
  cardHighlight: {
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 4,
    borderLeftColor: YELLOW,
    marginBottom: 12,
  },
  cardDark: {
    backgroundColor: NAVY,
    borderRadius: 10,
    padding: 22,
    borderWidth: 0,
    marginBottom: 12,
  },

  // Summary
  summaryText: {
    fontFamily: 'Times-Roman', fontSize: 15,
    color: NAVY, lineHeight: 1.75,
  },

  // Bio
  bioRow: { flexDirection: 'row', gap: 14 },
  bioAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: YELLOW,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  bioAvatarText: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: NAVY },
  bioName: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: NAVY, marginBottom: 2 },
  bioTitle: { fontSize: 10, color: MUTED, marginBottom: 6, fontFamily: 'Helvetica' },
  bioText: { fontSize: 10, color: MUTED, lineHeight: 1.65, fontFamily: 'Helvetica' },

  // Insight
  insightRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  insightNumBox: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: YELLOW,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  insightNumText: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: NAVY },
  insightHeadline: {
    fontFamily: 'Times-Roman', fontSize: 15,
    color: NAVY, lineHeight: 1.35, marginBottom: 6,
  },
  insightBody: {
    fontSize: 10, color: MUTED, lineHeight: 1.7,
    fontFamily: 'Helvetica', marginBottom: 8,
  },
  insightEvidence: {
    flexDirection: 'row', backgroundColor: YELLOW_PALE,
    borderRadius: 6, padding: 10, gap: 8,
    borderLeftWidth: 3, borderLeftColor: YELLOW,
  },
  insightEvidenceText: {
    fontSize: 9, color: NAVY_MID,
    fontFamily: 'Helvetica-Oblique', lineHeight: 1.55, flex: 1,
  },

  // Quote
  quoteCard: {
    backgroundColor: WHITE,
    borderRadius: 10, padding: 20,
    borderWidth: 1, borderColor: BORDER,
    borderLeftWidth: 4, borderLeftColor: YELLOW,
    marginBottom: 10,
  },
  quoteText: {
    fontFamily: 'Times-Italic', fontSize: 13,
    color: NAVY, lineHeight: 1.65, marginBottom: 8,
  },
  quoteSpeaker: { fontSize: 9, color: MUTED, fontFamily: 'Helvetica-Bold' },
  quoteContext: { fontSize: 9, color: MUTED, marginTop: 3, lineHeight: 1.5, fontFamily: 'Helvetica' },

  // Signal
  signalRow: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: WHITE, borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: BORDER, marginBottom: 8,
  },
  signalDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: YELLOW, borderWidth: 1.5, borderColor: NAVY,
    marginTop: 3, flexShrink: 0,
  },
  signalText: { fontSize: 11, color: NAVY, fontFamily: 'Helvetica-Bold', lineHeight: 1.5, marginBottom: 3 },
  signalImplication: { fontSize: 9.5, color: MUTED, lineHeight: 1.6, fontFamily: 'Helvetica' },

  // Action
  actionRow: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: WHITE, borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: BORDER, marginBottom: 8,
  },
  badgeHigh: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, backgroundColor: '#FFF0EE', borderWidth: 1, borderColor: '#FFCDC7', flexShrink: 0 },
  badgeMid: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, backgroundColor: '#FFF9E0', borderWidth: 1, borderColor: YELLOW, flexShrink: 0 },
  badgeLow: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, backgroundColor: GRAY, borderWidth: 1, borderColor: BORDER, flexShrink: 0 },
  badgeTextHigh: { fontSize: 7, color: '#C0392B', fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  badgeTextMid: { fontSize: 7, color: '#8B7000', fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  badgeTextLow: { fontSize: 7, color: MUTED, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  actionText: { fontSize: 11, color: NAVY, fontFamily: 'Helvetica-Bold', lineHeight: 1.4, marginBottom: 2 },
  actionFor: { fontSize: 9, color: MUTED, fontFamily: 'Helvetica' },

  // Closing
  closingText: { fontFamily: 'Times-Italic', fontSize: 16, color: WHITE, lineHeight: 1.7 },
  closingLabel: { fontSize: 8, letterSpacing: 2, fontFamily: 'Helvetica-Bold', color: YELLOW, marginBottom: 12 },

  // Footer
  pageFooter: {
    position: 'absolute', bottom: 20, left: 44, right: 44,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 10,
  },
  pageFooterText: { fontSize: 8, color: MUTED, fontFamily: 'Helvetica' },
  pageFooterBrand: { fontSize: 8, color: NAVY, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
})

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

const Footer = ({ title, section }: { title: string; section: string }) => (
  <View style={s.pageFooter} fixed>
    <Text style={s.pageFooterText}>{title}</Text>
    <Text style={s.pageFooterBrand}>pLurio · {section}</Text>
  </View>
)

const InnerHeader = ({ section }: { section: string }) => (
  <View style={s.pageHeader}>
    <View style={s.pageHeaderLeft}>
      <View style={s.pageHeaderLogoBox} />
      <Text style={s.pageHeaderLogo}>pLurio</Text>
    </View>
    <Text style={s.pageHeaderSection}>{section.toUpperCase()}</Text>
  </View>
)

const ActionBadge = ({ priority }: { priority: string }) => {
  if (priority === 'high') return <View style={s.badgeHigh}><Text style={s.badgeTextHigh}>HIGH</Text></View>
  if (priority === 'medium') return <View style={s.badgeMid}><Text style={s.badgeTextMid}>MID</Text></View>
  return <View style={s.badgeLow}><Text style={s.badgeTextLow}>LOW</Text></View>
}

const PlurioDocument = ({ report }: { report: Report }) => (
  <Document title={report.meta.title} author="Plurio" creator="Plurio Intelligence Engine">

    {/* ── COVER ── */}
    <Page size="A4" style={s.coverPage}>
      <View style={s.coverTopBar} />
      <View style={s.coverNav}>
        <View style={s.coverLogoRow}>
          <View style={s.coverLogoBox} />
          <Text style={s.coverLogoText}>  pLurio</Text>
        </View>
        <Text style={s.coverNavTag}>INTELLIGENCE REPORT</Text>
      </View>

      <View style={s.coverBody}>
        <View style={s.coverBadge}>
          <Text style={s.coverBadgeText}>PLURIO INTELLIGENCE ENGINE</Text>
        </View>
        <Text style={s.coverTitle}>{report.meta.title}</Text>
        <Text style={s.coverSubtitle}>{report.meta.subtitle}</Text>
        <View style={s.coverDivider} />
        <View style={s.coverMeta}>
          {[
            { label: 'GUEST', value: report.meta.guest_name },
            { label: 'ROLE', value: report.meta.guest_title },
            { label: 'PUBLISHED', value: report.meta.publication_date },
            { label: 'READ TIME', value: report.meta.read_time },
          ].map((item, i) => (
            <View key={i} style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>{item.label}</Text>
              <Text style={s.coverMetaValue}>{item.value}</Text>
            </View>
          ))}
        </View>
        <View style={s.coverTagsRow}>
          {report.meta.tags.map((tag, i) => (
            <View key={i} style={s.coverTag}>
              <Text style={s.coverTagText}>{tag.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.coverFooter}>
        <Text style={s.coverFooterLeft}>© 2025 Plurio by Elly Analytics</Text>
        <Text style={s.coverFooterRight}>plurio.ai</Text>
      </View>
    </Page>

    {/* ── OVERVIEW ── */}
    <Page size="A4" style={s.innerPage}>
      <InnerHeader section="Executive Summary" />

      <Text style={s.sectionLabel}>OVERVIEW</Text>
      <View style={s.cardHighlight}>
        <Text style={s.summaryText}>{report.executive_summary}</Text>
      </View>

      <View style={{ height: 18 }} />
      <Text style={s.sectionLabel}>ABOUT THE GUEST</Text>
      <View style={s.card}>
        <View style={s.bioRow}>
          <View style={s.bioAvatar}>
            <Text style={s.bioAvatarText}>{report.meta.guest_name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.bioName}>{report.meta.guest_name}</Text>
            <Text style={s.bioTitle}>{report.meta.guest_title}</Text>
            <Text style={s.bioText}>{report.guest_bio}</Text>
          </View>
        </View>
      </View>
      <Footer title={report.meta.title} section="Overview" />
    </Page>

    {/* ── KEY INSIGHTS ── */}
    <Page size="A4" style={s.innerPage}>
      <InnerHeader section="Key Insights" />
      <Text style={s.sectionLabel}>KEY INSIGHTS</Text>
      {report.key_insights.map((insight, i) => (
        <View key={i} style={s.card} wrap={false}>
          <View style={s.insightRow}>
            <View style={s.insightNumBox}>
              <Text style={s.insightNumText}>{String(i + 1).padStart(2, '0')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.insightHeadline}>{insight.headline}</Text>
              <Text style={s.insightBody}>{insight.body}</Text>
              {insight.evidence ? (
                <View style={s.insightEvidence}>
                  <Text style={s.insightEvidenceText}>"{insight.evidence}"</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ))}
      <Footer title={report.meta.title} section="Key Insights" />
    </Page>

    {/* ── QUOTES + SIGNALS ── */}
    <Page size="A4" style={s.innerPage}>
      <InnerHeader section="Quotes & Signals" />

      <Text style={s.sectionLabel}>NOTABLE QUOTES</Text>
      {report.notable_quotes.map((q, i) => (
        <View key={i} style={s.quoteCard} wrap={false}>
          <Text style={s.quoteText}>"{q.quote}"</Text>
          <Text style={s.quoteSpeaker}>— {q.speaker}</Text>
          {q.context ? <Text style={s.quoteContext}>{q.context}</Text> : null}
        </View>
      ))}

      <View style={{ height: 18 }} />
      <Text style={s.sectionLabelYellow}>MARKET SIGNALS</Text>
      {report.market_signals.map((sig, i) => (
        <View key={i} style={s.signalRow} wrap={false}>
          <View style={s.signalDot} />
          <View style={{ flex: 1 }}>
            <Text style={s.signalText}>{sig.signal}</Text>
            <Text style={s.signalImplication}>{sig.implication}</Text>
          </View>
        </View>
      ))}
      <Footer title={report.meta.title} section="Quotes & Signals" />
    </Page>

    {/* ── ACTIONS + CLOSING ── */}
    <Page size="A4" style={s.innerPage}>
      <InnerHeader section="Actions & Closing" />

      <Text style={s.sectionLabel}>RECOMMENDED ACTIONS</Text>
      {report.recommended_actions.map((a, i) => (
        <View key={i} style={s.actionRow} wrap={false}>
          <ActionBadge priority={a.priority} />
          <View style={{ flex: 1 }}>
            <Text style={s.actionText}>{a.action}</Text>
            <Text style={s.actionFor}>For: {a.for_whom}</Text>
          </View>
        </View>
      ))}

      <View style={{ height: 20 }} />
      <View style={s.cardDark}>
        <Text style={s.closingLabel}>CLOSING THOUGHT</Text>
        <Text style={s.closingText}>{report.closing_thought}</Text>
      </View>

      <Footer title={report.meta.title} section="Actions & Closing" />
    </Page>
  </Document>
)

interface Props { report: Report; filename: string }

export default function PlurioPDFDownload({ report, filename }: Props) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const blob = await pdf(<PlurioDocument report={report} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}-plurio-report.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF error:', err)
      alert('PDF generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        width: '100%', padding: '16px 32px', borderRadius: 12, border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        background: '#F5E642', color: '#1B1A2E',
        fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        opacity: loading ? 0.7 : 1, letterSpacing: 0.3,
        transition: 'opacity 0.15s',
      }}>
      {loading ? (
        <>
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B1A2E" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
          </svg>
          Generating PDF…
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B1A2E" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
          </svg>
          Download Plurio PDF Report
        </>
      )}
    </button>
  )
}
