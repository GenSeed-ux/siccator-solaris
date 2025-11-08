import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "active" | "pending";
  timestamp?: string;
}

interface DryingTimelineProps {
  status: "idle" | "active" | "paused" | "completed";
  moistureLevel: number;
  cropType: string;
}

export function DryingTimeline({ status, moistureLevel, cropType }: DryingTimelineProps) {
  const getTimelineSteps = (): TimelineStep[] => {
    const currentMoisture = moistureLevel;
    
    return [
      {
        id: 1,
        title: "Session Started",
        description: `${cropType} drying initiated`,
        status: status !== "idle" ? "completed" : "pending",
        timestamp: status !== "idle" ? "Just now" : undefined,
      },
      {
        id: 2,
        title: "Initial Drying Phase",
        description: "Moisture: 85% → 60%",
        status: currentMoisture <= 60 ? "completed" : currentMoisture > 60 && status === "active" ? "active" : "pending",
        timestamp: currentMoisture <= 60 ? "2 hours ago" : undefined,
      },
      {
        id: 3,
        title: "Intermediate Drying",
        description: "Moisture: 60% → 30%",
        status: currentMoisture <= 30 ? "completed" : currentMoisture > 30 && currentMoisture <= 60 && status === "active" ? "active" : "pending",
        timestamp: currentMoisture <= 30 ? "4 hours ago" : undefined,
      },
      {
        id: 4,
        title: "Final Drying Phase",
        description: "Moisture: 30% → 15%",
        status: currentMoisture <= 15 ? "completed" : currentMoisture > 15 && currentMoisture <= 30 && status === "active" ? "active" : "pending",
        timestamp: currentMoisture <= 15 ? "6 hours ago" : undefined,
      },
      {
        id: 5,
        title: "Quality Check",
        description: "Verifying optimal moisture level",
        status: currentMoisture <= 15 && status === "completed" ? "completed" : currentMoisture <= 15 ? "active" : "pending",
        timestamp: status === "completed" ? "Just now" : undefined,
      },
    ];
  };

  const steps = getTimelineSteps();

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "active":
        return <Clock className="w-5 h-5 text-primary animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">Completed</Badge>;
      case "active":
        return <Badge className="bg-primary/10 text-primary border-primary/30">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drying Process Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              {/* Icon and Line */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-card border-2 border-border">
                  {getStatusIcon(step.status)}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${
                    step.status === "completed" ? "bg-green-500" : "bg-border"
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {getStatusBadge(step.status)}
                </div>
                {step.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.timestamp}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Progress</span>
            <span className="font-semibold text-foreground">
              {Math.round(((85 - moistureLevel) / (85 - 15)) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(((85 - moistureLevel) / (85 - 15)) * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
