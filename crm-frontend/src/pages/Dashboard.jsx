import { Users, Handshake, Bell, TrendingUp, UserCheck, Activity } from 'lucide-react'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { leads, activities, followups } from '../data/mockData'

export default function Dashboard() {
  const hotLeads = leads.filter(l => l.status === 'Hot').length
  const pending = followups.filter(f => f.status === 'Pending').length

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Good Morning, Admin 👋</div>
        <div className="page-subtitle">Here's what's happening with your pipeline today.</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard title="Total Leads" value={leads.length} sub="+4 this week" icon={Users} color="var(--blue)" />
        <StatCard title="Hot Leads" value={hotLeads} sub="Needs attention" icon={TrendingUp} color="var(--red)" />
        <StatCard title="Pending Follow-ups" value={pending} sub="Due today" icon={Bell} color="var(--amber)" />
        <StatCard title="Closed Deals" value="2" sub="This month" icon={Handshake} color="var(--green)" />
        <StatCard title="Conversion Rate" value="38%" sub="+3% vs last month" icon={UserCheck} color="var(--purple)" />
        <StatCard title="Active Agents" value="4" sub="All online" icon={Activity} color="var(--accent)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Recent Leads */}
        <div className="card">
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Recent Leads</div>
            <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Budget</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Next Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.agent}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{lead.source}</td>
                    <td style={{ fontWeight: 500 }}>{lead.budget}</td>
                    <td>
                      <div className="score-bar">
                        <div className="score-track" style={{ width: 60 }}>
                          <div className="score-fill" style={{
                            width: `${lead.score}%`,
                            background: lead.score >= 80 ? 'var(--green)' : lead.score >= 60 ? 'var(--amber)' : 'var(--red)',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{lead.score}</span>
                      </div>
                    </td>
                    <td><Badge label={lead.status} /></td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lead.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Recent Activity</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            {activities.map((act, i) => (
              <div key={act.id} style={{
                display: 'flex', gap: 12, padding: '10px 16px',
                borderBottom: i < activities.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: act.type === 'deal' ? 'var(--green-light)' : act.type === 'lead' ? 'var(--blue-light)' : 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>
                  {act.type === 'deal' ? '✓' : act.type === 'lead' ? '👤' : act.type === 'visit' ? '📍' : '📞'}
                </div>
                <div>
                  <div style={{ fontSize: 12, lineHeight: 1.4 }}>{act.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up reminders */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Today's Follow-ups</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 16 }}>
          {followups.filter(f => f.due === 'Today' && f.status === 'Pending').map(f => (
            <div key={f.id} className="card" style={{ padding: '12px 16px', minWidth: 220, flex: '1 1 220px', border: '1px solid var(--border)', background: 'var(--surface2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{f.lead}</div>
                <Badge label={f.priority} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>{f.action}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-primary btn-sm">Call Now</button>
                <button className="btn btn-secondary btn-sm">Snooze</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}