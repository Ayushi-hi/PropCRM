const BADGE_STYLES = {
  Hot:    { bg: 'var(--red-light)',    color: 'var(--red)' },
  Warm:   { bg: 'var(--amber-light)',  color: 'var(--amber)' },
  Cold:   { bg: 'var(--blue-light)',   color: 'var(--blue)' },
  Available: { bg: 'var(--green-light)', color: 'var(--green)' },
  Limited:   { bg: 'var(--amber-light)', color: 'var(--amber)' },
  'Sold Out':{ bg: 'var(--border)',      color: 'var(--text-muted)' },
  Closed:    { bg: 'var(--green-light)', color: 'var(--green)' },
  Negotiation:{ bg: 'var(--purple-light)', color: 'var(--purple)' },
  Proposal:  { bg: 'var(--blue-light)', color: 'var(--blue)' },
  'Site Visit':{ bg: 'var(--amber-light)', color: 'var(--amber)' },
  Qualification:{ bg: 'var(--border)', color: 'var(--text-secondary)' },
  High:   { bg: 'var(--red-light)',   color: 'var(--red)' },
  Medium: { bg: 'var(--amber-light)', color: 'var(--amber)' },
  Low:    { bg: 'var(--blue-light)',  color: 'var(--blue)' },
  Pending: { bg: 'var(--amber-light)', color: 'var(--amber)' },
  Done:   { bg: 'var(--green-light)', color: 'var(--green)' },
}

export default function Badge({ label }) {
  const style = BADGE_STYLES[label] || { bg: 'var(--border)', color: 'var(--text-secondary)' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      background: style.bg, color: style.color,
    }}>
      {label}
    </span>
  )
}