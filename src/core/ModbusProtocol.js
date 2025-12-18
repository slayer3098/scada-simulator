import { SYSTEM_CONSTANTS } from '../utils/constants';
import { generateTransactionId, toHex, calculateChecksum, isValidFunctionCode } from '../utils/helpers';

/**
 * Modbus TCP/IP Protocol Handler
 * Implements Modbus protocol packet generation and parsing
 */
class ModbusProtocol {
  constructor() {
    this.transactionId = 0;
    this.protocolId = 0; // Modbus TCP
    this.unitId = 1; // Device ID
  }

  /**
   * Generate Modbus TCP packet
   */
  generatePacket(functionCode, address, value) {
    this.transactionId = generateTransactionId();
    
    const packet = {
      transactionId: this.transactionId,
      protocolId: this.protocolId,
      length: 6, // Remaining bytes
      unitId: this.unitId,
      functionCode: functionCode,
      startAddress: address,
      value: value,
      timestamp: Date.now(),
      size: 12 // MBAP header (7 bytes) + PDU (5 bytes)
    };
    
    // Add checksum (simplified CRC)
    packet.checksum = this.calculatePacketChecksum(packet);
    
    return packet;
  }

  /**
   * Create READ request packet
   */
  createReadRequest(address, count = 1) {
    return this.generatePacket(
      SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.READ_HOLDING_REGISTERS,
      address,
      count
    );
  }

  /**
   * Create WRITE request packet
   */
  createWriteRequest(address, value) {
    return this.generatePacket(
      SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.WRITE_SINGLE_REGISTER,
      address,
      value
    );
  }

  /**
   * Create WRITE MULTIPLE request packet
   */
  createWriteMultipleRequest(address, values) {
    const packet = this.generatePacket(
      SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.WRITE_MULTIPLE_REGISTERS,
      address,
      values.length
    );
    packet.values = values;
    packet.size += values.length * 2; // 2 bytes per register
    return packet;
  }

  /**
   * Generate response packet
   */
  generateResponse(request, data) {
    const response = {
      transactionId: request.transactionId,
      protocolId: request.protocolId,
      length: 3 + (Array.isArray(data) ? data.length * 2 : 2),
      unitId: request.unitId,
      functionCode: request.functionCode,
      byteCount: Array.isArray(data) ? data.length * 2 : 2,
      data: data,
      timestamp: Date.now(),
      size: 9 + (Array.isArray(data) ? data.length * 2 : 2)
    };
    
    response.checksum = this.calculatePacketChecksum(response);
    
    return response;
  }

  /**
   * Generate error response
   */
  generateErrorResponse(request, exceptionCode) {
    return {
      transactionId: request.transactionId,
      protocolId: request.protocolId,
      length: 3,
      unitId: request.unitId,
      functionCode: request.functionCode | 0x80, // Set error bit
      exceptionCode: exceptionCode,
      timestamp: Date.now(),
      size: 9
    };
  }

  /**
   * Validate packet structure
   */
  validatePacket(packet) {
    if (!packet || typeof packet !== 'object') {
      return { valid: false, error: 'Invalid packet structure' };
    }
    
    // Check protocol ID
    if (packet.protocolId !== 0) {
      return { valid: false, error: 'Invalid protocol ID' };
    }
    
    // Check function code
    if (!isValidFunctionCode(packet.functionCode)) {
      return { valid: false, error: 'Invalid function code' };
    }
    
    // Check packet size
    if (packet.size > SYSTEM_CONSTANTS.SIMULATION.MAX_PACKET_SIZE) {
      return { valid: false, error: 'Packet size exceeds maximum' };
    }
    
    // Verify checksum (if present)
    if (packet.checksum) {
      const calculatedChecksum = this.calculatePacketChecksum(packet);
      if (packet.checksum !== calculatedChecksum) {
        return { valid: false, error: 'Checksum mismatch' };
      }
    }
    
    return { valid: true };
  }

  /**
   * Calculate packet checksum (simplified)
   */
  calculatePacketChecksum(packet) {
    const data = JSON.stringify({
      transactionId: packet.transactionId,
      functionCode: packet.functionCode,
      startAddress: packet.startAddress,
      value: packet.value
    });
    return calculateChecksum(data);
  }

  /**
   * Format packet for display
   */
  formatPacketForDisplay(packet) {
    const parts = [];
    
    parts.push(`TxID: ${toHex(packet.transactionId, 4)}`);
    parts.push(`Proto: ${toHex(packet.protocolId, 4)}`);
    parts.push(`Unit: ${packet.unitId}`);
    parts.push(`Func: ${toHex(packet.functionCode, 2)}`);
    
    if (packet.startAddress !== undefined) {
      parts.push(`Addr: ${toHex(packet.startAddress, 4)}`);
    }
    
    if (packet.value !== undefined) {
      parts.push(`Val: ${packet.value}`);
    }
    
    if (packet.data !== undefined) {
      parts.push(`Data: ${JSON.stringify(packet.data)}`);
    }
    
    return parts.join(' | ');
  }

  /**
   * Parse raw packet data (simplified simulation)
   */
  parsePacket(rawData) {
    // In real implementation, this would parse binary data
    // For simulation, we work with objects directly
    return rawData;
  }

  /**
   * Detect suspicious patterns in packet
   */
  detectSuspiciousPattern(packet) {
    const suspiciousPatterns = [];
    
    // Check for suspicious addresses
    const suspiciousAddresses = [0xDEAD, 0xBEEF, 0xBABE, 0xCAFE];
    if (suspiciousAddresses.includes(packet.startAddress)) {
      suspiciousPatterns.push('Suspicious memory address');
    }
    
    // Check for unusual function codes
    if (packet.functionCode > 0x17) {
      suspiciousPatterns.push('Unknown function code');
    }
    
    // Check for large write operations
    if (packet.functionCode === SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.WRITE_MULTIPLE_REGISTERS) {
      if (packet.value > 100) {
        suspiciousPatterns.push('Large batch write operation');
      }
    }
    
    return suspiciousPatterns;
  }

  /**
   * Get function code name
   */
  getFunctionCodeName(code) {
    const codes = SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES;
    const codeMap = {
      [codes.READ_COILS]: 'Read Coils',
      [codes.READ_DISCRETE_INPUTS]: 'Read Discrete Inputs',
      [codes.READ_HOLDING_REGISTERS]: 'Read Holding Registers',
      [codes.READ_INPUT_REGISTERS]: 'Read Input Registers',
      [codes.WRITE_SINGLE_COIL]: 'Write Single Coil',
      [codes.WRITE_SINGLE_REGISTER]: 'Write Single Register',
      [codes.WRITE_MULTIPLE_COILS]: 'Write Multiple Coils',
      [codes.WRITE_MULTIPLE_REGISTERS]: 'Write Multiple Registers'
    };
    
    return codeMap[code] || `Unknown (${toHex(code, 2)})`;
  }
}

export default ModbusProtocol;