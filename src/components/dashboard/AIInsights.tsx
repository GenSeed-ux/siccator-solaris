import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export function AIInsights() {
  const insights = [
    {
      type: "optimization",
      title: "Optimal Drying Conditions",
      description: "Current temperature and humidity are ideal for tomato drying. Expected completion in 2.5 hours.",
      icon: CheckCircle,
      priority: "low",
    },
    {
      type: "prediction",
      title: "Weather Forecast Impact",
      description: "Solar input may decrease by 20% in the next 2 hours. Consider adjusting drying schedule.",
      icon: TrendingUp,
      priority: "medium",
    },
    {
      type: "alert",
      title: "Battery Level Notice",
      description: "Battery will reach optimal charge in 45 minutes for extended evening operation.",
      icon: AlertTriangle,
      priority: "low",
    },
  ];

  const priorityColors = {
    low: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${priorityColors[insight.priority as keyof typeof priorityColors]}`}>
                  <insight.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm text-foreground">{insight.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
