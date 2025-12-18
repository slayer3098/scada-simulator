import { SYSTEM_CONSTANTS } from '../utils/constants';
import { addNoise, isWithinLimits } from '../utils/helpers';

/**
 * Industrial Process Simulator
 * Simulates realistic SCADA process behavior with physics-based calculations
 */
class ProcessSimulator {
  constructor() {
    this.state = {
      temperature: 50.0,
      pressure: 80.0,
      flowRate: 50.0,
      pumpStatus: true,
      valvePosition: 50,
      safetyInterlock: true,
      alarmActive: false,
      systemMode: 'AUTO'
    };

    this.history = {
      temperature: [],
      pressure: [],
      flowRate: []
    };

    this.maxHistoryLength = 50;
    this.targetValues = {
      temperature: 50.0,
      pressure: 80.0,
      flowRate: 50.0
    };
  }

  /**
   * Update process state (called every simulation tick)
   */
  update(deltaTime = 1.0) {
    // Update temperature with thermal dynamics
    this.updateTemperature(deltaTime);
    
    // Update pressure based on pump and valve
    this.updatePressure(deltaTime);
    
    // Update flow rate based on valve position
    this.updateFlowRate(deltaTime);
    
    // Check safety limits
    this.checkSafetyLimits();
    
    // Update history for graphs
    this.updateHistory();
    
    return this.getState();
  }

  /**
   * Temperature dynamics with first-order response
   */
  updateTemperature(deltaTime) {
    const { TEMPERATURE_MAX, TEMPERATURE_MIN } = SYSTEM_CONSTANTS.SAFETY_LIMITS;
    
    // Heat gain from pump operation
    const heatGain = this.state.pumpStatus ? 2.0 : 0;
    
    // Heat loss from environment
    const ambientTemp = 25.0;
    const heatLoss = (this.state.temperature - ambientTemp) * 0.05;
    
    // First-order dynamics
    const tau = 10.0; // time constant
    const delta = ((this.targetValues.temperature - this.state.temperature) / tau) 
                  + heatGain - heatLoss;
    
    this.state.temperature += delta * deltaTime;
    
    // Add sensor noise
    this.state.temperature = addNoise(this.state.temperature, 0.3);
    
    // Clamp to physical limits
    this.state.temperature = Math.max(TEMPERATURE_MIN, 
                                     Math.min(TEMPERATURE_MAX, this.state.temperature));
  }

  /**
   * Pressure dynamics based on pump and valve
   */
  updatePressure(deltaTime) {
    const { PRESSURE_MAX, PRESSURE_MIN } = SYSTEM_CONSTANTS.SAFETY_LIMITS;
    
    // Pressure increase from pump
    const pumpPressure = this.state.pumpStatus ? 5.0 : -3.0;
    
    // Pressure decrease from valve opening
    const valveRelief = (this.state.valvePosition / 100) * 2.0;
    
    // Update pressure
    const delta = pumpPressure - valveRelief;
    this.state.pressure += delta * deltaTime;
    
    // Add sensor noise
    this.state.pressure = addNoise(this.state.pressure, 0.5);
    
    // Clamp to physical limits
    this.state.pressure = Math.max(PRESSURE_MIN, 
                                   Math.min(PRESSURE_MAX, this.state.pressure));
  }

  /**
   * Flow rate based on valve position and pressure
   */
  updateFlowRate(deltaTime) {
    const { FLOW_RATE_MAX, FLOW_RATE_MIN } = SYSTEM_CONSTANTS.SAFETY_LIMITS;
    
    // Flow rate proportional to valve opening and pressure
    const targetFlow = (this.state.valvePosition / 100) * 
                       Math.sqrt(this.state.pressure / 100) * 100;
    
    // First-order dynamics
    const tau = 5.0;
    const delta = (targetFlow - this.state.flowRate) / tau;
    
    this.state.flowRate += delta * deltaTime;
    
    // Add sensor noise
    this.state.flowRate = addNoise(this.state.flowRate, 0.4);
    
    // Clamp to physical limits
    this.state.flowRate = Math.max(FLOW_RATE_MIN, 
                                   Math.min(FLOW_RATE_MAX, this.state.flowRate));
  }

  /**
   * Check if process is within safe operating limits
   */
  checkSafetyLimits() {
    const { TEMPERATURE_MAX, PRESSURE_MAX, FLOW_RATE_MAX } = SYSTEM_CONSTANTS.SAFETY_LIMITS;
    const { TEMPERATURE_MIN, PRESSURE_MIN } = SYSTEM_CONSTANTS.SAFETY_LIMITS;
    
    let alarmConditions = [];
    
    // Temperature checks
    if (!isWithinLimits(this.state.temperature, TEMPERATURE_MIN, TEMPERATURE_MAX)) {
      alarmConditions.push('TEMPERATURE_ALARM');
    }
    
    // Pressure checks
    if (!isWithinLimits(this.state.pressure, PRESSURE_MIN, PRESSURE_MAX)) {
      alarmConditions.push('PRESSURE_ALARM');
    }
    
    // Flow rate checks
    if (this.state.flowRate > FLOW_RATE_MAX) {
      alarmConditions.push('FLOW_ALARM');
    }
    
    // Update alarm status
    this.state.alarmActive = alarmConditions.length > 0;
    
    // Safety interlock: shutdown if critical
    if (this.state.temperature > TEMPERATURE_MAX * 0.95 || 
        this.state.pressure > PRESSURE_MAX * 0.95) {
      this.state.safetyInterlock = false;
      this.state.pumpStatus = false;
    }
  }

  /**
   * Update historical data for charting
   */
  updateHistory() {
    this.history.temperature.push(this.state.temperature);
    this.history.pressure.push(this.state.pressure);
    this.history.flowRate.push(this.state.flowRate);
    
    // Limit history length
    if (this.history.temperature.length > this.maxHistoryLength) {
      this.history.temperature.shift();
      this.history.pressure.shift();
      this.history.flowRate.shift();
    }
  }

  /**
   * Write to register (from Modbus commands)
   */
  writeRegister(address, value) {
    const { REGISTERS } = SYSTEM_CONSTANTS;
    
    switch(address) {
      case REGISTERS.TEMPERATURE:
        this.targetValues.temperature = value;
        break;
      case REGISTERS.PRESSURE:
        this.targetValues.pressure = value;
        break;
      case REGISTERS.FLOW_RATE:
        this.targetValues.flowRate = value;
        break;
      case REGISTERS.PUMP_CONTROL:
        this.state.pumpStatus = value > 0;
        break;
      case REGISTERS.VALVE_POSITION:
        this.state.valvePosition = Math.max(0, Math.min(100, value));
        break;
      case REGISTERS.SAFETY_INTERLOCK:
        this.state.safetyInterlock = value > 0;
        break;
      case REGISTERS.SYSTEM_MODE:
        this.state.systemMode = value === 1 ? 'AUTO' : 'MANUAL';
        break;
      default:
        break;
    }
  }

  /**
   * Read from register (for Modbus commands)
   */
  readRegister(address) {
    const { REGISTERS } = SYSTEM_CONSTANTS;
    
    switch(address) {
      case REGISTERS.TEMPERATURE:
        return Math.round(this.state.temperature * 10) / 10;
      case REGISTERS.PRESSURE:
        return Math.round(this.state.pressure * 10) / 10;
      case REGISTERS.FLOW_RATE:
        return Math.round(this.state.flowRate * 10) / 10;
      case REGISTERS.PUMP_CONTROL:
        return this.state.pumpStatus ? 1 : 0;
      case REGISTERS.VALVE_POSITION:
        return this.state.valvePosition;
      case REGISTERS.SAFETY_INTERLOCK:
        return this.state.safetyInterlock ? 1 : 0;
      case REGISTERS.ALARM_STATUS:
        return this.state.alarmActive ? 1 : 0;
      case REGISTERS.SYSTEM_MODE:
        return this.state.systemMode === 'AUTO' ? 1 : 0;
      default:
        return 0;
    }
  }

  /**
   * Get current process state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Get process history
   */
  getHistory() {
    return { ...this.history };
  }

  /**
   * Reset process to initial state
   */
  reset() {
    this.state = {
      temperature: 50.0,
      pressure: 80.0,
      flowRate: 50.0,
      pumpStatus: true,
      valvePosition: 50,
      safetyInterlock: true,
      alarmActive: false,
      systemMode: 'AUTO'
    };
    
    this.history = {
      temperature: [],
      pressure: [],
      flowRate: []
    };
  }
}

export default ProcessSimulator;