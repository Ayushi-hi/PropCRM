import { useState } from 'react'
import Badge from '../components/Badge'
import { followups as initial } from '../data/mockData'
import { CheckCircle, Clock } from 'lucide-react'

export default function Followups() {
  const [followups, setFollowups] = useState(initial)
  const [filter, setFilter] = useState('All')

  const markDone = id => setFollowups(prev => prev.map(f => f.id === id ? { ...f, status: 'Done' } : f))

  const filtered = filter === 'All' ? followups : followups.filter(f => f.status === filter)

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Follow-ups</div>
        <div className="page-subtitle">{followups.filter(f => f.status === 'Pending').length} pending reminders</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['All', 'Pending', 'Done'].map(t => (
          <button key={t} className={`btn ${filter === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(f => (
          <div key={f.id} className="card" style={{
            padding: '16px 18px',
            opacity: f.status === 'Done' ? 0.65 : 1,
            borderLeft: `3px solid ${f.priority === 'High' ? 'var(--red)' : f.priority === 'Medium' ? 'var(--amber)' : 'var(--blue)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.lead}</div>
                  <Badge label={f.priority} />
                  <Badge label={f.status} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{f.action}</div>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Due: {f.due}</span>
                  <span>Agent: {f.agent}</span>
                </div>
              </div>
              {f.status === 'Pending' && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn btn-primary btn-sm">Call Now</button>
                  <button className="btn btn-secondary btn-sm">Reschedule</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => markDone(f.id)} title="Mark Done">
                    <CheckCircle size={16} style={{ color: 'var(--green)' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 48, fontSize: 14 }}>No follow-ups in this category.</div>
        )}
      </div>
    </div>
  )
}