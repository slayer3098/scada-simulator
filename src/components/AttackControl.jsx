import React, { useState } from 'react';
import { Skull, Radio, Zap, Repeat, Play, StopCircle, AlertTriangle } from 'lucide-react';
import { SYSTEM_CONSTANTS } from '../utils/constants';

const AttackControl = ({ onLaunchAttack, activeAttacks, onStopAttack, isRunning }) => {
  const [selectedAttack, setSelectedAttack] = useState('MITM');
  const [attackParams, setAttackParams] = useState({
    targetRegister: SYSTEM_CONSTANTS.REGISTERS.TEMPERATURE,
    maliciousValue: 95,
    dangerousValue: 0,
    intensity: 'medium'
  });

  const handleLaunch = () => {
    if (!isRunning) {
      alert('Please start the simulation first');
      return;
    }

    onLaunchAttack(selectedAttack, attackParams);
  };

  const attackTypes = [
    {
      id: 'MITM',
      name: 'Man-in-the-Middle',
      icon: Radio,
      description: 'Intercept and modify Modbus packets in transit',
      color: '#ef4444'
    },
    {
      id: 'DoS',
      name: 'Denial of Service',
      icon: Zap,
      description: 'Flood the network with malformed packets',
      color: '#f59e0b'
    },
    {
      id: 'Injection',
      name: 'Command Injection',
      icon: Skull,
      description: 'Inject unauthorized commands to critical registers',
      color: '#8b5cf6'
    },
    {
      id: 'Replay',
      name: 'Replay Attack',
      icon: Repeat,
      description: 'Capture and replay legitimate commands',
      color: '#3b82f6'
    }
  ];

  const registerOptions = [
    { value: SYSTEM_CONSTANTS.REGISTERS.TEMPERATURE, label: 'Temperature Control' },
    { value: SYSTEM_CONSTANTS.REGISTERS.PRESSURE, label: 'Pressure Control' },
    { value: SYSTEM_CONSTANTS.REGISTERS.FLOW_RATE, label: 'Flow Rate Control' },
    { value: SYSTEM_CONSTANTS.REGISTERS.PUMP_CONTROL, label: 'Pump Control' },
    { value: SYSTEM_CONSTANTS.REGISTERS.VALVE_POSITION, label: 'Valve Position' },
    { value: SYSTEM_CONSTANTS.REGISTERS.SAFETY_INTERLOCK, label: 'Safety Interlock' }
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Skull size={20} color="#ffffff" />
          </div>
          Attack Control Center
        </h2>
        <span style={{
          padding: '6px 12px',
          background: activeAttacks.length > 0 ? '#fee2e2' : '#f3f4f6',
          color: activeAttacks.length > 0 ? '#dc2626' : '#6b7280',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {activeAttacks.length} Active
        </span>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '12px'
        }}>
          Select Attack Type:
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {attackTypes.map(attack => {
            const Icon = attack.icon;
            const isSelected = selectedAttack === attack.id;
            return (
              <button
                key={attack.id}
                onClick={() => setSelectedAttack(attack.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px',
                  background: isSelected ? `${attack.color}08` : '#ffffff',
                  border: `2px solid ${isSelected ? attack.color : '#e5e7eb'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = `${attack.color}05`;
                    e.currentTarget.style.borderColor = `${attack.color}40`;
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <Icon size={32} style={{ color: attack.color }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  textAlign: 'center'
                }}>
                  {attack.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        padding: '16px',
        background: '#fef3c7',
        borderRadius: '12px',
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        border: '1px solid #fde68a'
      }}>
        <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: '#92400e',
          lineHeight: '1.5'
        }}>
          {attackTypes.find(a => a.id === selectedAttack)?.description}
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px'
        }}>
          Attack Parameters
        </h3>
        
        {(selectedAttack === 'MITM' || selectedAttack === 'Injection' || selectedAttack === 'Replay') && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Target Register:
            </label>
            <select 
              value={attackParams.targetRegister}
              onChange={(e) => setAttackParams({
                ...attackParams, 
                targetRegister: parseInt(e.target.value)
              })}
              style={{
                width: '100%',
                padding: '12px',
                background: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#111827',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {registerOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} (0x{opt.value.toString(16).toUpperCase().padStart(4, '0')})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedAttack === 'MITM' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Malicious Value:
            </label>
            <input 
              type="number" 
              value={attackParams.maliciousValue}
              onChange={(e) => setAttackParams({
                ...attackParams, 
                maliciousValue: parseInt(e.target.value)
              })}
              min="0"
              max="200"
              style={{
                width: '100%',
                padding: '12px',
                background: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#111827',
                outline: 'none'
              }}
            />
            <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Value to inject (0-200)
            </small>
          </div>
        )}

        {selectedAttack === 'Injection' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Dangerous Value:
            </label>
            <input 
              type="number" 
              value={attackParams.dangerousValue}
              onChange={(e) => setAttackParams({
                ...attackParams, 
                dangerousValue: parseInt(e.target.value)
              })}
              min="0"
              max="200"
              style={{
                width: '100%',
                padding: '12px',
                background: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#111827',
                outline: 'none'
              }}
            />
            <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Critical value to inject (0-200)
            </small>
          </div>
        )}

        {(selectedAttack === 'DoS' || selectedAttack === 'MITM') && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Attack Intensity:
            </label>
            <select 
              value={attackParams.intensity}
              onChange={(e) => setAttackParams({
                ...attackParams, 
                intensity: e.target.value
              })}
              style={{
                width: '100%',
                padding: '12px',
                background: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#111827',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="low">Low (200 pps)</option>
              <option value="medium">Medium (500 pps)</option>
              <option value="high">High (1000 pps)</option>
            </select>
          </div>
        )}
      </div>

      <button 
        onClick={handleLaunch}
        disabled={!isRunning}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '14px',
          background: isRunning ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#e5e7eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: isRunning ? 'pointer' : 'not-allowed',
          boxShadow: isRunning ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none',
          transition: 'all 0.3s ease',
          marginBottom: activeAttacks.length > 0 ? '24px' : 0
        }}
        onMouseOver={(e) => {
          if (isRunning) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
          }
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          if (isRunning) {
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }
        }}
      >
        <Play size={20} />
        Launch {attackTypes.find(a => a.id === selectedAttack)?.name}
      </button>

      {activeAttacks.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            Active Attacks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeAttacks.map(attack => (
              <div 
                key={attack.id}
                style={{
                  padding: '16px',
                  background: '#fef2f2',
                  border: '2px solid #fecaca',
                  borderRadius: '12px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div>
                    <strong style={{ color: '#111827', fontSize: '14px' }}>{attack.type}</strong>
                    <span style={{
                      marginLeft: '12px',
                      color: '#6b7280',
                      fontSize: '13px'
                    }}>
                      {Math.floor((Date.now() - attack.startTime) / 1000)}s
                    </span>
                  </div>
                  <button 
                    onClick={() => onStopAttack(attack.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <StopCircle size={16} />
                    Stop
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  {attack.packetsModified && (
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {attack.packetsModified} modified
                    </span>
                  )}
                  {attack.totalPackets && (
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {attack.totalPackets} packets
                    </span>
                  )}
                  {attack.commandsInjected && (
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {attack.commandsInjected} injected
                    </span>
                  )}
                  {attack.replaysExecuted && (
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {attack.replaysExecuted} replays
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '13px', color: '#7f1d1d', lineHeight: '1.5' }}>
            <strong>Warning:</strong> These attacks can cause critical system failures. Monitor process parameters carefully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttackControl;
