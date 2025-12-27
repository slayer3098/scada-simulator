import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Shield, Eye, Activity } from 'lucide-react';

const MetricsPanel = ({ metrics, defenseStats, anomalyStats }) => {
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  const getDefenseChartData = () => {
    if (!defenseStats.blocksByDefense) return [];
    
    return Object.entries(defenseStats.blocksByDefense).map(([defense, count]) => ({
      name: defense,
      blocks: count
    }));
  };

  const getAnomalyChartData = () => {
    if (!anomalyStats.severityCounts) return [];
    
    return Object.entries(anomalyStats.severityCounts)
      .filter(([_, count]) => count > 0)
      .map(([severity, count]) => ({
        name: severity.charAt(0).toUpperCase() + severity.slice(1),
        value: count
      }));
  };

  const defenseChartData = getDefenseChartData();
  const anomalyChartData = getAnomalyChartData();

  const blockRate = defenseStats.blockRate || 0;
  const activeDefenses = defenseStats.activeDefenses?.length || 0;

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
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '10px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TrendingUp size={20} color="#ffffff" />
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#111827',
          margin: 0
        }}>
          System Metrics & Analytics
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: '12px',
          border: '1px solid #bfdbfe'
        }}>
          <Shield size={24} style={{ color: '#3b82f6', marginBottom: '12px' }} />
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#1e40af',
            marginBottom: '4px'
          }}>
            Defense Effectiveness
          </label>
          <p style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e3a8a',
            margin: '0 0 4px 0'
          }}>
            {blockRate}%
          </p>
          <small style={{ color: '#3b82f6', fontSize: '12px' }}>
            {defenseStats.blocked} / {defenseStats.totalProcessed} blocked
          </small>
        </div>

        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '12px',
          border: '1px solid #bbf7d0'
        }}>
          <Activity size={24} style={{ color: '#10b981', marginBottom: '12px' }} />
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#065f46',
            marginBottom: '4px'
          }}>
            Active Defenses
          </label>
          <p style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#064e3b',
            margin: '0 0 4px 0'
          }}>
            {activeDefenses}
          </p>
          <small style={{ color: '#10b981', fontSize: '12px' }}>
            {defenseStats.activeDefenses?.join(', ') || 'None'}
          </small>
        </div>

        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderRadius: '12px',
          border: '1px solid #fde68a'
        }}>
          <Eye size={24} style={{ color: '#f59e0b', marginBottom: '12px' }} />
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#92400e',
            marginBottom: '4px'
          }}>
            Anomalies Detected
          </label>
          <p style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#78350f',
            margin: '0 0 4px 0'
          }}>
            {anomalyStats.totalAnomalies || 0}
          </p>
          <small style={{ color: '#f59e0b', fontSize: '12px' }}>
            {anomalyStats.isLearning ? 'Learning Mode' : 'Active Detection'}
          </small>
        </div>
      </div>

      {defenseChartData.length > 0 && (
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Blocks by Defense Mechanism
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={defenseChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="blocks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {anomalyChartData.length > 0 && (
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Anomalies by Severity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={anomalyChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {anomalyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{
        padding: '20px',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px'
        }}>
          Detection Statistics
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Total Packets Processed:</span>
            <strong style={{ color: '#111827', fontSize: '14px' }}>{defenseStats.totalProcessed || 0}</strong>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Packets Allowed:</span>
            <strong style={{ color: '#10b981', fontSize: '14px' }}>{defenseStats.allowed || 0}</strong>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Packets Blocked:</span>
            <strong style={{ color: '#ef4444', fontSize: '14px' }}>{defenseStats.blocked || 0}</strong>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Baseline Status:</span>
            <strong style={{ 
              color: anomalyStats.isLearning ? '#f59e0b' : '#10b981',
              fontSize: '14px'
            }}>
              {anomalyStats.isLearning ? 'Learning' : 'Established'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
