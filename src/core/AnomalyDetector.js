import { SYSTEM_CONSTANTS } from '../utils/constants';
import { movingAverage } from '../utils/helpers';

/**
 * Anomaly Detection System
 * Uses pattern recognition and statistical analysis to detect suspicious activity
 */
class AnomalyDetector {
  constructor() {
    this.baseline = {
      packetRate: 0,
      avgPacketSize: 0,
      functionCodeDistribution: {},
      addressAccessPattern: {}
    };
    
    this.history = {
      packetRates: [],
      packetSizes: [],
      timestamps: []
    };
    
    this.anomalies = [];
    this.isLearning = true;
    this.learningPeriod = 30000; // 30 seconds
    this.learningStartTime = Date.now();
  }

  /**
   * Analyze packet for anomalies
   */
  analyzePacket(packet) {
    const now = Date.now();
    const anomalyScore = {
      total: 0,
      components: {}
    };

    // Update history
    this.updateHistory(packet, now);

    // Skip detection during learning period
    if (this.isLearning) {
      if (now - this.learningStartTime > this.learningPeriod) {
        this.isLearning = false;
        this.establishBaseline();
      }
      return { isAnomaly: false, score: 0, details: ['Learning mode active'] };
    }

    // Component 1: Packet rate deviation (30% weight)
    const rateScore = this.analyzePacketRate();
    anomalyScore.components.rate = rateScore;
    anomalyScore.total += rateScore * 0.30;

    // Component 2: Pattern matching (40% weight)
    const patternScore = this.analyzePattern(packet);
    anomalyScore.components.pattern = patternScore;
    anomalyScore.total += patternScore * 0.40;

    // Component 3: Timing analysis (20% weight)
    const timingScore = this.analyzeTimingAnomaly();
    anomalyScore.components.timing = timingScore;
    anomalyScore.total += timingScore * 0.20;

    // Component 4: Behavioral analysis (10% weight)
    const behaviorScore = this.analyzeBehavior(packet);
    anomalyScore.components.behavior = behaviorScore;
    anomalyScore.total += behaviorScore * 0.10;

    // Determine if anomaly
    const threshold = SYSTEM_CONSTANTS.SIMULATION.ANOMALY_THRESHOLD;
    const isAnomaly = anomalyScore.total > threshold;

    if (isAnomaly) {
      const anomaly = {
        timestamp: now,
        packet,
        score: anomalyScore.total,
        components: anomalyScore.components,
        severity: this.calculateSeverity(anomalyScore.total)
      };
      this.anomalies.push(anomaly);
    }

    return {
      isAnomaly,
      score: Math.round(anomalyScore.total),
      components: anomalyScore.components,
      details: this.generateAnomalyDetails(anomalyScore)
    };
  }

  /**
   * Update packet history
   */
  updateHistory(packet, timestamp) {
    this.history.timestamps.push(timestamp);
    this.history.packetSizes.push(packet.size || 12);

    // Calculate current packet rate
    const recentWindow = 10000; // 10 seconds
    const recentPackets = this.history.timestamps.filter(
      t => timestamp - t < recentWindow
    );
    const currentRate = recentPackets.length / (recentWindow / 1000);
    this.history.packetRates.push(currentRate);

    // Limit history size
    const maxHistory = 1000;
    if (this.history.timestamps.length > maxHistory) {
      this.history.timestamps = this.history.timestamps.slice(-maxHistory);
      this.history.packetSizes = this.history.packetSizes.slice(-maxHistory);
      this.history.packetRates = this.history.packetRates.slice(-maxHistory);
    }

    // Update function code distribution
    if (packet.functionCode) {
      const code = packet.functionCode;
      this.baseline.functionCodeDistribution[code] = 
        (this.baseline.functionCodeDistribution[code] || 0) + 1;
    }

    // Update address access pattern
    if (packet.startAddress) {
      const addr = packet.startAddress;
      this.baseline.addressAccessPattern[addr] = 
        (this.baseline.addressAccessPattern[addr] || 0) + 1;
    }
  }

  /**
   * Establish baseline during learning period
   */
  establishBaseline() {
    // Calculate baseline packet rate
    if (this.history.packetRates.length > 0) {
      const sum = this.history.packetRates.reduce((a, b) => a + b, 0);
      this.baseline.packetRate = sum / this.history.packetRates.length;
    }

    // Calculate baseline packet size
    if (this.history.packetSizes.length > 0) {
      const sum = this.history.packetSizes.reduce((a, b) => a + b, 0);
      this.baseline.avgPacketSize = sum / this.history.packetSizes.length;
    }

    console.log('Baseline established:', this.baseline);
  }

  /**
   * Analyze packet rate deviation
   */
  analyzePacketRate() {
    if (this.history.packetRates.length < 5) return 0;

    const currentRate = this.history.packetRates[this.history.packetRates.length - 1];
    const baselineRate = this.baseline.packetRate;

    if (baselineRate === 0) return 0;

    // Calculate deviation percentage
    const deviation = Math.abs(currentRate - baselineRate) / baselineRate;

    // Score based on deviation
    if (deviation > 5.0) return 100; // 500% deviation
    if (deviation > 3.0) return 90;  // 300% deviation
    if (deviation > 2.0) return 75;  // 200% deviation
    if (deviation > 1.0) return 50;  // 100% deviation
    if (deviation > 0.5) return 25;  // 50% deviation

    return 0;
  }

  /**
   * Analyze suspicious patterns
   */
  analyzePattern(packet) {
    let score = 0;

    // Check for attack flag
    if (packet.attackFlag) {
      score += 80;
    }

    // Check for suspicious addresses
    const suspiciousAddresses = [0xDEAD, 0xBEEF, 0xBABE, 0xCAFE];
    if (packet.startAddress && suspiciousAddresses.includes(packet.startAddress)) {
      score += 70;
    }

    // Check for invalid function codes
    if (packet.functionCode && packet.functionCode > 0x17) {
      score += 60;
    }

    // Check for unusual protocol ID
    if (packet.protocolId && packet.protocolId !== 0) {
      score += 50;
    }

    // Check for oversized packets
    if (packet.size > 200) {
      score += 40;
    }

    // Check for rare function codes
    const totalAccess = Object.values(this.baseline.functionCodeDistribution)
      .reduce((sum, count) => sum + count, 0);
    if (packet.functionCode && totalAccess > 100) {
      const codeFrequency = (this.baseline.functionCodeDistribution[packet.functionCode] || 0) / totalAccess;
      if (codeFrequency < 0.05) { // Less than 5% of traffic
        score += 30;
      }
    }

    return Math.min(100, score);
  }

  /**
   * Analyze timing anomalies
   */
  analyzeTimingAnomaly() {
    if (this.history.timestamps.length < 10) return 0;

    const recentTimestamps = this.history.timestamps.slice(-10);
    const intervals = [];

    for (let i = 1; i < recentTimestamps.length; i++) {
      intervals.push(recentTimestamps[i] - recentTimestamps[i - 1]);
    }

    // Calculate mean and standard deviation
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // Check for regular timing (sign of automated attack)
    if (stdDev < 5 && mean < 100) {
      return 80; // Very regular timing suggests automated tool
    }

    // Check for burst pattern
    const veryShortIntervals = intervals.filter(i => i < 10).length;
    if (veryShortIntervals > 5) {
      return 70; // Burst of rapid packets
    }

    return 0;
  }

  /**
   * Analyze behavioral patterns
   */
  analyzeBehavior(packet) {
    let score = 0;

    // Check for write operations to critical registers
    const criticalRegisters = [
      SYSTEM_CONSTANTS.REGISTERS.SAFETY_INTERLOCK,
      SYSTEM_CONSTANTS.REGISTERS.PUMP_CONTROL,
      SYSTEM_CONSTANTS.REGISTERS.ALARM_STATUS
    ];

    if (packet.startAddress && criticalRegisters.includes(packet.startAddress)) {
      const isWriteOperation = [0x05, 0x06, 0x0F, 0x10].includes(packet.functionCode);
      if (isWriteOperation) {
        score += 60;
      }
    }

    // Check for sequential scanning (common in reconnaissance)
    if (this.history.timestamps.length > 5) {
      const recentAddresses = this.history.timestamps
        .slice(-5)
        .map((_, idx) => this.baseline.addressAccessPattern);
      // Simplified check - in real implementation, would check for sequential patterns
    }

    // Check for multiple write operations
    const recentWrites = this.history.timestamps.slice(-10).filter((_, idx) => {
      // This is simplified - would track actual operations
      return Math.random() > 0.7;
    });

    if (recentWrites.length > 7) {
      score += 40;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate severity level
   */
  calculateSeverity(score) {
    if (score >= 90) return 'critical';
    if (score >= 75) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  /**
   * Generate detailed anomaly description
   */
  generateAnomalyDetails(anomalyScore) {
    const details = [];

    if (anomalyScore.components.rate > 50) {
      details.push(`Abnormal packet rate detected (score: ${Math.round(anomalyScore.components.rate)})`);
    }

    if (anomalyScore.components.pattern > 50) {
      details.push(`Suspicious pattern identified (score: ${Math.round(anomalyScore.components.pattern)})`);
    }

    if (anomalyScore.components.timing > 50) {
      details.push(`Timing anomaly detected (score: ${Math.round(anomalyScore.components.timing)})`);
    }

    if (anomalyScore.components.behavior > 50) {
      details.push(`Unusual behavior pattern (score: ${Math.round(anomalyScore.components.behavior)})`);
    }

    if (details.length === 0) {
      details.push('Minor anomaly detected');
    }

    return details;
  }

  /**
   * Get anomaly statistics
   */
  getStatistics() {
    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    this.anomalies.forEach(anomaly => {
      severityCounts[anomaly.severity]++;
    });

    return {
      totalAnomalies: this.anomalies.length,
      severityCounts,
      isLearning: this.isLearning,
      baseline: this.baseline,
      recentAnomalies: this.anomalies.slice(-10)
    };
  }

  /**
   * Get recent anomalies
   */
  getRecentAnomalies(count = 5) {
    return this.anomalies.slice(-count);
  }

  /**
   * Reset detector
   */
  reset() {
    this.baseline = {
      packetRate: 0,
      avgPacketSize: 0,
      functionCodeDistribution: {},
      addressAccessPattern: {}
    };
    
    this.history = {
      packetRates: [],
      packetSizes: [],
      timestamps: []
    };
    
    this.anomalies = [];
    this.isLearning = true;
    this.learningStartTime = Date.now();
  }

  /**
   * Force learning mode completion
   */
  completeLearning() {
    this.isLearning = false;
    this.establishBaseline();
  }
}

export default AnomalyDetector;