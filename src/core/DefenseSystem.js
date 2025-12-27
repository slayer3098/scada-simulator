import { SYSTEM_CONSTANTS } from '../utils/constants';

/**
 * Defense System
 * Implements multiple security mechanisms to protect SCADA systems
 */
class DefenseSystem {
  constructor() {
    this.defenses = {
      firewall: { enabled: false, rules: [] },
      encryption: { enabled: false, protocol: 'TLS 1.3' },
      authentication: { enabled: false, tokens: new Set() },
      ids: { enabled: false, signatures: [] },
      rateLimit: { enabled: false, maxRequests: 100, window: 60000 }
    };
    
    this.blockedPackets = [];
    this.allowedPackets = [];
    this.rateTracker = new Map();
  }

  /**
   * Enable/disable specific defense
   */
  toggleDefense(defenseType, enabled) {
    if (this.defenses[defenseType]) {
      this.defenses[defenseType].enabled = enabled;
      return {
        success: true,
        defense: defenseType,
        status: enabled ? 'enabled' : 'disabled'
      };
    }
    return { success: false, error: 'Unknown defense type' };
  }

  /**
   * Process packet through defense layers
   */
  processPacket(packet) {
    const result = {
      packet,
      allowed: true,
      blockedBy: [],
      warnings: [],
      timestamp: Date.now()
    };
    
    // Layer 1: Firewall
    if (this.defenses.firewall.enabled) {
      const firewallResult = this.checkFirewall(packet);
      if (!firewallResult.allowed) {
        result.allowed = false;
        result.blockedBy.push('Firewall');
        result.reason = firewallResult.reason;
      }
    }
    
    // Layer 2: Rate Limiting
    if (result.allowed && this.defenses.rateLimit.enabled) {
      const rateLimitResult = this.checkRateLimit(packet);
      if (!rateLimitResult.allowed) {
        result.allowed = false;
        result.blockedBy.push('Rate Limiter');
        result.reason = rateLimitResult.reason;
      }
    }
    
    // Layer 3: Authentication
    if (result.allowed && this.defenses.authentication.enabled) {
      const authResult = this.checkAuthentication(packet);
      if (!authResult.allowed) {
        result.allowed = false;
        result.blockedBy.push('Authentication');
        result.reason = authResult.reason;
      }
    }
    
    // Layer 4: Encryption Check
    if (result.allowed && this.defenses.encryption.enabled) {
      const encryptionResult = this.checkEncryption(packet);
      if (!encryptionResult.allowed) {
        result.allowed = false;
        result.blockedBy.push('Encryption');
        result.reason = encryptionResult.reason;
      }
    }
    
    // Layer 5: Intrusion Detection
    if (result.allowed && this.defenses.ids.enabled) {
      const idsResult = this.checkIDS(packet);
      if (!idsResult.allowed) {
        result.allowed = false;
        result.blockedBy.push('IDS');
        result.reason = idsResult.reason;
      }
      result.warnings.push(...idsResult.warnings);
    }
    
    // Log result
    if (result.allowed) {
      this.allowedPackets.push(result);
    } else {
      this.blockedPackets.push(result);
    }
    
    return result;
  }

  /**
   * Firewall packet filtering
   */
  checkFirewall(packet) {
    const effectiveness = SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.FIREWALL;
    
    // Check if packet has attack flag
    if (packet.attackFlag) {
      // Probabilistic blocking based on effectiveness
      if (Math.random() < effectiveness) {
        return {
          allowed: false,
          reason: 'Suspicious packet signature detected'
        };
      }
    }
    
    // Check source IP whitelist (simplified)
    const trustedIPs = ['192.168.1.10', '192.168.1.11'];
    if (packet.sourceIP && !trustedIPs.includes(packet.sourceIP)) {
      if (Math.random() < effectiveness * 0.8) {
        return {
          allowed: false,
          reason: 'Source IP not in whitelist'
        };
      }
    }
    
    // Check packet size
    if (packet.size > SYSTEM_CONSTANTS.SIMULATION.MAX_PACKET_SIZE) {
      return {
        allowed: false,
        reason: 'Packet size exceeds maximum allowed'
      };
    }
    
    return { allowed: true };
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(packet) {
    const effectiveness = SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.RATE_LIMIT;
    const { maxRequests, window } = this.defenses.rateLimit;
    
    const sourceKey = packet.sourceIP || 'unknown';
    const now = Date.now();
    
    // Get or create tracker for this source
    if (!this.rateTracker.has(sourceKey)) {
      this.rateTracker.set(sourceKey, []);
    }
    
    const requests = this.rateTracker.get(sourceKey);
    
    // Remove old requests outside window
    const validRequests = requests.filter(time => now - time < window);
    this.rateTracker.set(sourceKey, validRequests);
    
    // Check if limit exceeded
    if (validRequests.length >= maxRequests) {
      if (Math.random() < effectiveness) {
        return {
          allowed: false,
          reason: `Rate limit exceeded: ${validRequests.length} requests in ${window/1000}s`
        };
      }
    }
    
    // Add current request
    validRequests.push(now);
    
    return { allowed: true };
  }

  /**
   * Authentication check
   */
  checkAuthentication(packet) {
    const effectiveness = SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.AUTHENTICATION;
    
    // Check for authentication token
    if (!packet.authToken) {
      if (Math.random() < effectiveness) {
        return {
          allowed: false,
          reason: 'Missing authentication token'
        };
      }
    }
    
    // Verify token (simplified)
    if (packet.authToken && !this.defenses.authentication.tokens.has(packet.authToken)) {
      if (Math.random() < effectiveness) {
        return {
          allowed: false,
          reason: 'Invalid authentication token'
        };
      }
    }
    
    // Check for authorization level
    if (packet.functionCode === SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.WRITE_MULTIPLE_REGISTERS) {
      if (!packet.adminPrivilege && Math.random() < effectiveness * 0.9) {
        return {
          allowed: false,
          reason: 'Insufficient privileges for write operation'
        };
      }
    }
    
    return { allowed: true };
  }

  /**
   * Encryption check
   */
  checkEncryption(packet) {
    const effectiveness = SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.ENCRYPTION;
    
    // Check if packet is encrypted
    if (!packet.encrypted) {
      if (Math.random() < effectiveness) {
        return {
          allowed: false,
          reason: 'Unencrypted packet rejected (TLS required)'
        };
      }
    }
    
    // Check encryption protocol version
    if (packet.encrypted && packet.tlsVersion) {
      const validVersions = ['TLS 1.2', 'TLS 1.3'];
      if (!validVersions.includes(packet.tlsVersion)) {
        if (Math.random() < effectiveness * 0.95) {
          return {
            allowed: false,
            reason: 'Outdated TLS version'
          };
        }
      }
    }
    
    return { allowed: true };
  }

  /**
   * Intrusion Detection System
   */
  checkIDS(packet) {
    const effectiveness = SYSTEM_CONSTANTS.DEFENSE_EFFECTIVENESS.IDS;
    const warnings = [];
    
    // Pattern matching for known attack signatures
    if (packet.attackType) {
      if (Math.random() < effectiveness) {
        return {
          allowed: false,
          reason: `Attack pattern detected: ${packet.attackType}`,
          warnings
        };
      }
    }
    
    // Anomaly detection
    const suspiciousAddresses = [0xDEAD, 0xBEEF, 0xBABE, 0xCAFE];
    if (packet.startAddress && suspiciousAddresses.includes(packet.startAddress)) {
      warnings.push('Suspicious memory address');
      if (Math.random() < effectiveness * 0.8) {
        return {
          allowed: false,
          reason: 'Suspicious memory address pattern',
          warnings
        };
      }
    }
    
    // Check for unusual function codes
    if (packet.functionCode > 0x17) {
      warnings.push('Unknown function code');
      if (Math.random() < effectiveness * 0.7) {
        return {
          allowed: false,
          reason: 'Invalid Modbus function code',
          warnings
        };
      }
    }
    
    // Check for rapid write attempts
    if (packet.functionCode === SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.WRITE_MULTIPLE_REGISTERS) {
      if (packet.value > 50) {
        warnings.push('Large batch write operation');
      }
    }
    
    return { allowed: true, warnings };
  }

  /**
   * Get defense statistics
   */
  getStatistics() {
    const totalPackets = this.blockedPackets.length + this.allowedPackets.length;
    const blockRate = totalPackets > 0 ? (this.blockedPackets.length / totalPackets) * 100 : 0;
    
    const blocksByDefense = {};
    this.blockedPackets.forEach(result => {
      result.blockedBy.forEach(defense => {
        blocksByDefense[defense] = (blocksByDefense[defense] || 0) + 1;
      });
    });
    
    return {
      totalProcessed: totalPackets,
      blocked: this.blockedPackets.length,
      allowed: this.allowedPackets.length,
      blockRate: blockRate.toFixed(2),
      blocksByDefense,
      activeDefenses: Object.keys(this.defenses).filter(d => this.defenses[d].enabled)
    };
  }

  /**
   * Get recent blocked packets
   */
  getRecentBlocked(count = 10) {
    return this.blockedPackets.slice(-count);
  }

  /**
   * Clear defense logs
   */
  clearLogs() {
    this.blockedPackets = [];
    this.allowedPackets = [];
    this.rateTracker.clear();
  }

  /**
   * Reset all defenses
   */
  reset() {
    Object.keys(this.defenses).forEach(defense => {
      this.defenses[defense].enabled = false;
    });
    this.clearLogs();
  }

  /**
   * Enable all defenses
   */
  enableAll() {
    Object.keys(this.defenses).forEach(defense => {
      this.defenses[defense].enabled = true;
    });
  }

  /**
   * Get enabled defenses
   */
  getEnabledDefenses() {
    return Object.entries(this.defenses)
      .filter(([_, config]) => config.enabled)
      .map(([name, _]) => name);
  }
}

export default DefenseSystem;