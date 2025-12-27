import React, { useState } from 'react';
import { Network, Activity, Filter, Search } from 'lucide-react';
import { formatTimestamp, toHex } from '../utils/helpers';

const NetworkMonitor = ({ networkTraffic, isRunning }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredTraffic = () => {
    let filtered = [...networkTraffic].reverse();
    if (filter === 'attacks') {
      filtered = filtered.filter(packet => packet.attackFlag);
    } else if (filter === 'normal') {
      filtered = filtered.filter(packet => !packet.attackFlag);
    }
    if (searchTerm) {
      filtered = filtered.filter(packet => 
        JSON.stringify(packet).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered.slice(0, 50);
  };

  const getFunctionCodeName = (code) => {
    const codes = {
      0x03: 'Read Holding',
      0x06: 'Write Single',
      0x10: 'Write Multiple'
    };
    return codes[code] || `FC ${toHex(code, 2)}`;
  };

  const filteredTraffic = getFilteredTraffic();
  const attackCount = networkTraffic.filter(p => p.attackFlag).length;
  const normalCount = networkTraffic.length - attackCount;

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
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '10px'
          }}>
            <Network size={20} color="#ffffff" />
          </div>
          Network Traffic Monitor
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            padding: '6px 12px',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {normalCount} Normal
          </span>
          <span style={{
            padding: '6px 12px',
            background: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {attackCount} Attacks
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'attacks', 'normal'].map(f => (
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
              {f === 'all' ? 'All Traffic' : f === 'attacks' ? 'Attacks Only' : 'Normal Only'}
            </button>
          ))}
        </div>

        <div style={{
          flex: 1,
          minWidth: '200px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: '#ffffff',
          border: '2px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <Search size={16} color="#6b7280" />
          <input
            type="text"
            placeholder="Search packets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#111827'
            }}
          />
        </div>
      </div>

      <div style={{
        maxHeight: '600px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {!isRunning && networkTraffic.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af'
          }}>
            <Network size={48} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>No network traffic yet</p>
            <span style={{ fontSize: '14px' }}>Start the simulation to see Modbus packets</span>
          </div>
        )}

        {filteredTraffic.length === 0 && networkTraffic.length > 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af'
          }}>
            <Filter size={48} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>No packets match filter</p>
          </div>
        )}

        {filteredTraffic.map(packet => (
          <div 
            key={packet.id || packet.timestamp}
            style={{
              padding: '16px',
              background: packet.attackFlag ? '#fef2f2' : '#f9fafb',
              border: `2px solid ${packet.attackFlag ? '#fecaca' : '#e5e7eb'}`,
              borderRadius: '12px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {formatTimestamp(packet.timestamp)}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {packet.attackFlag && (
                  <span style={{
                    padding: '4px 8px',
                    background: '#dc2626',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {packet.attackType}
                  </span>
                )}
                <span style={{
                  padding: '4px 8px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {getFunctionCodeName(packet.functionCode)}
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px'
            }}>
              <div>
                <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  Transaction ID:
                </label>
                <code style={{ fontSize: '13px', color: '#111827', fontWeight: '600' }}>
                  {toHex(packet.transactionId, 4)}
                </code>
              </div>
              {packet.startAddress !== undefined && (
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Address:
                  </label>
                  <code style={{ fontSize: '13px', color: '#111827', fontWeight: '600' }}>
                    {toHex(packet.startAddress, 4)}
                  </code>
                </div>
              )}
              {packet.value !== undefined && (
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Value:
                  </label>
                  <code style={{ fontSize: '13px', color: '#111827', fontWeight: '600' }}>
                    {packet.value}
                  </code>
                </div>
              )}
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
          Showing {filteredTraffic.length} of {networkTraffic.length} packets
        </span>
        {isRunning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>Live</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkMonitor;
