import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { agents, monthlyData, sourceData } from '../data/mockData'

const PIE_COLORS = ['#c8621a', '#1a5fa8', '#1a8a4a', '#a07a10', '#6a3da8']

export default function Analytics() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Analytics</div>
        <div className="page-subtitle">6-month performance overview</div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Leads vs Deals Closed</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="leads" fill="var(--blue)" radius={[4,4,0,0]} name="Leads" />
              <Bar dataKey="deals" fill="var(--accent)" radius={[4,4,0,0]} name="Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Lead Source Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion trend */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Monthly Lead Trend</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
            <Line type="monotone" dataKey="leads" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} name="Leads" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Performance */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Agent Performance</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {agents.map(agent => (
            <div key={agent.id} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                }}>{agent.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Real Estate Agent</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                {[['Leads', agent.leads], ['Deals', agent.deals], ['Conv.', agent.conversion + '%']].map(([label, val]) => (
                  <div key={label} style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 4px' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{val}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>Conversion Rate</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{agent.conversion}%</span>
                </div>
                <div className="score-track" style={{ width: '100%' }}>
                  <div className="score-fill" style={{
                    width: `${agent.conversion}%`,
                    background: agent.conversion >= 40 ? 'var(--green)' : 'var(--accent)',
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}