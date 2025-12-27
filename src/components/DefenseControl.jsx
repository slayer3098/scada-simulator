import React from 'react';
import { Shield, Lock, Key, Eye, Gauge, ShieldCheck } from 'lucide-react';
import { SYSTEM_CONSTANTS } from '../utils/constants';

const DefenseControl = ({ defenseStatus, onToggleDefense, onEnableAll }) => {
  const defenses = [
    {
      id: 'firewall',
      name: 'Firewall',
      icon: Shield,
      description: 'Packet filtering and IP whitelisting',
      effectiveness: SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.FIREWALL,
      color: '#3b82f6'
    },
    {
      id: 'encryption',
      name: 'TLS Encryption',
      icon: Lock,
      description: 'TLS 1.3 encrypted communications',
      effectiveness: SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.ENCRYPTION,
      color: '#8b5cf6'
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: Key,
      description: 'Token-based access control',
      effectiveness: SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.AUTHENTICATION,
      color: '#10b981'
    },
    {
      id: 'ids',
      name: 'Intrusion Detection',
      icon: Eye,
      description: 'Pattern and anomaly detection',
      effectiveness: SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.IDS,
      color: '#f59e0b'
    },
    {
      id: 'rateLimit',
      name: 'Rate Limiting',
      icon: Gauge,
      description: 'Request throttling (100/min)',
      effectiveness: SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.RATE_LIMIT,
      color: '#ef4444'
    }
  ];

  const enabledCount = Object.values(defenseStatus).filter(Boolean).length;
  const totalDefenses = defenses.length;
  const protectionLevel = Math.round((enabledCount / totalDefenses) * 100);

  const getProtectionColor = () => {
    if (enabledCount === totalDefenses) return '#10b981';
    if (enabledCount >= 3) return '#3b82f6';
    if (enabledCount >= 1) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '20px',
          fontWeight: '700',
          color: '#111827',
          margin: 0
        }}>
          <div style={{
            padding: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} color="#ffffff" />
          </div>
          Defense Mechanisms
        </h2>
        <span style={{
          padding: '6px 12px',
          background: enabledCount > 0 ? '#d1fae5' : '#f3f4f6',
          color: enabledCount > 0 ? '#065f46' : '#6b7280',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {enabledCount}/{totalDefenses} Active
        </span>
      </div>

      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid #bbf7d0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#065f46'
          }}>
            System Protection Level
          </span>
          <strong style={{
            fontSize: '18px',
            fontWeight: '700',
            color: getProtectionColor()
          }}>
            {protectionLevel}%
          </strong>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          background: '#e5e7eb',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{
            width: `${protectionLevel}%`,
            height: '100%',
            background: getProtectionColor(),
            borderRadius: '6px',
            transition: 'all 0.5s ease'
          }} />
        </div>

        <button 
          onClick={onEnableAll}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          <ShieldCheck size={18} />
          Enable All Defenses
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {defenses.map(defense => {
          const Icon = defense.icon;
          const isEnabled = defenseStatus[defense.id] || false;

          return (
            <div 
              key={defense.id}
              style={{
                padding: '20px',
                background: isEnabled ? `${defense.color}08` : '#f9fafb',
                border: `2px solid ${isEnabled ? defense.color : '#e5e7eb'}`,
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '12px',
                  background: `${defense.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{ color: defense.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0 0 4px 0'
                  }}>
                    {defense.name}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {defense.description}
                  </p>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '52px',
                  height: '28px'
                }}>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => onToggleDefense(defense.id, e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <span
                    onClick={() => onToggleDefense(defense.id, !isEnabled)}
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isEnabled ? defense.color : '#d1d5db',
                      borderRadius: '14px',
                      transition: '0.4s',
                      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '22px',
                      width: '22px',
                      left: isEnabled ? '27px' : '3px',
                      bottom: '3px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      transition: '0.4s',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }} />
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <label style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>
                    Effectiveness
                  </label>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {Math.round(defense.effectiveness * 100)}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${defense.effectiveness * 100}%`,
                    height: '100%',
                    background: defense.color,
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {isEnabled && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: `${defense.color}15`,
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: defense.color,
                    borderRadius: '50%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: defense.color
                  }}>
                    Active and Monitoring
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '20px',
        background: '#f9fafb',
        borderRadius: '12px',
        marginBottom: '16px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '12px'
        }}>
          Defense Layer Strategy
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '20px',
          color: '#4b5563',
          fontSize: '13px',
          lineHeight: '1.8'
        }}>
          <li>
            <strong style={{ color: '#111827' }}>Firewall:</strong> First line of defense - filters suspicious packets and IPs
          </li>
          <li>
            <strong style={{ color: '#111827' }}>Rate Limiting:</strong> Prevents flood attacks by throttling requests
          </li>
          <li>
            <strong style={{ color: '#111827' }}>Authentication:</strong> Ensures only authorized commands are executed
          </li>
          <li>
            <strong style={{ color: '#111827' }}>Encryption:</strong> Protects data in transit from MITM attacks
          </li>
          <li>
            <strong style={{ color: '#111827' }}>IDS:</strong> Detects attack patterns and anomalous behavior
          </li>
        </ul>
      </div>

      <div style={{
        padding: '16px',
        background: enabledCount === 0 ? '#fef2f2' : 
                   enabledCount < 3 ? '#fef3c7' :
                   enabledCount < 5 ? '#dbeafe' : '#d1fae5',
        borderRadius: '12px',
        border: `1px solid ${
          enabledCount === 0 ? '#fecaca' : 
          enabledCount < 3 ? '#fde68a' :
          enabledCount < 5 ? '#bfdbfe' : '#bbf7d0'
        }`
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '8px'
        }}>
          💡 Recommendations
        </h4>
        {enabledCount === 0 && (
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#7f1d1d',
            lineHeight: '1.5'
          }}>
            ⚠️ No defenses active! System is vulnerable to all attack types.
          </p>
        )}
        {enabledCount > 0 && enabledCount < 3 && (
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#92400e',
            lineHeight: '1.5'
          }}>
            ⚠️ Limited protection. Enable more defenses for better security.
          </p>
        )}
        {enabledCount >= 3 && enabledCount < 5 && (
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#1e40af',
            lineHeight: '1.5'
          }}>
            ℹ️ Good protection level. Consider enabling all defenses for maximum security.
          </p>
        )}
        {enabledCount === 5 && (
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#065f46',
            lineHeight: '1.5'
          }}>
            ✓ Excellent! All defense layers are active. System is well protected.
          </p>
        )}
      </div>
    </div>
  );
};

export default DefenseControl;
