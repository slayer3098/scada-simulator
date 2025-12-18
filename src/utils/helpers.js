// Utility Helper Functions

/**
 * Generate unique ID for packets and events
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format timestamp to readable string
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

/**
 * Convert number to hex string
 */
export const toHex = (num, padding = 4) => {
  return '0x' + num.toString(16).toUpperCase().padStart(padding, '0');
};

/**
 * Calculate checksum for Modbus packet (simplified CRC)
 */
export const calculateChecksum = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum = (sum + data.charCodeAt(i)) & 0xFFFF;
  }
  return sum;
};

/**
 * Add gaussian noise to simulate sensor readings
 */
export const addNoise = (value, stdDev = 0.5) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const noise = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return value + noise * stdDev;
};

/**
 * Check if value is within safe limits
 */
export const isWithinLimits = (value, min, max) => {
  return value >= min && value <= max;
};

/**
 * Calculate moving average
 */
export const movingAverage = (dataArray, windowSize = 5) => {
  if (dataArray.length < windowSize) return dataArray[dataArray.length - 1] || 0;
  
  const slice = dataArray.slice(-windowSize);
  return slice.reduce((sum, val) => sum + val, 0) / windowSize;
};

/**
 * Generate random IP address
 */
export const generateRandomIP = () => {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

/**
 * Simulate network latency
 */
export const simulateLatency = async (min = 10, max = 50) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str, maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate random Modbus transaction ID
 */
export const generateTransactionId = () => {
  return Math.floor(Math.random() * 0xFFFF);
};

/**
 * Validate Modbus function code
 */
export const isValidFunctionCode = (code) => {
  const validCodes = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x0F, 0x10];
  return validCodes.includes(code);
};