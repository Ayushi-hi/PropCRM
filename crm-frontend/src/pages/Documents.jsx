import { useState } from 'react'
import { Upload, FileText, Trash2, ExternalLink } from 'lucide-react'
import Badge from '../components/Badge'
import Modal from '../components/Modal'

const MOCK_DOCS = [
  { id: 1, name: 'Sale Agreement – Arjun Kapoor.pdf', category: 'agreement', entityType: 'deal', entity: 'Prestige Towers Deal', uploadedBy: 'Anika Patel', size: '420 KB', date: '2024-03-10', url: '#' },
  { id: 2, name: 'ID Proof – Suresh Iyer.pdf', category: 'id-proof', entityType: 'client', entity: 'Suresh Iyer', uploadedBy: 'Priya Sharma', size: '210 KB', date: '2024-03-08', url: '#' },
  { id: 3, name: 'Skyline Heights Brochure.pdf', category: 'brochure', entityType: 'property', entity: 'Skyline Heights', uploadedBy: 'Admin Manager', size: '2.1 MB', date: '2024-02-20', url: '#' },
  { id: 4, name: 'Contract – Deepak Verma.docx', category: 'contract', entityType: 'deal', entity: 'Prestige Towers Deal', uploadedBy: 'Rahul Mehta', size: '340 KB', date: '2024-02-14', url: '#' },
  { id: 5, name: 'Site Plan – Palm Grove.jpg', category: 'site-plan', entityType: 'property', entity: 'Palm Grove', uploadedBy: 'Admin Manager', size: '1.8 MB', date: '2024-01-30', url: '#' },
]

const CAT_COLORS = {
  agreement: { bg: 'var(--green-light)', color: 'var(--green)' },
  contract: { bg: 'var(--blue-light)', color: 'var(--blue)' },
  'id-proof': { bg: 'var(--amber-light)', color: 'var(--amber)' },
  brochure: { bg: 'var(--purple-light)', color: 'var(--purple)' },
  'site-plan': { bg: 'var(--accent-light)', color: 'var(--accent)' },
  other: { bg: 'var(--border)', color: 'var(--text-muted)' },
}

export default function Documents() {
  const [docs, setDocs] = useState(MOCK_DOCS)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ name: '', category: 'agreement', entityType: 'deal', entity: '', notes: '' })

  const addDoc = () => {
    setDocs(prev => [{
      id: Date.now(), ...form,
      uploadedBy: 'Admin Manager',
      size: 'Unknown',
      date: new Date().toISOString().slice(0, 10),
      url: '#',
    }, ...prev])
    setShowModal(false)
  }

  const deleteDoc = id => setDocs(prev => prev.filter(d => d.id !== id))

  const filtered = filter === 'all' ? docs : docs.filter(d => d.entityType === filter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Documents</div>
          <div className="page-subtitle">Agreements, contracts, ID proofs & brochures</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Upload size={15} /> Upload Document
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'deal', 'client', 'property', 'lead'].map(t => (
          <button key={t} className={`btn ${filter === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* Document grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
        {filtered.map(doc => {
          const catStyle = CAT_COLORS[doc.category] || CAT_COLORS.other
          return (
            <div key={doc.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 8, flexShrink: 0,
                  background: catStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={20} style={{ color: catStyle.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 13, marginBottom: 3,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {doc.entity} · {doc.size} · {doc.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                      background: catStyle.bg, color: catStyle.color, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{doc.category}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>by {doc.uploadedBy}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                <a href={doc.url} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                  <ExternalLink size={12} /> View
                </a>
                <button className="btn btn-ghost btn-sm" onClick={() => deleteDoc(doc.id)}>
                  <Trash2 size={12} style={{ color: 'var(--red)' }} />
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: 48 }}>No documents found.</div>
        )}
      </div>

      {showModal && (
        <Modal title="Upload Document" onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Document Name', 'name', 'text'], ['Linked Entity (e.g. Suresh Iyer Deal)', 'entity', 'text']].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%' }} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%' }}>
                  {['agreement','contract','id-proof','brochure','site-plan','other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Entity Type</label>
                <select value={form.entityType} onChange={e => setForm(f => ({ ...f, entityType: e.target.value }))} style={{ width: '100%' }}>
                  {['deal','client','lead','property'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Notes (optional)</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ width: '100%' }} />
            </div>
            <div style={{
              padding: '20px', border: '2px dashed var(--border)', borderRadius: 8,
              textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
              background: 'var(--bg)',
            }}>
              <Upload size={20} style={{ margin: '0 auto 8px', display: 'block' }} />
              Click to upload or drag & drop<br />
              <span style={{ fontSize: 11 }}>PDF, DOCX, JPG up to 10MB</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={addDoc}>Save Document</button>
          </div>
        </Modal>
      )}
    </div>
  )
}