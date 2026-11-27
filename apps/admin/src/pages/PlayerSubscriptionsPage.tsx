import { useState } from 'react';
import { Award, Clock, RotateCcw, ShieldCheck, X, Zap } from 'lucide-react';

interface PlayerSubscriptionsPageProps {
  registrations: any[];
  onRefresh: () => void;
  onUpdateStatus: (id: number, status: 'paid' | 'pending' | 'expired') => void;
}

export default function PlayerSubscriptionsPage({ registrations, onRefresh, onUpdateStatus }: PlayerSubscriptionsPageProps) {
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null);
  const fetchRegistrations = onRefresh;
  const handleUpdateStatus = onUpdateStatus;

  return (
    <>
        <main style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(1rem, 2.5vw, 1.75rem) clamp(0.75rem, 3.5vw, 2rem)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ADMINISTRATION & MEMBERSHIP
              </span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0' }}>
                Player Registrations & Yearly Subscription Control
              </h1>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                Manage player verification, view payment receipts, uniform kit sizes, and handle yearly renewals.
              </p>
            </div>
            <button
              onClick={fetchRegistrations}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={13} />
              <span>Refresh Records</span>
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px 0' }}>Total Registered</p>
                <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>{registrations.length}</p>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Season players</p>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                <Award size={20} />
              </div>
            </div>

            <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px 0' }}>Active (Paid)</p>
                <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#10b981', margin: 0, lineHeight: 1 }}>
                  {registrations.filter(r => !r.isExpired && r.paymentStatus === 'paid').length}
                </p>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', marginTop: '6px' }}>Valid yearly pass</p>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px 0' }}>Expired Members</p>
                <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#dc2626', margin: 0, lineHeight: 1 }}>
                  {registrations.filter(r => r.isExpired).length}
                </p>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#dc2626', marginTop: '6px' }}>1 year ended</p>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                <Clock size={20} />
              </div>
            </div>

            <div className="tv-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px 0' }}>Pass Revenue</p>
                <p style={{ fontSize: '1.625rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>
                  ₹{(registrations.filter(r => r.paymentStatus === 'paid').length * 2500).toLocaleString()}
                </p>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>@ ₹2,500 / player</p>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <Zap size={20} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="tv-card" style={{ padding: '24px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px' }}>Player Details</th>
                    <th style={{ padding: '10px 14px' }}>Role</th>
                    <th style={{ padding: '10px 14px' }}>Jersey & Pant</th>
                    <th style={{ padding: '10px 14px' }}>Membership ID</th>
                    <th style={{ padding: '10px 14px' }}>Payment & Expiry</th>
                    <th style={{ padding: '10px 14px' }}>Proof</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: reg.isExpired ? '#fef2f2' : 'transparent' }}>
                      <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={reg.photoUrl}
                          alt={reg.fullName}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${reg.isExpired ? '#ef4444' : '#10b981'}` }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{reg.fullName}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{reg.mobileNumber}</div>
                          <div style={{ fontSize: '0.625rem', color: '#94a3b8', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reg.address}</div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: '#ecfdf5',
                          color: '#065f46'
                        }}>
                          {reg.role}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>T-Shirt: {reg.tshirtSize}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pant: {reg.pantSize}"</div>
                      </td>

                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 800, color: '#475569' }}>
                        {reg.membershipId}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {reg.isExpired ? (
                          <div>
                            <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #fecaca' }}>
                              EXPIRED (1 Year Over)
                            </span>
                            <div style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '2px' }}>
                              Expired {new Date(reg.subscriptionEnd).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #86efac' }}>
                              PAID & ACTIVE
                            </span>
                            <div style={{ fontSize: '0.6875rem', color: '#16a34a', marginTop: '2px', fontWeight: 700 }}>
                              {reg.daysRemaining} days left (Valid till {new Date(reg.subscriptionEnd).toLocaleDateString()})
                            </div>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => setReceiptModalUrl(reg.paymentScreenshotUrl)}
                          style={{
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          View Receipt
                        </button>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {reg.isExpired ? (
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'paid')}
                            style={{
                              backgroundColor: '#10b981',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Renew 1-Year Pass
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'expired')}
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Mark Expired
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      {/* RECEIPT MODAL */}
      {receiptModalUrl && (
        <div
          onClick={() => setReceiptModalUrl(null)}
          className="modal-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-card"
            style={{ padding: '24px', maxWidth: '480px', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Payment Proof Screenshot</h3>
              <button onClick={() => setReceiptModalUrl(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <img
              src={receiptModalUrl}
              alt="Payment Screenshot"
              style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
            <button
              onClick={() => setReceiptModalUrl(null)}
              style={{ marginTop: '16px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </>
  );
}
