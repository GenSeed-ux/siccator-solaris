import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";

interface RealtimeChartProps {
  tempTop?: number;
  tempBottom?: number;
  humidityTop?: number;
  humidityBottom?: number;
}

export function RealtimeChart({ 
  tempTop = 45, 
  tempBottom = 43, 
  humidityTop = 35, 
  humidityBottom = 37 
}: RealtimeChartProps) {
  const [data, setData] = useState<Array<{
    time: string;
    tempTop: number;
    tempBottom: number;
    humidityTop: number;
    humidityBottom: number;
  }>>([]);

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    setData((prev) => {
      const newData = [
        ...prev,
        {
          time: timeStr,
          tempTop,
          tempBottom,
          humidityTop,
          humidityBottom,
        },
      ];

      // Keep only last 20 data points
      return newData.slice(-20);
    });
  }, [tempTop, tempBottom, humidityTop, humidityBottom]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Environmental Data (Live)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="tempTop" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              name="Temp Top (°C)"
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="tempBottom" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Temp Bottom (°C)"
              opacity={0.7}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="humidityTop" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              dot={false}
              name="Humidity Top (%)"
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="humidityBottom" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Humidity Bottom (%)"
              opacity={0.7}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
