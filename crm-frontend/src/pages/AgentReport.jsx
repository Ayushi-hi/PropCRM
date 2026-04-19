import { agents, deals, leads } from '../data/mockData'
import { Trophy, TrendingUp, Users, Handshake } from 'lucide-react'

const MEDAL = ['🥇', '🥈', '🥉']

export default function AgentReport() {
  const agentStats = agents.map(agent => {
    const agentLeads = leads.filter(l => l.agent === agent.name)
    const agentDeals = deals.filter(d => d.agent === agent.name)
    const closedDeals = agentDeals.filter(d => d.stage === 'Closed')
    const totalCommission = closedDeals.reduce((sum, d) => {
      const val = parseFloat(d.commission.replace('₹', '').replace(' L', '')) || 0
      return sum + val
    }, 0)
    return {
      ...agent,
      leadCount: agentLeads.length,
      dealCount: agentDeals.length,
      closedCount: closedDeals.length,
      totalCommission,
      hotLeads: agentLeads.filter(l => l.status === 'Hot').length,
    }
  }).sort((a, b) => b.closedCount - a.closedCount)

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Agent Performance Report</div>
        <div className="page-subtitle">Ranked by closed deals this period</div>
      </div>

      {/* Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
        {agentStats.map((agent, i) => (
          <div key={agent.id} className="card" style={{
            padding: '20px',
            borderTop: i === 0 ? '3px solid var(--amber)' : i === 1 ? '3px solid #aaa' : i === 2 ? '3px solid #c96' : '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#fff',
                }}>{agent.avatar}</div>
                {i < 3 && (
                  <span style={{ position: 'absolute', top: -6, right: -6, fontSize: 16 }}>{MEDAL[i]}</span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{agent.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Real Estate Agent</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                ['Leads', agent.leadCount, 'var(--blue)'],
                ['Hot Leads', agent.hotLeads, 'var(--red)'],
                ['Active Deals', agent.dealCount, 'var(--amber)'],
                ['Closed', agent.closedCount, 'var(--green)'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color }}>{val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span>Conversion Rate</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{agent.conversion}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${agent.conversion}%`,
                background: agent.conversion >= 40 ? 'var(--green)' : 'var(--accent)',
              }} />
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--green-light)', borderRadius: 8, padding: '8px 12px',
            }}>
              <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>Total Commission</span>
              <span style={{ fontWeight: 700, color: 'var(--green)', fontSize: 13 }}>
                ₹{agent.totalCommission.toFixed(2)} L
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div className="card">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 14 }}>Detailed Summary</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Agent</th>
                <th>Total Leads</th>
                <th>Hot Leads</th>
                <th>Active Deals</th>
                <th>Closed Deals</th>
                <th>Conversion</th>
                <th>Commission Earned</th>
              </tr>
            </thead>
            <tbody>
              {agentStats.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 700, fontSize: 16 }}>{MEDAL[i] || `#${i + 1}`}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                      }}>{a.avatar}</div>
                      <span style={{ fontWeight: 500 }}>{a.name}</span>
                    </div>
                  </td>
                  <td>{a.leadCount}</td>
                  <td style={{ color: 'var(--red)', fontWeight: 600 }}>{a.hotLeads}</td>
                  <td>{a.dealCount}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 700 }}>{a.closedCount}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: a.conversion >= 40 ? 'var(--green-light)' : 'var(--amber-light)',
                      color: a.conversion >= 40 ? 'var(--green)' : 'var(--amber)',
                    }}>{a.conversion}%</span>
                  </td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>₹{a.totalCommission.toFixed(2)} L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}