import { useState } from 'react'
import Badge from '../components/Badge'
import { deals } from '../data/mockData'

const STAGES = ['Qualification', 'Proposal', 'Site Visit', 'Negotiation', 'Closed']

export default function Deals() {
  const [dealList, setDealList] = useState(deals)

  const moveStage = (id, dir) => {
    setDealList(prev => prev.map(d => {
      if (d.id !== id) return d
      const idx = STAGES.indexOf(d.stage)
      const next = STAGES[Math.max(0, Math.min(STAGES.length - 1, idx + dir))]
      return { ...d, stage: next }
    }))
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Deals Pipeline</div>
        <div className="page-subtitle">Track deals from qualification to closure</div>
      </div>

      {/* Pipeline Kanban */}
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, marginBottom: 28 }}>
        {STAGES.map(stage => {
          const stageDeals = dealList.filter(d => d.stage === stage)
          return (
            <div key={stage} style={{ minWidth: 220, flex: '0 0 220px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 10,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{stage}</div>
                <span style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 20, fontSize: 11, fontWeight: 700, padding: '1px 8px', color: 'var(--text-secondary)',
                }}>{stageDeals.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 100 }}>
                {stageDeals.map(deal => (
                  <div key={deal.id} className="card" style={{ padding: '14px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{deal.client}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{deal.property}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{deal.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--green)', marginBottom: 10 }}>Commission: {deal.commission}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Agent: {deal.agent}</div>
                    {stage !== 'Closed' && (
                      <div style={{ display: 'flex', gap: 5 }}>
                        {STAGES.indexOf(stage) > 0 && (
                          <button className="btn btn-secondary btn-sm" onClick={() => moveStage(deal.id, -1)}>← Back</button>
                        )}
                        <button className="btn btn-primary btn-sm" onClick={() => moveStage(deal.id, 1)}>
                          {STAGES.indexOf(stage) === STAGES.length - 2 ? 'Close' : 'Advance →'}
                        </button>
                      </div>
                    )}
                    {stage === 'Closed' && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>✓ Closed</span>
                    )}
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: 20, border: '2px dashed var(--border)', borderRadius: 8 }}>Empty</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Deals Table */}
      <div className="card">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 14 }}>All Deals</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Property</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Commission</th>
                <th>Agent</th>
                <th>Days in Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {dealList.map(deal => (
                <tr key={deal.id}>
                  <td style={{ fontWeight: 500 }}>{deal.client}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{deal.property}</td>
                  <td><Badge label={deal.stage} /></td>
                  <td style={{ fontWeight: 600 }}>{deal.value}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 500 }}>{deal.commission}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{deal.agent}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{deal.days}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}