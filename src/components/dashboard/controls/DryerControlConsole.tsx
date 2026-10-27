import { useEffect, useState } from "react";
import { Fan, Thermometer, Sprout, Play, Pause, Square, Minus, Plus, Sun, Hand, Check, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const crops = [
  { name: "Maize/Corn", temp: 50 }, { name: "Pepper/Chili", temp: 55 },
  { name: "Tomato", temp: 55 }, { name: "Fish", temp: 45 },
  { name: "Cassava", temp: 50 }, { name: "Mango", temp: 55 },
  { name: "Herbs", temp: 35 }, { name: "Rice", temp: 45 },
];

export interface DryerControlConsoleProps {
  status: "idle" | "active" | "paused" | "completed";
  mode: "auto" | "manual";
  targetTemp: number;
  cropType: string;
  fanSpeed: number;
  onStart: () => void | Promise<void>;
  onPause: () => void | Promise<void>;
  onStop: () => void | Promise<void>;
  onTempChange: (temp: number) => void;
  onCropChange: (crop: string) => void;
  onModeToggle: () => void;
  onFanControl: (speed: number) => void;
  onAlertReset?: () => void;
  compact?: boolean;
}

export function DryerControlConsole({ status, mode, targetTemp, cropType, fanSpeed, onStart, onPause, onStop, onTempChange, onCropChange, onModeToggle, onFanControl, onAlertReset, compact = false }: DryerControlConsoleProps) {
  const [temperature, setTemperature] = useState(String(targetTemp));
  const [customCrop, setCustomCrop] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { setTemperature(String(targetTemp)); setError(""); }, [targetTemp]);
  const active = status === "active";
  const statusLabel = { idle: "Ready to dry", active: "Drying in progress", paused: "Session paused", completed: "Drying complete" }[status];
  const run = async (name: string, action: () => void | Promise<void>) => {
    setPending(name);
    try { await action(); } finally { setPending(null); }
  };
  const applyTemperature = () => {
    const value = Number(temperature);
    if (!temperature.trim() || !Number.isFinite(value) || value < 30 || value > 70) {
      setError("Enter a temperature from 30 to 70°C.");
      return;
    }
    setError(""); onTempChange(value);
  };
  const preset = crops.find((crop) => crop.name === cropType);
  return (
    <section className={cn("dryer-console", compact && "dryer-console-compact")} aria-label="Dryer controls">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="console-icon"><Sun className="h-5 w-5" /></span>
          <div><p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Siccator Solaris</p><h2 className="text-xl font-semibold tracking-normal">Dryer controls</h2></div>
        </div>
        <span role="status" className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><span className={cn("h-2 w-2 rounded-full", active ? "bg-primary motion-safe:animate-pulse" : "bg-muted-foreground")} />{statusLabel}</span>
      </header>

      <div className={cn("grid", !compact && "lg:grid-cols-[1fr_1.15fr]")}>
        <div className={cn("px-6 py-6", !compact && "lg:border-r lg:border-border")}>
          <div className="flex items-center justify-between gap-3">
            <Label className="flex items-center gap-2 text-sm"><Thermometer className="h-4 w-4 text-accent" />Target temperature</Label>
            <span className="text-xs text-muted-foreground">30–70°C</span>
          </div>
          <div className="flex items-center justify-center gap-6 py-6">
            <Button variant="outline" size="icon" className="console-step" aria-label="Decrease target temperature" disabled={targetTemp <= 30} onClick={() => onTempChange(Math.max(30, targetTemp - 1))}><Minus /></Button>
            <div className="console-temperature"><span className="text-5xl font-semibold tabular-nums">{targetTemp}<span className="align-top text-xl font-normal text-muted-foreground">°C</span></span><span className="mt-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Drying target</span></div>
            <Button variant="outline" size="icon" className="console-step" aria-label="Increase target temperature" disabled={targetTemp >= 70} onClick={() => onTempChange(Math.min(70, targetTemp + 1))}><Plus /></Button>
          </div>
          <Slider aria-label="Target drying temperature" value={[targetTemp]} min={30} max={70} step={1} onValueChange={([value]) => onTempChange(value)} />
          <div className="mt-3 flex justify-between text-[11px] text-muted-foreground"><span>30°C</span><span>50°C</span><span>70°C</span></div>
          <div className="mt-5 flex items-center gap-2">
            <Label htmlFor={compact ? "overview-temperature" : "control-temperature"} className="shrink-0 text-xs text-muted-foreground">Set precisely</Label>
            <Input id={compact ? "overview-temperature" : "control-temperature"} aria-invalid={!!error} type="number" min={30} max={70} step="any" value={temperature} onChange={(event) => setTemperature(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") applyTemperature(); }} className="min-w-0 flex-1" />
            <Button variant="outline" size="icon" aria-label="Apply target temperature" onClick={applyTemperature}><Check /></Button>
          </div>
          {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
        </div>

        <div className={cn("border-t border-border px-6 py-6", !compact && "lg:border-t-0")}>
          <div className="mb-4 flex items-center gap-2"><Sprout className="h-4 w-4 text-primary" /><Label htmlFor={compact ? "overview-crop" : "control-crop"}>Produce</Label></div>
          <Select value={preset ? cropType : cropType ? "custom" : ""} onValueChange={(value) => { if (value === "custom") return; const crop = crops.find((item) => item.name === value); if (crop) { onCropChange(crop.name); onTempChange(crop.temp); } }}>
            <SelectTrigger id={compact ? "overview-crop" : "control-crop"} className="h-12"><SelectValue placeholder="Select produce" /></SelectTrigger>
            <SelectContent>{crops.map((crop) => <SelectItem key={crop.name} value={crop.name}>{crop.name} · {crop.temp}°C</SelectItem>)}{cropType && !preset && <SelectItem value="custom">{cropType}</SelectItem>}</SelectContent>
          </Select>
          <div className="mt-2 flex gap-2"><Input aria-label="Custom produce" placeholder="Custom produce" value={customCrop} onChange={(event) => setCustomCrop(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && customCrop.trim()) { onCropChange(customCrop.trim()); setCustomCrop(""); } }} /><Button variant="outline" size="icon" aria-label="Set custom produce" disabled={!customCrop.trim()} onClick={() => { onCropChange(customCrop.trim()); setCustomCrop(""); }}><Check /></Button></div>

          <div className="mt-6 flex items-center justify-between"><Label>Control mode</Label><span className="text-xs text-muted-foreground">{mode === "auto" ? "Automatic" : "Manual"}</span></div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant={mode === "auto" ? "default" : "outline"} className="h-11" aria-pressed={mode === "auto"} onClick={() => { if (mode !== "auto") onModeToggle(); }}><Sun />Auto</Button>
            <Button variant={mode === "manual" ? "default" : "outline"} className="h-11" aria-pressed={mode === "manual"} onClick={() => { if (mode !== "manual") onModeToggle(); }}><Hand />Manual</Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-5">
        <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Fan className={cn("h-5 w-5 text-primary", active && fanSpeed > 0 && "motion-safe:animate-spin")} /><div><Label htmlFor={compact ? "overview-fan" : "control-fan"}>Airflow fan</Label><p className="mt-0.5 text-xs text-muted-foreground">{mode === "auto" ? "Automatic airflow" : "Manual airflow"}</p></div></div><div className="flex items-center gap-4"><span className="text-xl font-semibold tabular-nums">{fanSpeed}%</span><Switch id={compact ? "overview-fan" : "control-fan"} checked={fanSpeed > 0} onCheckedChange={(on) => onFanControl(on ? 60 : 0)} aria-label="Airflow fan" /></div></div>
        <Slider className="mt-5" aria-label="Fan speed" min={0} max={100} step={1} value={[fanSpeed]} onValueChange={([value]) => onFanControl(value)} />
        <div className="mt-3 flex justify-between">{[{ label: "Off", speed: 0 }, { label: "Low", speed: 33 }, { label: "Half", speed: 66 }, { label: "Full", speed: 100 }].map((item) => <Button key={item.speed} variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" aria-pressed={fanSpeed === item.speed} onClick={() => onFanControl(item.speed)}>{item.label}</Button>)}</div>
      </div>

      <footer className="console-footer border-t border-border px-6 py-5">
        <div className="mb-4 flex items-center justify-between gap-2 text-xs"><span className="truncate text-muted-foreground">{cropType || "No produce selected"}</span><span className="shrink-0 font-medium">{targetTemp}°C · {mode === "auto" ? "Auto" : "Manual"}</span></div>
        <div className="grid grid-cols-[1.35fr_1fr_1fr] gap-2">
          <Button className="h-12 px-2" disabled={active || !!pending} onClick={() => run("start", onStart)}>{pending === "start" ? <Loader2 className="animate-spin" /> : <Play />}Start</Button>
          <Button variant="outline" className="h-12 px-2" disabled={!active || !!pending} onClick={() => run("pause", onPause)}>{pending === "pause" ? <Loader2 className="animate-spin" /> : <Pause />}Pause</Button>
          <Button variant="outline" className="console-stop h-12 px-2" disabled={status === "idle" || !!pending} onClick={() => run("stop", onStop)}>{pending === "stop" ? <Loader2 className="animate-spin" /> : <Square />}Stop</Button>
        </div>
        {onAlertReset && <Button variant="ghost" onClick={onAlertReset} className="mt-3 w-full text-xs text-muted-foreground"><RotateCcw />Reset alerts</Button>}
      </footer>
    </section>
  );
}