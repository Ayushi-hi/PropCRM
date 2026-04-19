import { LayoutDashboard, Users, Building2, Handshake, Bell, BarChart3, FileText, Activity, UserCheck, X } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'deals', label: 'Deals', icon: Handshake },
  { id: 'followups', label: 'Follow-ups', icon: Bell },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'activity', label: 'Activity Feed', icon: Activity },
  { id: 'agents', label: 'Agent Report', icon: UserCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar({ active, onNavigate, open, onClose }) {
  const isMobile = window.innerWidth <= 768

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0,
      width: 'var(--sidebar-w)', height: '100vh',
      background: 'var(--text-primary)',
      display: 'flex', flexDirection: 'column',
      zIndex: 200,
      transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
      transition: 'transform 0.3s ease',
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', lineHeight: 1.1 }}>PropCRM</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginTop: 2 }}>REAL ESTATE</div>
          </div>
          {isMobile && (
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, display: 'flex' }}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', padding: '8px 10px 4px', textTransform: 'uppercase' }}>Menu</div>
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: isActive ? 'rgba(200,98,26,0.18)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontFamily: 'var(--font)', fontWeight: isActive ? 600 : 400,
                marginBottom: 2, transition: 'all 0.15s',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                textAlign: 'left',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>AM</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>Admin Manager</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}