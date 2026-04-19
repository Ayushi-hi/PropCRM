import { activities } from '../data/mockData'
import { UserPlus, CheckCircle, Calendar, Phone, Building2, FileText } from 'lucide-react'

const TYPE_META = {
  deal: { icon: CheckCircle, color: 'var(--green)', bg: 'var(--green-light)', label: 'Deal' },
  lead: { icon: UserPlus, color: 'var(--blue)', bg: 'var(--blue-light)', label: 'Lead' },
  visit: { icon: Calendar, color: 'var(--amber)', bg: 'var(--amber-light)', label: 'Visit' },
  call: { icon: Phone, color: 'var(--purple)', bg: 'var(--purple-light)', label: 'Call' },
  property: { icon: Building2, color: 'var(--accent)', bg: 'var(--accent-light)', label: 'Property' },
  document: { icon: FileText, color: 'var(--text-secondary)', bg: 'var(--border)', label: 'Document' },
}

const ALL_ACTIVITIES = [
  ...activities,
  { id: 6, type: 'document', text: 'Agreement uploaded for Deepak Verma deal', time: '1 day ago' },
  { id: 7, type: 'property', text: 'New property "Palm Grove" listed in Pune', time: '2 days ago' },
  { id: 8, type: 'visit', text: 'Site visit completed – Suresh Iyer at Prestige Towers', time: '2 days ago' },
  { id: 9, type: 'call', text: 'Call with Kavita Desai – budget discussion', time: '3 days ago' },
  { id: 10, type: 'lead', text: 'Lead Rohan Gupta qualified – score 78', time: '3 days ago' },
  { id: 11, type: 'deal', text: 'Deal stage updated: Ananya Joshi → Negotiation', time: '4 days ago' },
  { id: 12, type: 'document', text: 'ID proof uploaded for Meera Nair', time: '5 days ago' },
]

export default function ActivityFeed() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Activity Timeline</div>
        <div className="page-subtitle">All CRM events and interactions in chronological order</div>
      </div>

      <div style={{ maxWidth: 720 }}>
        {ALL_ACTIVITIES.map((act, i) => {
          const meta = TYPE_META[act.type] || TYPE_META.lead
          const Icon = meta.icon
          return (
            <div key={act.id} style={{ display: 'flex', gap: 16, position: 'relative' }}>
              {/* Timeline line */}
              {i < ALL_ACTIVITIES.length - 1 && (
                <div style={{
                  position: 'absolute', left: 19, top: 44, bottom: 0,
                  width: 2, background: 'var(--border)', zIndex: 0,
                }} />
              )}

              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1, border: '2px solid var(--surface)',
              }}>
                <Icon size={16} style={{ color: meta.color }} />
              </div>

              {/* Content */}
              <div className="card" style={{ flex: 1, padding: '12px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                      background: meta.bg, color: meta.color,
                      textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 8,
                    }}>{meta.label}</span>
                    <span style={{ fontSize: 13 }}>{act.text}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{act.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}