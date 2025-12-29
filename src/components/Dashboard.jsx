import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const Dashboard = ({ isRunning, onStart, onStop, onReset, metrics }) => {
  const getHealthColor = (health) => {
    if (health >= 80) return '#10b981';
    if (health >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthStatus = (health) => {
    if (health >= 80) return 'Optimal';
    if (health >= 50) return 'Warning';
    return 'Critical';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div style={{
      padding: '16px',
      background: '#ffffff'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <ShieldCheck size={32} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ 
              color: '#ffffff', 
              fontSize: '28px', 
              fontWeight: '700',
              margin: 0,
              marginBottom: '4px'
            }}>
              Network Security Monitor
            </h1>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              margin: 0,
              fontSize: '14px'
            }}>
              Real-time threat detection dashboard
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: isRunning ? 'rgba(16, 185, 129, 0.2)' : 'rgba(156, 163, 175, 0.2)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Activity size={16} color="#ffffff" />
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>
              {isRunning ? 'Live' : 'Idle'}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: isRunning ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
              }}
              onClick={isRunning ? onStop : onStart}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              <span>{isRunning ? 'Stop' : 'Start'}</span>
            </button>
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onClick={onReset}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          padding: '24px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <Activity size={24} color="#ffffff" />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: '#ecfdf5',
              borderRadius: '6px'
            }}>
              <TrendingUp size={16} color="#10b981" />
              <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>+12.5%</span>
            </div>
          </div>
          <h3 style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
            Total Packets
          </h3>
          <p style={{ 
            color: '#111827', 
            fontSize: '32px', 
            fontWeight: '700',
            margin: '0 0 4px 0'
          }}>
            {formatNumber(metrics.totalPackets)}
          </p>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>processed</span>
        </div>

        <div style={{
          padding: '24px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <Shield size={24} color="#ffffff" />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: '#fef2f2',
              borderRadius: '6px'
            }}>
              <TrendingUp size={16} color="#ef4444" style={{ transform: 'rotate(180deg)' }} />
              <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600' }}>-3.2%</span>
            </div>
          </div>
          <h3 style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
            Blocked Packets
          </h3>
          <p style={{ 
            color: '#111827', 
            fontSize: '32px', 
            fontWeight: '700',
            margin: '0 0 4px 0'
          }}>
            {formatNumber(metrics.blockedPackets)}
          </p>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>intercepted</span>
        </div>

        <div style={{
          padding: '24px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <AlertTriangle size={24} color="#ffffff" />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: '#fef3c7',
              borderRadius: '6px'
            }}>
              <TrendingUp size={16} color="#f59e0b" />
              <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600' }}>+8.7%</span>
            </div>
          </div>
          <h3 style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
            Attacks Detected
          </h3>
          <p style={{ 
            color: '#111827', 
            fontSize: '32px', 
            fontWeight: '700',
            margin: '0 0 4px 0'
          }}>
            {formatNumber(metrics.attacksDetected)}
          </p>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>threats</span>
        </div>

        <div style={{
          padding: '24px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px',
              background: `linear-gradient(135deg, ${getHealthColor(metrics.systemHealth)}, ${getHealthColor(metrics.systemHealth)}dd)`,
              borderRadius: '12px',
              boxShadow: `0 4px 12px ${getHealthColor(metrics.systemHealth)}40`
            }}>
              <CheckCircle size={24} color="#ffffff" />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: metrics.systemHealth >= 80 ? '#ecfdf5' : '#fef2f2',
              borderRadius: '6px'
            }}>
              <TrendingUp 
                size={16} 
                color={metrics.systemHealth >= 80 ? '#10b981' : '#ef4444'} 
                style={{ transform: metrics.systemHealth >= 80 ? 'none' : 'rotate(180deg)' }}
              />
              <span style={{ 
                color: metrics.systemHealth >= 80 ? '#10b981' : '#ef4444', 
                fontSize: '12px', 
                fontWeight: '600' 
              }}>
                {metrics.systemHealth >= 80 ? '+2.1%' : '-1.3%'}
              </span>
            </div>
          </div>
          <h3 style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
            System Health
          </h3>
          <p style={{ 
            color: getHealthColor(metrics.systemHealth), 
            fontSize: '32px', 
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            {metrics.systemHealth}%
          </p>
          <div style={{
            display: 'inline-flex',
            padding: '4px 12px',
            background: `${getHealthColor(metrics.systemHealth)}15`,
            borderRadius: '6px'
          }}>
            <span style={{ 
              color: getHealthColor(metrics.systemHealth), 
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {getHealthStatus(metrics.systemHealth)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
