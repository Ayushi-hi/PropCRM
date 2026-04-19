import { Menu, Bell, Search } from 'lucide-react'

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  properties: 'Properties',
  deals: 'Deals',
  followups: 'Follow-ups',
  analytics: 'Analytics',
}

export default function Header({ page, onMenuClick }) {
  return (
    <header style={{
      height: 'var(--header-h)', background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 16,
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <button className="btn btn-ghost" onClick={onMenuClick} style={{ display: 'none', padding: 6 }}
        id="menu-btn">
        <Menu size={20} />
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
          {PAGE_LABELS[page] || 'PropCRM'}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input placeholder="Search…" style={{ paddingLeft: 30, width: 200, background: 'var(--bg)' }} />
      </div>

      <button className="btn btn-ghost" style={{ position: 'relative', padding: 8 }}>
        <Bell size={18} />
        <span style={{
          position: 'absolute', top: 5, right: 5,
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--accent)', border: '1.5px solid var(--surface)',
        }} />
      </button>

      <div style={{
        width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
      }}>AM</div>

      <style>{`
        @media (max-width: 768px) {
          #menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}