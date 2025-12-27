// System Constants and Configuration

export const SYSTEM_CONSTANTS = {
  // Modbus Protocol
  MODBUS_PORT: 502,
  MODBUS_FUNCTION_CODES: {
    READ_COILS: 0x01,
    READ_DISCRETE_INPUTS: 0x02,
    READ_HOLDING_REGISTERS: 0x03,
    READ_INPUT_REGISTERS: 0x04,
    WRITE_SINGLE_COIL: 0x05,
    WRITE_SINGLE_REGISTER: 0x06,
    WRITE_MULTIPLE_COILS: 0x0F,
    WRITE_MULTIPLE_REGISTERS: 0x10
  },

  // Register Addresses
  REGISTERS: {
    TEMPERATURE: 0x0001,
    PRESSURE: 0x0002,
    FLOW_RATE: 0x0003,
    SAFETY_INTERLOCK: 0x0004,
    PUMP_CONTROL: 0x0005,
    VALVE_POSITION: 0x0006,
    ALARM_STATUS: 0x0007,
    SYSTEM_MODE: 0x0008
  },

  // Safety Limits
  SAFETY_LIMITS: {
    TEMPERATURE_MAX: 100,
    TEMPERATURE_MIN: 20,
    PRESSURE_MAX: 150,
    PRESSURE_MIN: 10,
    FLOW_RATE_MAX: 100,
    FLOW_RATE_MIN: 0
  },

  // Attack Types
  ATTACK_TYPES: {
    MITM: 'Man-in-the-Middle',
    DOS: 'Denial of Service',
    INJECTION: 'Command Injection',
    REPLAY: 'Replay Attack'
  },

  // Defense Mechanisms
  DEFENSE_TYPES: {
    FIREWALL: 'Firewall',
    ENCRYPTION: 'TLS Encryption',
    AUTHENTICATION: 'Authentication',
    IDS: 'Intrusion Detection',
    RATE_LIMIT: 'Rate Limiting'
  },

  // Defense Effectiveness (probability of blocking)
  DEFENSE_EFFECTIVENESS: {
    FIREWALL: 0.70,
    ENCRYPTION: 0.85,
    AUTHENTICATION: 0.80,
    IDS: 0.60,
    RATE_LIMIT: 0.75
  },

  // Simulation Parameters
  SIMULATION: {
    UPDATE_INTERVAL: 1000, // ms
    LOG_RETENTION: 1000, // max log entries
    ANOMALY_THRESHOLD: 75, // score 0-100
    MAX_PACKET_SIZE: 260 // bytes
  }
};

// Alert Severity Levels (exported separately for easier access)
export const ALERT_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical'
};

export const ALERT_COLORS = {
  info: '#3b82f6',
  warning: '#f59e0b',
  critical: '#ef4444'
};

export const STATUS_COLORS = {
  normal: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};