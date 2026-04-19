import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { leads as initialLeads, agents } from '../data/mockData'

const STATUSES = ['All', 'Hot', 'Warm', 'Cold']
const SOURCES = ['All', 'Website', 'Referral', 'Google Ads', 'Facebook', 'Walk-in']

export default function Leads() {
  const [leads, setLeads] = useState(initialLeads)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', source:'Website', budget:'', score:50, status:'Warm', agent:'Priya Sharma', nextAction:'Call Today', property:'' })

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || l.status === statusFilter
    const matchSource = sourceFilter === 'All' || l.source === sourceFilter
    return matchSearch && matchStatus && matchSource
  })

  const addLead = () => {
    setLeads(prev => [...prev, { ...form, id: Date.now() }])
    setShowModal(false)
    setForm({ name:'', phone:'', email:'', source:'Website', budget:'', score:50, status:'Warm', agent:'Priya Sharma', nextAction:'Call Today', property:'' })
  }

  return (
    <div>
      <div className="page-header flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Leads</div>
          <div className="page-subtitle">{leads.length} total leads in pipeline</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input style={{ paddingLeft: 30, width: '100%' }} placeholder="Search leads…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Budget</th>
                <th>Score</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Next Action</th>
                <th>Property</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
                      }}>
                        {lead.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{lead.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>{lead.phone}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.email}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{lead.source}</td>
                  <td style={{ fontWeight: 600 }}>{lead.budget}</td>
                  <td>
                    <div className="score-bar">
                      <div className="score-track" style={{ width: 56 }}>
                        <div className="score-fill" style={{
                          width: `${lead.score}%`,
                          background: lead.score >= 80 ? 'var(--green)' : lead.score >= 60 ? 'var(--amber)' : 'var(--red)',
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{lead.score}</span>
                    </div>
                  </td>
                  <td><Badge label={lead.status} /></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lead.agent}</td>
                  <td>
                    <span style={{
                      fontSize: 11, background: 'var(--accent-light)', color: 'var(--accent)',
                      padding: '3px 8px', borderRadius: 6, fontWeight: 500,
                    }}>{lead.nextAction}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lead.property}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <Modal title="Add New Lead" onClose={() => setShowModal(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Name', 'name', 'text'],
              ['Phone', 'phone', 'text'],
              ['Email', 'email', 'email'],
              ['Budget', 'budget', 'text'],
              ['Property Interest', 'property', 'text'],
              ['Lead Score', 'score', 'number'],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</label>
                <input
                  type={type} value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Source</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} style={{ width: '100%' }}>
                {['Website','Referral','Google Ads','Facebook','Walk-in'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ width: '100%' }}>
                {['Hot','Warm','Cold'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Assign Agent</label>
              <select value={form.agent} onChange={e => setForm(f => ({ ...f, agent: e.target.value }))} style={{ width: '100%' }}>
                {agents.map(a => <option key={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Next Action</label>
              <select value={form.nextAction} onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))} style={{ width: '100%' }}>
                {['Call Today','Send Options','Schedule Visit','Follow Up'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={addLead}>Add Lead</button>
          </div>
        </Modal>
      )}
    </div>
  )
}