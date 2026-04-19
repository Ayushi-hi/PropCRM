import { MapPin, IndianRupee, Home, Users } from 'lucide-react'
import Badge from '../components/Badge'
import { properties } from '../data/mockData'

export default function Properties() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Properties</div>
        <div className="page-subtitle">{properties.length} active listings</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {properties.map(p => (
          <div key={p.id} className="card" style={{ overflow: 'hidden' }}>
            {/* Image placeholder */}
            <div style={{
              height: 140, background: `linear-gradient(135deg, #2a2520 0%, #3d3028 50%, #4a3520 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <Home size={36} style={{ color: 'rgba(255,255,255,0.18)' }} />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <Badge label={p.availability} />
              </div>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                padding: '20px 16px 10px',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff' }}>{p.title}</div>
              </div>
            </div>

            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: 12, marginBottom: 10 }}>
                <MapPin size={12} /> {p.location}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{p.price}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.type}</div>
                </div>
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {p.amenities.map(a => (
                  <span key={a} style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                    background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)',
                  }}>{a}</span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <Users size={12} /> {p.linkedLeads} linked lead{p.linkedLeads !== 1 ? 's' : ''}
                </div>
                <button className="btn btn-primary btn-sm">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}