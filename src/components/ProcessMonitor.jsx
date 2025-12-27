import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Thermometer, Gauge, Droplets, Power, AlertCircle, Check } from 'lucide-react';
import { SYSTEM_CONSTANTS } from '../utils/constants';

const ProcessMonitor = ({ processState, processHistory, isRunning }) => {
  const getStatusColor = (value, min, max) => {
    const range = max - min;
    const warning = max - range * 0.15;
    const critical = max - range * 0.05;
    
    if (value >= critical) return '#ef4444';
    if (value >= warning) return '#f59e0b';
    return '#10b981';
  };

  const getChartData = () => {
    if (!processHistory.temperature) return [];
    
    const length = processHistory.temperature.length;
    return Array.from({ length }, (_, i) => ({
      index: i,
      temperature: processHistory.temperature[i]?.toFixed(1),
      pressure: processHistory.pressure[i]?.toFixed(1),
      flowRate: processHistory.flowRate[i]?.toFixed(1)
    }));
  };

  const chartData = getChartData();

  const indicators = [
    {
      name: 'Temperature',
      icon: Thermometer,
      value: processState.temperature,
      unit: '°C',
      min: SYSTEM_CONSTANTS.SAFETY_LIMITS.TEMPERATURE_MIN,
      max: SYSTEM_CONSTANTS.SAFETY_LIMITS.TEMPERATURE_MAX
    },
    {
      name: 'Pressure',
      icon: Gauge,
      value: processState.pressure,
      unit: ' PSI',
      min: SYSTEM_CONSTANTS.SAFETY_LIMITS.PRESSURE_MIN,
      max: SYSTEM_CONSTANTS.SAFETY_LIMITS.PRESSURE_MAX
    },
    {
      name: 'Flow Rate',
      icon: Droplets,
      value: processState.flowRate,
      unit: ' L/min',
      min: SYSTEM_CONSTANTS.SAFETY_LIMITS.FLOW_RATE_MIN,
      max: SYSTEM_CONSTANTS.SAFETY_LIMITS.FLOW_RATE_MAX
    }
  ];

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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '10px'
          }}>
            <Gauge size={20} color="#ffffff" />
          </div>
          Industrial Process Monitor
        </h2>
        <span style={{
          padding: '6px 16px',
          background: isRunning ? '#d1fae5' : '#f3f4f6',
          color: isRunning ? '#065f46' : '#6b7280',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.5px'
        }}>
          {isRunning ? 'ACTIVE' : 'STANDBY'}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {indicators.map((indicator, idx) => {
          const Icon = indicator.icon;
          const color = getStatusColor(indicator.value, indicator.min, indicator.max);
          const percentage = ((indicator.value / indicator.max) * 100).toFixed(0);
          
          return (
            <div 
              key={idx}
              style={{
                padding: '20px',
                background: '#ffffff',
                border: `2px solid ${color}20`,
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: color
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <Icon size={28} style={{ color }} />
              </div>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {indicator.name}
              </h3>
              <p style={{
                fontSize: '36px',
                fontWeight: '700',
                color,
                margin: '0 0 4px 0',
                lineHeight: 1
              }}>
                {indicator.value?.toFixed(1) || '0.0'}<span style={{ fontSize: '20px' }}>{indicator.unit}</span>
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#9ca3af',
                marginBottom: '8px'
              }}>
                <span>Min: {indicator.min}{indicator.unit}</span>
                <span>Max: {indicator.max}{indicator.unit}</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: color,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {[
          { icon: Power, label: 'Pump Status', value: processState.pumpStatus ? 'ON' : 'OFF', color: processState.pumpStatus ? '#10b981' : '#ef4444' },
          { icon: Gauge, label: 'Valve Position', value: `${processState.valvePosition || 0}%`, color: '#3b82f6' },
          { icon: processState.safetyInterlock ? Check : AlertCircle, label: 'Safety Interlock', value: processState.safetyInterlock ? 'ACTIVE' : 'TRIPPED', color: processState.safetyInterlock ? '#10b981' : '#ef4444' },
          { icon: processState.alarmActive ? AlertCircle : Check, label: 'System Alarms', value: processState.alarmActive ? 'ACTIVE' : 'CLEAR', color: processState.alarmActive ? '#ef4444' : '#10b981' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: `${item.color}08`,
                border: `2px solid ${item.color}30`,
                borderRadius: '10px'
              }}
            >
              <Icon size={24} style={{ color: item.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>
                  {item.label}
                </span>
                <strong style={{ fontSize: '15px', color: item.color, fontWeight: '700' }}>
                  {item.value}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {chartData.length > 0 && (
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Process Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="index" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="pressure" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Pressure (PSI)"
              />
              <Line 
                type="monotone" 
                dataKey="flowRate" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                name="Flow Rate (L/min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ProcessMonitor;
