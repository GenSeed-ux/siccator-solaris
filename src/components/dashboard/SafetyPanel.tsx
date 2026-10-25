import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  AlertOctagon, 
  Wind, 
  Thermometer, 
  Zap, 
  Cpu,
  CheckCircle2,
  X,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SafetyAlert, SystemSensorData, TraySensorData } from "@/hooks/useMultiTrayDrying";

interface SafetyPanelProps {
  alerts: SafetyAlert[];
  systemData: SystemSensorData;
  trays: TraySensorData[];
  targetTemp: number;
  onAcknowledgeAlert: (id: string) => void;
  onClearAllAlerts: () => void;
}

export function SafetyPanel({
  alerts,
  systemData,
  trays,
  targetTemp,
  onAcknowledgeAlert,
  onClearAllAlerts,
}: SafetyPanelProps) {
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const hasAlerts = unacknowledgedAlerts.length > 0;
  const hasDangerAlerts = unacknowledgedAlerts.some(a => a.severity === "danger");

  const getGasStatus = () => {
    if (systemData.vocLevel > 300) return { status: "danger", label: "Dangerous", color: "text-red-500" };
    if (systemData.vocLevel > 200) return { status: "warning", label: "Warning", color: "text-yellow-500" };
    return { status: "normal", label: "Normal", color: "text-green-500" };
  };

  const getOverTempTrays = () => {
    return trays.filter(t => t.temperature > targetTemp + 5);
  };

  const getSensorFailures = () => {
    return trays.filter(t => t.status === "error");
  };

  const getEnergyStatus = () => {
    if (systemData.power > 600) return { status: "danger", label: "Critical", color: "text-red-500" };
    if (systemData.power > 500) return { status: "warning", label: "High", color: "text-yellow-500" };
    return { status: "normal", label: "Normal", color: "text-green-500" };
  };

  const gasStatus = getGasStatus();
  const overTempTrays = getOverTempTrays();
  const sensorFailures = getSensorFailures();
  const energyStatus = getEnergyStatus();

  const getAlertIcon = (type: SafetyAlert["type"]) => {
    switch (type) {
      case "gas": return Wind;
      case "temperature": return Thermometer;
      case "energy": return Zap;
      case "sensor_failure": return Cpu;
      default: return AlertTriangle;
    }
  };

  return (
    <Card className={`glass transition-all duration-300 ${
      hasDangerAlerts 
        ? "border-2 border-red-500 shadow-lg shadow-red-500/20" 
        : hasAlerts 
        ? "border-2 border-yellow-500 shadow-lg shadow-yellow-500/10"
        : ""
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                hasDangerAlerts 
                  ? "bg-red-500" 
                  : hasAlerts 
                  ? "bg-yellow-500" 
                  : "gradient-primary"
              }`}
              animate={hasAlerts ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Shield className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Safety Panel
                {hasAlerts && (
                  <Badge variant="destructive" className="animate-pulse">
                    {unacknowledgedAlerts.length} Active
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                System health and safety monitoring
              </p>
            </div>
          </div>
          {hasAlerts && (
            <Button variant="outline" size="sm" onClick={onClearAllAlerts}>
              <Bell className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Gas Sensor Status */}
          <motion.div
            className={`p-4 rounded-xl border-2 ${
              gasStatus.status === "danger"
                ? "border-red-500 bg-red-500/10"
                : gasStatus.status === "warning"
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-green-500/30 bg-green-500/5"
            }`}
            animate={
              gasStatus.status !== "normal"
                ? { scale: [1, 1.02, 1] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Wind className={`w-5 h-5 ${gasStatus.color}`} />
              <span className="text-sm font-medium text-foreground">Gas Sensor</span>
            </div>
            <p className={`text-2xl font-bold ${gasStatus.color}`}>
              {systemData.vocLevel.toFixed(0)} PPM
            </p>
            <p className="text-xs text-muted-foreground">
              Status: <span className={gasStatus.color}>{gasStatus.label}</span>
            </p>
          </motion.div>

          {/* Temperature Status */}
          <motion.div
            className={`p-4 rounded-xl border-2 ${
              overTempTrays.length > 0
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-green-500/30 bg-green-500/5"
            }`}
            animate={
              overTempTrays.length > 0
                ? { scale: [1, 1.02, 1] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className={`w-5 h-5 ${
                overTempTrays.length > 0 ? "text-yellow-500" : "text-green-500"
              }`} />
              <span className="text-sm font-medium text-foreground">Temperature</span>
            </div>
            <p className={`text-2xl font-bold ${
              overTempTrays.length > 0 ? "text-yellow-500" : "text-green-500"
            }`}>
              {overTempTrays.length === 0 ? "OK" : `${overTempTrays.length} Hot`}
            </p>
            <p className="text-xs text-muted-foreground">
              {overTempTrays.length > 0
                ? `Trays: ${overTempTrays.map(t => t.trayNumber).join(", ")}`
                : "All trays normal"}
            </p>
          </motion.div>

          {/* Energy Status */}
          <motion.div
            className={`p-4 rounded-xl border-2 ${
              energyStatus.status === "danger"
                ? "border-red-500 bg-red-500/10"
                : energyStatus.status === "warning"
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-green-500/30 bg-green-500/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-5 h-5 ${energyStatus.color}`} />
              <span className="text-sm font-medium text-foreground">Energy</span>
            </div>
            <p className={`text-2xl font-bold ${energyStatus.color}`}>
              {systemData.power.toFixed(0)}W
            </p>
            <p className="text-xs text-muted-foreground">
              Status: <span className={energyStatus.color}>{energyStatus.label}</span>
            </p>
          </motion.div>

          {/* Sensor Status */}
          <motion.div
            className={`p-4 rounded-xl border-2 ${
              sensorFailures.length > 0
                ? "border-red-500 bg-red-500/10"
                : "border-green-500/30 bg-green-500/5"
            }`}
            animate={
              sensorFailures.length > 0
                ? { scale: [1, 1.02, 1] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Cpu className={`w-5 h-5 ${
                sensorFailures.length > 0 ? "text-red-500" : "text-green-500"
              }`} />
              <span className="text-sm font-medium text-foreground">Sensors</span>
            </div>
            <p className={`text-2xl font-bold ${
              sensorFailures.length > 0 ? "text-red-500" : "text-green-500"
            }`}>
              {sensorFailures.length === 0 ? "OK" : `${sensorFailures.length} Failed`}
            </p>
            <p className="text-xs text-muted-foreground">
              {sensorFailures.length > 0
                ? `Trays: ${sensorFailures.map(t => t.trayNumber).join(", ")}`
                : "All sensors online"}
            </p>
          </motion.div>
        </div>

        {/* Active Alerts */}
        {hasAlerts && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Active Alerts
            </h4>
            <AnimatePresence mode="popLayout">
              {unacknowledgedAlerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      variant={alert.severity === "danger" ? "destructive" : "default"}
                      className={`flex items-center justify-between ${
                        alert.severity === "danger"
                          ? "border-red-500 bg-red-500/10"
                          : "border-yellow-500 bg-yellow-500/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {alert.severity === "danger" ? (
                            <AlertOctagon className="h-5 w-5 text-red-500" />
                          ) : (
                            <Icon className="h-5 w-5 text-yellow-500" />
                          )}
                        </motion.div>
                        <div>
                          <AlertTitle className="text-sm font-medium">
                            {alert.trayId ? `Tray ${alert.trayId.replace("tray-", "")}` : "System"} -{" "}
                            {alert.type.replace("_", " ").charAt(0).toUpperCase() + alert.type.slice(1).replace("_", " ")}
                          </AlertTitle>
                          <AlertDescription className="text-xs">
                            {alert.message}
                          </AlertDescription>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </Alert>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* All Clear */}
        {!hasAlerts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 p-6 bg-green-500/10 rounded-xl border border-green-500/30"
          >
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400">All Systems Normal</p>
              <p className="text-sm text-muted-foreground">No active alerts or warnings</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
