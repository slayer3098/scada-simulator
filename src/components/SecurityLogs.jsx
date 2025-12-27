import React, { useState } from 'react';
import { ScrollText, AlertCircle, Info, AlertTriangle, X, Download } from 'lucide-react';
import { formatTimestamp } from '../utils/helpers';
import { ALERT_LEVELS, ALERT_COLORS } from '../utils/constants';

const SecurityLogs = ({ logs }) => {
  const [filter, setFilter] = useState('all');
  const [maxLogs, setMaxLogs] = useState(100);

  const getFilteredLogs = () => {
    let filtered = [...logs].reverse();
    if (filter !== 'all') {
      filtered = filtered.filter(log => log.level === filter);
    }
    return filtered.slice(0, maxLogs);
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case ALERT_LEVELS.CRITICAL:
        return <AlertCircle size={16} />;
      case ALERT_LEVELS.WARNING:
        return <AlertTriangle size={16} />;
      case ALERT_LEVELS.INFO:
      default:
        return <Info size={16} />;
    }
  };

  const getLevelColor = (level) => {
    return ALERT_COLORS[level] || ALERT_COLORS.info;
  };

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${formatTimestamp(log.timestamp)}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = getFilteredLogs();
  
  const criticalCount = logs.filter(l => l.level === ALERT_LEVELS.CRITICAL).length;
  const warningCount = logs.filter(l => l.level === ALERT_LEVELS.WARNING).length;
  const infoCount = logs.filter(l => l.level === ALERT_LEVELS.INFO).length;

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
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '10px'
          }}>
            <ScrollText size={20} color="#ffffff" />
          </div>
          Security Event Logs
        </h2>
        <button 
          onClick={exportLogs}
          title="Export logs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#2563eb'}
          onMouseOut={(e) => e.target.style.background = '#3b82f6'}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '2px solid #fecaca',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={24} color="#dc2626" />
          <div>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
              {criticalCount}
            </span>
            <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600' }}>Critical</span>
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #fde68a',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={24} color="#f59e0b" />
          <div>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
              {warningCount}
            </span>
            <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '600' }}>Warnings</span>
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '2px solid #bfdbfe',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Info size={24} color="#3b82f6" />
          <div>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
              {infoCount}
            </span>
            <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600' }}>Info</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {['all', ALERT_LEVELS.CRITICAL, ALERT_LEVELS.WARNING, ALERT_LEVELS.INFO].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              background: filter === f ? '#3b82f6' : '#ffffff',
              color: filter === f ? '#ffffff' : '#6b7280',
              border: `2px solid ${filter === f ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f === 'all' ? 'All Events' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{
        maxHeight: '600px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {logs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af'
          }}>
            <ScrollText size={48} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>No security events logged</p>
            <span style={{ fontSize: '14px' }}>Events will appear here as the system operates</span>
          </div>
        )}

        {filteredLogs.length === 0 && logs.length > 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af'
          }}>
            <X size={48} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>No events match filter</p>
          </div>
        )}

        {filteredLogs.map(log => (
          <div 
            key={log.id}
            style={{
              padding: '16px',
              background: '#ffffff',
              border: '2px solid #e5e7eb',
              borderLeft: `4px solid ${getLevelColor(log.level)}`,
              borderRadius: '12px',
              display: 'flex',
              gap: '12px'
            }}
          >
            <div style={{
              padding: '8px',
              background: `${getLevelColor(log.level)}15`,
              borderRadius: '8px',
              height: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ color: getLevelColor(log.level) }}>
                {getLevelIcon(log.level)}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  {formatTimestamp(log.timestamp)}
                </span>
                <span style={{
                  padding: '4px 8px',
                  background: `${getLevelColor(log.level)}15`,
                  color: getLevelColor(log.level),
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {log.level}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#111827',
                lineHeight: '1.5'
              }}>
                {log.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: '#f9fafb',
        borderRadius: '8px'
      }}>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          Showing {filteredLogs.length} of {logs.length} events
        </span>
        {logs.length > 100 && (
          <button 
            onClick={() => setMaxLogs(prev => prev + 100)}
            style={{
              padding: '6px 12px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default SecurityLogs;
