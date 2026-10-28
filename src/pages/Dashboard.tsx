import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, Sliders, BarChart3, History, Bell, Settings, Thermometer, Droplets, Layers,
  Menu, Sun, Power, Play, Pause, SkipBack, SkipForward, Zap, Wifi, Fan, Minus, Plus,
  Leaf, ShieldCheck, ShieldAlert, Cloud, Square, Wind, Sprout,
} from "lucide-react";
import { useMultiTrayDrying, TraySensorData } from "@/hooks/useMultiTrayDrying";
import { SafetyPanel } from "@/components/dashboard/SafetyPanel";
import { EnergyMeter } from "@/components/dashboard/sensors/EnergyMeter";
import { LightSensor } from "@/components/dashboard/sensors/LightSensor";
import bgImage from "@/assets/dashboard-bg.jpg";
import dryerImage from "@/assets/dryer-sunset.jpg";

const CROPS = [
  { name: "Maize/Corn", temp: 50 },
  { name: "Pepper/Chili", temp: 55 },
  { name: "Tomato", temp: 55 },
  { name: "Fish", temp: 45 },
  { name: "Cassava", temp: 50 },
  { name: "Mango", temp: 55 },
  { name: "Herbs", temp: 35 },
  { name: "Rice", temp: 45 },
];

const NAV = [
  { url: "/dashboard", icon: Home, label: "Overview" },
  { url: "/dashboard/controls", icon: Sliders, label: "Controls" },
  { url: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { url: "/dashboard/history", icon: History, label: "History" },
  { url: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { url: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const glass =
  "rounded-3xl border border-white/30 bg-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)]";
const inner = "rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl";

const Toggle = ({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) => (
  <button
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onClick}
    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-green-500" : "bg-white/30"}`}
  >
    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
  </button>
);

const GradientSlider = ({
  value, min, max, onChange, gradient, label,
}: { value: number; min: number; max: number; onChange?: (v: number) => void; gradient: string; label: string }) => (
  <div className="relative h-7 w-full">
    <div className="absolute inset-0 rounded-full" style={{ background: gradient }} />
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      value={value}
      disabled={!onChange}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className="glass-range absolute inset-0 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-default"
    />
  </div>
);

const PowerBtn = ({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition-all hover:scale-105 ${on ? "bg-white/50 text-green-700" : "bg-white/20 text-white"}`}
  >
    <Power className="h-5 w-5" />
  </button>
);

const progressOf = (t: TraySensorData) => Math.max(0, Math.min(100, Math.round(((85 - t.moistureLevel) / 70) * 100)));

const TrayMini = ({ tray, highlight }: { tray: TraySensorData; highlight: boolean }) => {
  const p = progressOf(tray);
  const r = 26, c = 2 * Math.PI * r;
  const statusLabel = { active: "Active", idle: "Idle", error: "Error", disconnected: "Offline" }[tray.status];
  return (
    <div className={`${inner} p-3 transition-all ${highlight ? "ring-2 ring-green-400 bg-white/25" : ""}`}>
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">{tray.trayNumber}</span>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Tray {tray.trayNumber}</p>
            <p className="text-[10px] text-white/70">{tray.lastUpdate.toLocaleTimeString()}</p>
          </div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tray.status === "error" ? "bg-red-500/80 text-white" : "bg-white/25 text-white"}`}>{statusLabel}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
            <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.25)" strokeWidth="6" fill="none" />
            <circle cx="32" cy="32" r={r} stroke="#4ade80" strokeWidth="6" fill="none" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c - (p / 100) * c} className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-sm font-bold leading-none">{p}%</span>
            <span className="text-[9px] text-white/70">dried</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-[10px]">
          <div className="flex items-center justify-between text-white"><Thermometer className="h-3 w-3" /><span className="font-semibold">{tray.temperature.toFixed(1)}°</span></div>
          <div className="flex justify-between rounded-md bg-sky-100/90 px-1.5 py-0.5 text-sky-700"><span>Humidity</span><b>{Math.round(tray.humidity)}%</b></div>
          <div className="flex justify-between rounded-md bg-orange-100/90 px-1.5 py-0.5 text-orange-700"><span>Moisture</span><b>{Math.round(tray.moistureLevel)}%</b></div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const d = useMultiTrayDrying(4);
  const { trays, trayCount, addTray, removeTray, systemData, averageTemperature, averageHumidity,
    overallProgress, session, config, fanSpeed, setFanSpeed, powerMode, startSession, pauseSession,
    stopSession, updateConfig, alerts, unacknowledgedAlerts, acknowledgeAlert, clearAllAlerts } = d;

  const [tab, setTab] = useState<number | "all">("all");
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(i); }, []);
  useEffect(() => { if (tab !== "all" && tab > trayCount) setTab("all"); }, [trayCount, tab]);

  const focus = tab === "all" ? null : trays.find((t) => t.trayNumber === tab) ?? null;
  const temp = focus ? focus.temperature : averageTemperature;
  const hum = focus ? focus.humidity : averageHumidity;
  const isActive = session.status === "active";
  const greeting = (() => { const h = now.getHours(); return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening"; })();
  const cropIdx = Math.max(0, CROPS.findIndex((c) => c.name === config.cropType));
  const pickCrop = (i: number) => { const c = CROPS[(i + CROPS.length) % CROPS.length]; updateConfig({ cropType: c.name, targetTemp: c.temp }); };
  const toggleRun = () => (isActive ? pauseSession() : startSession());
  const voc = systemData.vocLevel;
  const air = voc < 100 ? { label: "Good Air Quality", cls: "bg-green-500/70" } : voc < 200 ? { label: "Moderate Air", cls: "bg-amber-500/70" } : { label: "Poor Air Quality", cls: "bg-red-500/70" };
  const statusText = { idle: "Idle", active: "Drying", paused: "Paused", completed: "Completed" }[session.status];

  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden text-white">
      <img src={bgImage} alt="" aria-hidden className="fixed inset-0 -z-20 h-full w-full object-cover" />
      <div className="fixed inset-0 -z-10 bg-slate-900/25 backdrop-blur-md" aria-hidden />

      {/* Icon rail */}
      <aside className={`fixed left-0 top-0 z-20 hidden h-screen w-20 flex-col items-center justify-between rounded-r-3xl border-r border-white/25 bg-white/10 py-6 backdrop-blur-2xl md:flex`}>
        <nav className="mt-20 flex flex-col gap-5">
          {NAV.map((n) => (
            <NavLink key={n.url} to={n.url} end title={n.label} aria-label={n.label}
              className={({ isActive }) => `flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-white/25 ${isActive ? "bg-white/35 shadow-lg" : ""}`}>
              <n.icon className="h-6 w-6" />
            </NavLink>
          ))}
        </nav>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-green-600 font-bold" title="Farmer DEMO-001">FA</div>
      </aside>

      <div className="md:pl-24">
        {/* Top bar */}
        <header className={`sticky top-0 z-10 mx-3 mt-3 flex items-center justify-between px-5 py-3 md:mx-4 ${glass}`}>
          <div className="flex items-center gap-4 text-sm sm:text-base">
            <span className="flex items-center gap-1.5"><Thermometer className="h-5 w-5" />{averageTemperature.toFixed(1)}°C</span>
            <span className="flex items-center gap-1.5"><Droplets className="h-5 w-5" />{Math.round(averageHumidity)}%</span>
            <span className="hidden items-center gap-1.5 border-l border-white/30 pl-4 sm:flex"><Layers className="h-5 w-5" />{trayCount} trays</span>
          </div>
          <a href="#details" aria-label="Details" className="hidden h-11 w-11 items-center justify-center rounded-xl border border-white/40 bg-white/25 sm:flex"><Menu className="h-5 w-5" /></a>
          <div className="flex items-center gap-4 text-sm sm:text-base">
            <span className="hidden items-center gap-1.5 capitalize lg:flex"><Zap className="h-4 w-4" />{powerMode}</span>
            <NavLink to="/dashboard/alerts" className="relative" aria-label="Alerts">
              <Bell className="h-5 w-5" />
              {unacknowledgedAlerts.length > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold">{unacknowledgedAlerts.length}</span>}
            </NavLink>
            <span className="flex items-center gap-1.5"><Cloud className="h-5 w-5" />{Math.round(systemData.lightIntensity)} lux</span>
            <span className="font-semibold">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="mx-3 mt-3 flex justify-around md:hidden">
          {NAV.map((n) => (
            <NavLink key={n.url} to={n.url} end aria-label={n.label} className={({ isActive }) => `flex h-10 w-10 items-center justify-center rounded-full ${isActive ? "bg-white/35" : "bg-white/10"}`}>
              <n.icon className="h-5 w-5" />
            </NavLink>
          ))}
        </nav>

        <main className="mx-auto max-w-[1600px] space-y-5 p-3 md:p-4">
          <section className="space-y-5">
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 text-4xl font-medium leading-tight drop-shadow sm:text-5xl">
              Hi Farmer,<br />{greeting}.
            </motion.h1>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={addTray} aria-label="Add tray" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/40 bg-white/20 hover:bg-white/30"><Plus className="h-5 w-5" /></button>
              {(["all", ...trays.map((t) => t.trayNumber)] as const).map((k) => (
                <button key={k} onClick={() => setTab(k as number | "all")}
                  className={`h-11 rounded-full border px-6 font-medium transition-all ${tab === k ? "border-white/70 bg-blue-500/70 shadow-lg" : "border-white/30 bg-white/15 hover:bg-white/25"}`}>
                  {k === "all" ? "Overview" : `Tray ${k}`}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Temperature */}
              <div className={`${glass} flex flex-col overflow-hidden`}>
                <div className="space-y-4 p-5">
                  <p className="flex items-center gap-2 text-lg"><Thermometer className="h-6 w-6" />{focus ? `Tray ${focus.trayNumber} Temp` : "Main Temperature"}</p>
                  <GradientSlider label="Target temperature" value={config.targetTemp} min={30} max={70}
                    onChange={(v) => updateConfig({ targetTemp: v })}
                    gradient="linear-gradient(90deg,#f97316,#fde68a 35%,#e0f2fe 55%,#60a5fa)" />
                  <div className="flex items-end justify-between"><Sun className="h-7 w-7" /><span className="text-4xl font-semibold">{temp.toFixed(1)}<sup className="text-base">°C</sup></span></div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/20 bg-white/10 px-5 py-3">
                  <span>Target: {config.targetTemp}°C</span>
                  <PowerBtn on={isActive} onClick={toggleRun} label={isActive ? "Pause drying" : "Start drying"} />
                </div>
              </div>

              {/* Humidity */}
              <div className={`${glass} flex flex-col overflow-hidden`}>
                <div className="space-y-4 p-5">
                  <p className="flex items-center gap-2 text-lg"><Droplets className="h-6 w-6" />Humidity</p>
                  <GradientSlider label="Humidity" value={Math.round(hum)} min={0} max={100} gradient="linear-gradient(90deg,#3b82f6,#bfdbfe 50%,#60a5fa)" />
                  <div className="flex items-end justify-between"><Wind className="h-7 w-7" /><span className="text-4xl font-semibold">{Math.round(hum)}%</span></div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/20 bg-white/10 px-5 py-3">
                  <span>Target: &lt; 40%</span>
                  <PowerBtn on={config.mode === "auto"} onClick={() => updateConfig({ mode: config.mode === "auto" ? "manual" : "auto" })} label="Toggle auto mode" />
                </div>
              </div>

              {/* Media / crop */}
              <div className={`${glass} relative min-h-[220px] overflow-hidden sm:col-span-2 lg:col-span-1`}>
                <img src={dryerImage} alt="Solar dryer at sunset" loading="lazy" width={1024} height={640} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-4">
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <button onClick={() => pickCrop(cropIdx - 1)} aria-label="Previous crop" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur"><SkipBack className="h-4 w-4" /></button>
                    <button onClick={toggleRun} aria-label={isActive ? "Pause" : "Start"} className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/30 backdrop-blur">{isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}</button>
                    <button onClick={() => pickCrop(cropIdx + 1)} aria-label="Next crop" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur"><SkipForward className="h-4 w-4" /></button>
                  </div>
                  <div>
                    <p className="font-semibold">{config.cropType || "Pick a crop ◂ ▸"}</p>
                    <p className="text-xs text-white/80">{statusText} • {overallProgress.toFixed(0)}% dried{session.estimatedCompletion ? ` • ETA ${session.estimatedCompletion.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Power */}
              <div className={`${glass} flex flex-col overflow-hidden`}>
                <div className="space-y-2 p-4">
                  <p className="flex items-center gap-2"><Zap className="h-5 w-5" />Power / Energy</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-400" />{systemData.power.toFixed(0)} W</p>
                      <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-400" />{systemData.energy.toFixed(3)} kWh</p>
                    </div>
                    <Wifi className="h-5 w-5" />
                  </div>
                  <p className="flex items-center justify-center gap-2 rounded-full bg-white/20 py-1.5 text-sm"><Layers className="h-4 w-4" />{trayCount} Trays</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/20 bg-white/10 px-4 py-3">
                  <div><p className="font-medium capitalize">{powerMode} mode</p><p className="text-xs text-white/70">{systemData.voltage.toFixed(0)} V</p></div>
                </div>
              </div>

              {/* Target temp stepper */}
              <div className={`${glass} flex flex-col overflow-hidden`}>
                <div className="space-y-3 p-4">
                  <p className="flex items-center gap-2"><Fan className="h-5 w-5" />Air Flow Fan</p>
                  <div className="flex items-center justify-between rounded-full bg-white/20 p-1">
                    <button aria-label="Decrease fan" onClick={() => setFanSpeed(Math.max(0, fanSpeed - 10))} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30"><Minus className="h-4 w-4" /></button>
                    <span className="text-xl font-semibold">{fanSpeed}%</span>
                    <button aria-label="Increase fan" onClick={() => setFanSpeed(Math.min(100, fanSpeed + 10))} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30"><Plus className="h-4 w-4" /></button>
                  </div>
                  <p className="text-center text-sm text-white/80">{fanSpeed ? `Venting at ${fanSpeed}%` : "Fan off"}</p>
                </div>
                <div className="mt-auto flex items-center justify-end border-t border-white/20 bg-white/10 px-4 py-3">
                  <PowerBtn on={fanSpeed > 0} onClick={() => setFanSpeed(fanSpeed > 0 ? 0 : 60)} label="Toggle fan" />
                </div>
              </div>

              {/* Air quality */}
              <div className={`${glass} flex flex-col overflow-hidden`}>
                <div className="space-y-3 p-4">
                  <p className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium ${air.cls}`}><Leaf className="h-4 w-4" />{air.label}</p>
                  <div className="flex items-baseline justify-center gap-2 rounded-xl bg-white/80 py-2 text-slate-700">
                    <span className="text-xs">VOC</span><span className="text-2xl font-bold">{Math.round(voc)}</span><span className="text-xs">ppb</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/20 bg-white/10 px-4 py-3">
                  <div><p className="font-medium">Gas Sensor</p><p className="text-xs text-white/70">Auto</p></div>
                </div>
              </div>

              {/* Safety / session */}
              <div className={`flex flex-col overflow-hidden rounded-3xl border border-white/30 shadow-xl backdrop-blur-2xl ${unacknowledgedAlerts.length ? "bg-red-600/70" : "bg-blue-600/75"}`}>
                <div className="space-y-2 p-4">
                  {unacknowledgedAlerts.length ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                  <p className="text-lg font-semibold">{unacknowledgedAlerts.length ? `${unacknowledgedAlerts.length} Alert(s)` : "All Safe"}</p>
                  <p className="text-xs text-white/80">{unacknowledgedAlerts[0]?.message ?? `Session: ${statusText}`}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/20 bg-white/10 px-4 py-3">
                  <div><p className="font-medium">Stop Session</p><p className="text-xs text-white/70">Emergency</p></div>
                  <button aria-label="Stop session" onClick={stopSession} disabled={session.status === "idle"} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 disabled:opacity-40"><Square className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </section>

          <section>

            {/* Drying trays */}
            <div className={`${glass} p-4`}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500"><Layers className="h-6 w-6" /></span>
                  <div><p className="font-semibold">Drying Trays</p><p className="text-xs text-white/75">{trayCount} trays • Independent sensors</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white/25 p-1">
                  <button aria-label="Remove tray" onClick={removeTray} className="flex h-8 w-8 items-center justify-center rounded-full"><Minus className="h-4 w-4" /></button>
                  <span className="font-semibold">{trayCount}</span>
                  <button aria-label="Add tray" onClick={addTray} className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {trays.map((t) => <TrayMini key={t.trayId} tray={t} highlight={tab === t.trayNumber} />)}
              </div>
            </div>
          </section>
        </main>

        {/* Details */}
        <section id="details" className="glass-scope mx-auto grid max-w-[1600px] grid-cols-1 items-stretch gap-5 p-3 pb-10 md:p-4 lg:grid-cols-2 [&>*:first-child]:lg:col-span-2">
          <SafetyPanel alerts={alerts} systemData={systemData} trays={trays} targetTemp={config.targetTemp} onAcknowledgeAlert={acknowledgeAlert} onClearAllAlerts={clearAllAlerts} />
          <EnergyMeter voltage={systemData.voltage} current={systemData.current} power={systemData.power} energy={systemData.energy} powerFactor={systemData.powerFactor} frequency={systemData.frequency} />
          <LightSensor intensity={systemData.lightIntensity} timestamp={systemData.timestamp} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
