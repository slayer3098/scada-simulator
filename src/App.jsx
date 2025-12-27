import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import ProcessMonitor from './components/ProcessMonitor';
import AttackControl from './components/AttackControl';
import DefenseControl from './components/DefenseControl';
import NetworkMonitor from './components/NetworkMonitor';
import SecurityLogs from './components/SecurityLogs';
import MetricsPanel from './components/MetricsPanel';

import ProcessSimulator from './core/ProcessSimulator';
import ModbusProtocol from './core/ModbusProtocol';
import AttackEngine from './core/AttackEngine';
import DefenseSystem from './core/DefenseSystem';
import AnomalyDetector from './core/AnomalyDetector';

import { SYSTEM_CONSTANTS, ALERT_LEVELS } from './utils/constants';
import { generateId } from './utils/helpers';

function App() {
  // Core system instances
  const processSimulator = useRef(new ProcessSimulator());
  const modbusProtocol = useRef(new ModbusProtocol());
  const attackEngine = useRef(new AttackEngine());
  const defenseSystem = useRef(new DefenseSystem());
  const anomalyDetector = useRef(new AnomalyDetector());

  // State management
  const [isRunning, setIsRunning] = useState(false);
  const [processState, setProcessState] = useState({});
  const [processHistory, setProcessHistory] = useState({});
  const [networkTraffic, setNetworkTraffic] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [activeAttacks, setActiveAttacks] = useState([]);
  const [defenseStatus, setDefenseStatus] = useState({});
  const [metrics, setMetrics] = useState({
    totalPackets: 0,
    blockedPackets: 0,
    attacksDetected: 0,
    systemHealth: 100
  });

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Update process simulation
      const newState = processSimulator.current.update(1.0);
      setProcessState(newState);
      
      const history = processSimulator.current.getHistory();
      setProcessHistory(history);

      // Update metrics
      updateMetrics();
    }, SYSTEM_CONSTANTS.SIMULATION.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isRunning]);

  /**
   * Start simulation
   */
  const handleStart = () => {
    setIsRunning(true);
    addLog('System started', ALERT_LEVELS.INFO);
  };

  /**
   * Stop simulation
   */
  const handleStop = () => {
    setIsRunning(false);
    addLog('System stopped', ALERT_LEVELS.INFO);
  };

  /**
   * Reset entire system
   */
  const handleReset = () => {
    setIsRunning(false);
    processSimulator.current.reset();
    attackEngine.current.reset();
    defenseSystem.current.reset();
    anomalyDetector.current.reset();
    
    setProcessState({});
    setProcessHistory({});
    setNetworkTraffic([]);
    setSecurityLogs([]);
    setActiveAttacks([]);
    setMetrics({
      totalPackets: 0,
      blockedPackets: 0,
      attacksDetected: 0,
      systemHealth: 100
    });
    
    addLog('System reset to initial state', ALERT_LEVELS.INFO);
  };

  /**
   * Launch attack
   */
  const handleLaunchAttack = async (attackType, params) => {
    let result;
    
    try {
      switch (attackType) {
        case 'MITM':
          result = await attackEngine.current.launchMITM(
            params.targetRegister,
            params.maliciousValue,
            params.intensity
          );
          break;
        case 'DoS':
          result = await attackEngine.current.launchDoS(params.intensity);
          break;
        case 'Injection':
          result = await attackEngine.current.launchInjection(
            params.targetRegister,
            params.dangerousValue
          );
          break;
        case 'Replay':
          const capturedPacket = modbusProtocol.current.createWriteRequest(
            params.targetRegister || SYSTEM_CONSTANTS.REGISTERS.PUMP_CONTROL,
            50
          );
          result = await attackEngine.current.launchReplay(capturedPacket);
          break;
        default:
          throw new Error('Unknown attack type');
      }

      if (result.success) {
        // Process attack packets through defense system
        const packets = result.packets || [result.modifiedPacket || result.packet || result.replayPacket];
        
        packets.forEach(packet => {
          processPacket(packet, attackType);
        });

        // Update active attacks
        setActiveAttacks(attackEngine.current.getActiveAttacks());
        
        addLog(
          `Attack launched: ${attackType} - ${result.description}`,
          ALERT_LEVELS.CRITICAL
        );
      }
    } catch (error) {
      addLog(`Attack failed: ${error.message}`, ALERT_LEVELS.WARNING);
    }
  };

  /**
   * Process packet through defense layers
   */
  const processPacket = (packet, attackType = null) => {
    // Add to network traffic
    addNetworkTraffic(packet);

    // Check with anomaly detector
    const anomalyResult = anomalyDetector.current.analyzePacket(packet);
    
    if (anomalyResult.isAnomaly) {
      addLog(
        `Anomaly detected (score: ${anomalyResult.score}): ${anomalyResult.details.join(', ')}`,
        ALERT_LEVELS.WARNING
      );
    }

    // Process through defense system
    const defenseResult = defenseSystem.current.processPacket(packet);
    
    if (!defenseResult.allowed) {
      addLog(
        `Packet blocked by ${defenseResult.blockedBy.join(', ')}: ${defenseResult.reason}`,
        ALERT_LEVELS.WARNING
      );
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        blockedPackets: prev.blockedPackets + 1,
        attacksDetected: attackType ? prev.attacksDetected + 1 : prev.attacksDetected
      }));
    } else {
      // Packet allowed - apply to process
      if (packet.functionCode === SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.WRITE_SINGLE_REGISTER ||
          packet.functionCode === SYSTEM_CONSTANTS.MODBUS_FUNCTION_CODES.WRITE_MULTIPLE_REGISTERS) {
        processSimulator.current.writeRegister(packet.startAddress, packet.value);
        
        if (attackType) {
          addLog(
            `⚠️ Attack successful! ${attackType} compromised register ${packet.startAddress}`,
            ALERT_LEVELS.CRITICAL
          );
        }
      }
    }

    // Update total packets
    setMetrics(prev => ({
      ...prev,
      totalPackets: prev.totalPackets + 1
    }));
  };

  /**
   * Toggle defense mechanism
   */
  const handleToggleDefense = (defenseType, enabled) => {
    const result = defenseSystem.current.toggleDefense(defenseType, enabled);
    
    if (result.success) {
      setDefenseStatus(prev => ({
        ...prev,
        [defenseType]: enabled
      }));
      
      addLog(
        `Defense ${defenseType} ${enabled ? 'enabled' : 'disabled'}`,
        ALERT_LEVELS.INFO
      );
    }
  };

  /**
   * Enable all defenses
   */
  const handleEnableAllDefenses = () => {
    defenseSystem.current.enableAll();
    
    const allEnabled = {};
    Object.keys(SYSTEM_CONSTANTS.DEFENSE_TYPES).forEach(key => {
      allEnabled[key.toLowerCase()] = true;
    });
    
    setDefenseStatus(allEnabled);
    addLog('All defenses enabled', ALERT_LEVELS.INFO);
  };

  /**
   * Add network traffic entry
   */
  const addNetworkTraffic = (packet) => {
    setNetworkTraffic(prev => {
      const newTraffic = [...prev, {
        id: generateId(),
        ...packet,
        timestamp: Date.now()
      }];
      
      // Limit to last 100 packets
      return newTraffic.slice(-100);
    });
  };

  /**
   * Add security log entry
   */
  const addLog = (message, level = ALERT_LEVELS.INFO) => {
    setSecurityLogs(prev => {
      const newLog = {
        id: generateId(),
        message,
        level,
        timestamp: Date.now()
      };
      
      const newLogs = [...prev, newLog];
      
      // Limit to max retention
      return newLogs.slice(-SYSTEM_CONSTANTS.SIMULATION.LOG_RETENTION);
    });
  };

  /**
   * Update system metrics
   */
  const updateMetrics = () => {
    // Calculate system health based on process state
    const state = processSimulator.current.getState();
    let health = 100;
    
    if (state.alarmActive) health -= 30;
    if (!state.safetyInterlock) health -= 40;
    if (state.temperature > 90) health -= 20;
    if (state.pressure > 140) health -= 20;
    
    health = Math.max(0, health);
    
    setMetrics(prev => ({
      ...prev,
      systemHealth: health
    }));
  };

  /**
   * Stop specific attack
   */
  const handleStopAttack = (attackId) => {
    const result = attackEngine.current.stopAttack(attackId);
    if (result.success) {
      setActiveAttacks(attackEngine.current.getActiveAttacks());
      addLog(`Attack stopped: ${attackId}`, ALERT_LEVELS.INFO);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏭 SCADA/Modbus Cyber Security Simulator</h1>
        <p className="subtitle">Industrial Control Systems Attack & Defense Platform</p>
      </header>

      <Dashboard
        isRunning={isRunning}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        metrics={metrics}
      />

      <div className="main-grid">
        <div className="left-column">
          <ProcessMonitor
            processState={processState}
            processHistory={processHistory}
            isRunning={isRunning}
          />
          
          <AttackControl
            onLaunchAttack={handleLaunchAttack}
            activeAttacks={activeAttacks}
            onStopAttack={handleStopAttack}
            isRunning={isRunning}
          />
        </div>

        <div className="middle-column">
          <NetworkMonitor
            networkTraffic={networkTraffic}
            isRunning={isRunning}
          />
          
          <MetricsPanel
            metrics={metrics}
            defenseStats={defenseSystem.current.getStatistics()}
            anomalyStats={anomalyDetector.current.getStatistics()}
          />
        </div>

        <div className="right-column">
          <DefenseControl
            defenseStatus={defenseStatus}
            onToggleDefense={handleToggleDefense}
            onEnableAll={handleEnableAllDefenses}
          />
          
          <SecurityLogs
            logs={securityLogs}
          />
        </div>
      </div>

      <footer className="app-footer">
        <p>Educational Cybersecurity Simulator - For Training Purposes Only</p>
        <p>© 2024 SCADA Security Research Project</p>
      </footer>
    </div>
  );
}

export default App;