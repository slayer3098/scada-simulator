import { SYSTEM_CONSTANTS } from '../utils/constants';
import { generateId, generateRandomIP, simulateLatency } from '../utils/helpers';
import ModbusProtocol from './ModbusProtocol';

/**
 * Cyber Attack Engine
 * Implements various attack scenarios against SCADA systems
 */
class AttackEngine {
  constructor() {
    this.modbus = new ModbusProtocol();
    this.activeAttacks = new Map();
    this.attackHistory = [];
  }

  /**
   * Launch Man-in-the-Middle (MITM) Attack
   */
  async launchMITM(targetRegister, maliciousValue, intensity = 'medium') {
    const attackId = generateId();
    const attackData = {
      id: attackId,
      type: SYSTEM_CONSTANTS.ATTACK_TYPES.MITM,
      targetRegister,
      maliciousValue,
      intensity,
      startTime: Date.now(),
      status: 'active',
      packetsModified: 0
    };
    
    this.activeAttacks.set(attackId, attackData);
    
    // Simulate network latency
    await simulateLatency(50, 150);
    
    // Create intercepted packet
    const originalPacket = this.modbus.createWriteRequest(targetRegister, 50);
    
    // Modify packet payload
    const modifiedPacket = {
      ...originalPacket,
      value: maliciousValue,
      sourceIP: generateRandomIP(),
      attackFlag: true,
      attackType: 'MITM',
      timestamp: Date.now()
    };
    
    attackData.packetsModified++;
    
    return {
      success: true,
      attackId,
      originalPacket,
      modifiedPacket,
      description: `MITM: Intercepted write to register ${targetRegister}, changed value from 50 to ${maliciousValue}`
    };
  }

  /**
   * Launch Denial of Service (DoS) Attack
   */
  async launchDoS(intensity = 'high') {
    const attackId = generateId();
    const packetsPerSecond = intensity === 'high' ? 1000 : intensity === 'medium' ? 500 : 200;
    
    const attackData = {
      id: attackId,
      type: SYSTEM_CONSTANTS.ATTACK_TYPES.DOS,
      intensity,
      packetsPerSecond,
      startTime: Date.now(),
      status: 'active',
      totalPackets: 0
    };
    
    this.activeAttacks.set(attackId, attackData);
    
    // Generate flood of malformed packets
    const malformedPackets = [];
    const burstSize = intensity === 'high' ? 100 : intensity === 'medium' ? 50 : 20;
    
    for (let i = 0; i < burstSize; i++) {
      const packet = {
        transactionId: Math.floor(Math.random() * 0xFFFF),
        protocolId: Math.random() > 0.5 ? 0 : 0xFF, // Some invalid
        functionCode: Math.floor(Math.random() * 0xFF), // Random, mostly invalid
        startAddress: Math.floor(Math.random() * 0xFFFF),
        value: Math.floor(Math.random() * 0xFFFF),
        sourceIP: generateRandomIP(),
        attackFlag: true,
        attackType: 'DoS',
        timestamp: Date.now(),
        size: Math.floor(Math.random() * 500) + 12
      };
      
      malformedPackets.push(packet);
    }
    
    attackData.totalPackets += burstSize;
    
    return {
      success: true,
      attackId,
      packets: malformedPackets,
      description: `DoS: Flooding network with ${burstSize} malformed packets (${packetsPerSecond} pps)`
    };
  }

  /**
   * Launch Command Injection Attack
   */
  async launchInjection(targetRegister, dangerousValue) {
    const attackId = generateId();
    
    const attackData = {
      id: attackId,
      type: SYSTEM_CONSTANTS.ATTACK_TYPES.INJECTION,
      targetRegister,
      dangerousValue,
      startTime: Date.now(),
      status: 'active',
      commandsInjected: 0
    };
    
    this.activeAttacks.set(attackId, attackData);
    
    await simulateLatency(30, 100);
    
    // Create malicious write command
    const injectionPacket = this.modbus.createWriteRequest(targetRegister, dangerousValue);
    injectionPacket.sourceIP = generateRandomIP();
    injectionPacket.attackFlag = true;
    injectionPacket.attackType = 'Injection';
    injectionPacket.timestamp = Date.now();
    
    // Add payload with dangerous values
    injectionPacket.payload = {
      command: 'WRITE_UNSAFE',
      bypassSafety: true,
      escalatePrivileges: true
    };
    
    attackData.commandsInjected++;
    
    return {
      success: true,
      attackId,
      packet: injectionPacket,
      description: `Injection: Unauthorized write to register ${targetRegister} with value ${dangerousValue} (Safety bypass attempted)`
    };
  }

  /**
   * Launch Replay Attack
   */
  async launchReplay(capturedPacket) {
    const attackId = generateId();
    
    const attackData = {
      id: attackId,
      type: SYSTEM_CONSTANTS.ATTACK_TYPES.REPLAY,
      originalPacket: capturedPacket,
      startTime: Date.now(),
      status: 'active',
      replaysExecuted: 0
    };
    
    this.activeAttacks.set(attackId, attackData);
    
    await simulateLatency(20, 80);
    
    // Replay the captured packet with new timestamp
    const replayPacket = {
      ...capturedPacket,
      transactionId: this.modbus.transactionId++,
      timestamp: Date.now(),
      sourceIP: generateRandomIP(),
      attackFlag: true,
      attackType: 'Replay',
      replayedFrom: capturedPacket.timestamp
    };
    
    attackData.replaysExecuted++;
    
    return {
      success: true,
      attackId,
      originalPacket: capturedPacket,
      replayPacket,
      description: `Replay: Re-transmitting captured packet from ${new Date(capturedPacket.timestamp).toLocaleTimeString()}`
    };
  }

  /**
   * Stop specific attack
   */
  stopAttack(attackId) {
    const attack = this.activeAttacks.get(attackId);
    if (attack) {
      attack.status = 'stopped';
      attack.endTime = Date.now();
      attack.duration = attack.endTime - attack.startTime;
      
      // Move to history
      this.attackHistory.push(attack);
      this.activeAttacks.delete(attackId);
      
      return {
        success: true,
        attack,
        message: `Attack ${attackId} stopped after ${(attack.duration / 1000).toFixed(2)}s`
      };
    }
    
    return {
      success: false,
      message: 'Attack not found'
    };
  }

  /**
   * Stop all active attacks
   */
  stopAllAttacks() {
    const stoppedAttacks = [];
    
    this.activeAttacks.forEach((attack, attackId) => {
      const result = this.stopAttack(attackId);
      if (result.success) {
        stoppedAttacks.push(result.attack);
      }
    });
    
    return {
      success: true,
      count: stoppedAttacks.length,
      attacks: stoppedAttacks
    };
  }

  /**
   * Get active attacks
   */
  getActiveAttacks() {
    return Array.from(this.activeAttacks.values());
  }

  /**
   * Get attack history
   */
  getAttackHistory() {
    return this.attackHistory;
  }

  /**
   * Get attack statistics
   */
  getStatistics() {
    const stats = {
      totalAttacks: this.attackHistory.length + this.activeAttacks.size,
      activeAttacks: this.activeAttacks.size,
      attacksByType: {},
      averageDuration: 0
    };
    
    // Count by type
    const allAttacks = [...this.attackHistory, ...this.activeAttacks.values()];
    allAttacks.forEach(attack => {
      stats.attacksByType[attack.type] = (stats.attacksByType[attack.type] || 0) + 1;
    });
    
    // Calculate average duration
    const completedAttacks = this.attackHistory.filter(a => a.duration);
    if (completedAttacks.length > 0) {
      const totalDuration = completedAttacks.reduce((sum, a) => sum + a.duration, 0);
      stats.averageDuration = totalDuration / completedAttacks.length;
    }
    
    return stats;
  }

  /**
   * Reset attack engine
   */
  reset() {
    this.activeAttacks.clear();
    this.attackHistory = [];
  }
}

export default AttackEngine;