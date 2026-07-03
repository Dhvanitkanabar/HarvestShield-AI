'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  IndianRupee,
  Truck,
  Warehouse,
  Sprout,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface SimParams {
  batchSizeKg: number;
  cropType: string;
  seasonality: number; // 0=offseason 1=peak
  distanceKm: number;
  daysToMarket: number;
}

const CROP_PROFILES: Record<string, { shelfLife: number; spoilageBase: number; pricePerKg: number; category: string }> = {
  Tomato: { shelfLife: 14, spoilageBase: 35, pricePerKg: 22, category: 'Perishable' },
  Wheat: { shelfLife: 180, spoilageBase: 8, pricePerKg: 25, category: 'Grain' },
  Onion: { shelfLife: 90, spoilageBase: 18, pricePerKg: 18, category: 'Vegetable' },
  Soybean: { shelfLife: 365, spoilageBase: 5, pricePerKg: 45, category: 'Oilseed' },
  Potato: { shelfLife: 60, spoilageBase: 22, pricePerKg: 15, category: 'Vegetable' },
  Mango: { shelfLife: 21, spoilageBase: 40, pricePerKg: 80, category: 'Fruit' },
};

function computeScenarios(params: SimParams, crop: (typeof CROP_PROFILES)[string]) {
  // WITHOUT HarvestShield
  const spoilageRateWithout = Math.min(
    100,
    crop.spoilageBase * 1.3 + params.daysToMarket * 1.5 + (1 - params.seasonality) * 8
  );
  const soldKgWithout = params.batchSizeKg * (1 - spoilageRateWithout / 100);
  const revenueWithout = soldKgWithout * crop.pricePerKg * (0.88 - (1 - params.seasonality) * 0.05);
  const storageCostWithout = params.batchSizeKg * 0.8 * params.daysToMarket;
  const transportCostWithout = params.distanceKm * 12;
  const farmerProfitWithout = revenueWithout - storageCostWithout - transportCostWithout;

  // WITH HarvestShield
  const spoilageRateWith = Math.max(3, crop.spoilageBase * 0.28 + params.daysToMarket * 0.4);
  const soldKgWith = params.batchSizeKg * (1 - spoilageRateWith / 100);
  const aiPriceBoost = 1 + params.seasonality * 0.12 + 0.06;
  const revenueWith = soldKgWith * crop.pricePerKg * aiPriceBoost;
  const storageCostWith = params.batchSizeKg * 0.65 * params.daysToMarket; // optimized routing
  const transportCostWith = params.distanceKm * 9.5; // fuel-optimized routes
  const farmerProfitWith = revenueWith - storageCostWith - transportCostWith;

  return {
    without: {
      spoilage: spoilageRateWithout,
      revenue: revenueWithout,
      storageCost: storageCostWithout,
      transportCost: transportCostWithout,
      farmerProfit: farmerProfitWithout,
    },
    with: {
      spoilage: spoilageRateWith,
      revenue: revenueWith,
      storageCost: storageCostWith,
      transportCost: transportCostWith,
      farmerProfit: farmerProfitWith,
    },
  };
}

function formatCurrency(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v.toFixed(0)}`;
}

export default function BusinessSimulator() {
  const [params, setParams] = useState<SimParams>({
    batchSizeKg: 2000,
    cropType: 'Tomato',
    seasonality: 0.7,
    distanceKm: 50,
    daysToMarket: 7,
  });

  const crop = CROP_PROFILES[params.cropType];
  const results = useMemo(() => computeScenarios(params, crop), [params, crop]);
  const profitDelta = results.with.farmerProfit - results.without.farmerProfit;
  const spoilageDelta = results.without.spoilage - results.with.spoilage;

  const resetDefaults = () =>
    setParams({ batchSizeKg: 2000, cropType: 'Tomato', seasonality: 0.7, distanceKm: 50, daysToMarket: 7 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Business Impact Simulator</h1>
          <p className="text-slate-500 mt-1">
            Compare outcomes with and without HarvestShield AI interventions.
          </p>
        </div>
        <button
          onClick={resetDefaults}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium text-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-slate-900 text-lg">Simulation Parameters</h2>

          <SliderControl
            label="Batch Size (kg)"
            value={params.batchSizeKg}
            min={500}
            max={10000}
            step={500}
            format={(v) => `${v.toLocaleString()} kg`}
            onChange={(v) => setParams((p) => ({ ...p, batchSizeKg: v }))}
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Crop Type</label>
            <select
              value={params.cropType}
              onChange={(e) => setParams((p) => ({ ...p, cropType: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-50"
            >
              {Object.keys(CROP_PROFILES).map((c) => (
                <option key={c} value={c}>{c} ({CROP_PROFILES[c].category})</option>
              ))}
            </select>
          </div>

          <SliderControl
            label="Market Seasonality"
            value={params.seasonality}
            min={0}
            max={1}
            step={0.1}
            format={(v) => v < 0.4 ? 'Off-season' : v < 0.7 ? 'Normal season' : 'Peak season'}
            onChange={(v) => setParams((p) => ({ ...p, seasonality: v }))}
          />

          <SliderControl
            label="Distance to Market"
            value={params.distanceKm}
            min={10}
            max={300}
            step={10}
            format={(v) => `${v} km`}
            onChange={(v) => setParams((p) => ({ ...p, distanceKm: v }))}
          />

          <SliderControl
            label="Days to Market Sale"
            value={params.daysToMarket}
            min={1}
            max={30}
            step={1}
            format={(v) => `${v} days`}
            onChange={(v) => setParams((p) => ({ ...p, daysToMarket: v }))}
          />

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
            <p><b>Crop Profile:</b> {params.cropType}</p>
            <p><b>Shelf Life:</b> {crop.shelfLife} days</p>
            <p><b>Base Price:</b> ₹{crop.pricePerKg}/kg</p>
            <p><b>Base Spoilage:</b> {crop.spoilageBase}%</p>
          </div>
        </div>

        {/* Results Comparison */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delta Summary Banner */}
          <div className={`rounded-2xl p-5 text-white ${profitDelta > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-red-500'}`}>
            <div className="flex items-center gap-3">
              <Sprout className="w-8 h-8 opacity-90" />
              <div>
                <p className="font-bold text-xl">
                  {profitDelta > 0 ? '+' : ''}{formatCurrency(profitDelta)} more profit with HarvestShield
                </p>
                <p className="text-sm opacity-85">
                  {spoilageDelta.toFixed(1)}% less spoilage · {spoilageDelta > 0 ? '✓ Recommended' : 'Low spoilage crop'}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScenarioCard
              title="Without HarvestShield"
              scenario={results.without}
              highlight="bad"
            />
            <ScenarioCard
              title="With HarvestShield AI"
              scenario={results.with}
              highlight="good"
            />
          </div>

          {/* Delta table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold text-slate-900">Improvement Breakdown</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase text-slate-500 border-b">
                  <th className="text-left px-6 py-3">Metric</th>
                  <th className="text-right px-4 py-3">Without HS</th>
                  <th className="text-center px-2 py-3"></th>
                  <th className="text-right px-4 py-3">With HS</th>
                  <th className="text-right px-6 py-3">Delta</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '🍅 Spoilage', without: `${results.without.spoilage.toFixed(1)}%`, with: `${results.with.spoilage.toFixed(1)}%`, delta: `-${spoilageDelta.toFixed(1)}%`, good: true },
                  { label: '💰 Revenue', without: formatCurrency(results.without.revenue), with: formatCurrency(results.with.revenue), delta: `+${formatCurrency(results.with.revenue - results.without.revenue)}`, good: true },
                  { label: '🏭 Storage Cost', without: formatCurrency(results.without.storageCost), with: formatCurrency(results.with.storageCost), delta: `-${formatCurrency(results.without.storageCost - results.with.storageCost)}`, good: true },
                  { label: '🚛 Transport', without: formatCurrency(results.without.transportCost), with: formatCurrency(results.with.transportCost), delta: `-${formatCurrency(results.without.transportCost - results.with.transportCost)}`, good: true },
                  { label: '👨‍🌾 Farmer Profit', without: formatCurrency(results.without.farmerProfit), with: formatCurrency(results.with.farmerProfit), delta: `+${formatCurrency(profitDelta)}`, good: profitDelta > 0 },
                ].map((row) => (
                  <tr key={row.label} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700">{row.label}</td>
                    <td className="text-right px-4 py-3 text-slate-500">{row.without}</td>
                    <td className="text-center px-2 py-3 text-slate-300"><ArrowRight className="w-4 h-4 inline" /></td>
                    <td className="text-right px-4 py-3 font-semibold text-slate-900">{row.with}</td>
                    <td className={`text-right px-6 py-3 font-bold text-sm ${row.good ? 'text-emerald-600' : 'text-rose-600'}`}>{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderControl({
  label, value, min, max, step, format, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </div>
  );
}

function ScenarioCard({
  title, scenario, highlight,
}: {
  title: string;
  scenario: { spoilage: number; revenue: number; storageCost: number; transportCost: number; farmerProfit: number };
  highlight: 'good' | 'bad';
}) {
  const isGood = highlight === 'good';
  return (
    <div className={`rounded-2xl border p-5 ${isGood ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}>
      <h3 className={`font-bold mb-4 ${isGood ? 'text-emerald-700' : 'text-slate-600'}`}>{title}</h3>
      <div className="space-y-3">
        <Metric icon={TrendingDown} label="Spoilage" value={`${scenario.spoilage.toFixed(1)}%`} bad={scenario.spoilage > 20} />
        <Metric icon={IndianRupee} label="Revenue" value={formatCurrency(scenario.revenue)} good={isGood} />
        <Metric icon={Warehouse} label="Storage Cost" value={formatCurrency(scenario.storageCost)} />
        <Metric icon={Truck} label="Transport" value={formatCurrency(scenario.transportCost)} />
        <div className={`border-t pt-3 mt-3 ${isGood ? 'border-emerald-200' : 'border-slate-200'}`}>
          <Metric
            icon={Sprout}
            label="Farmer Profit"
            value={formatCurrency(scenario.farmerProfit)}
            bold
            good={isGood && scenario.farmerProfit > 0}
            bad={scenario.farmerProfit < 0}
          />
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon, label, value, bold, good, bad,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  bold?: boolean;
  good?: boolean;
  bad?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className={`font-${bold ? 'bold text-base' : 'semibold'} ${good ? 'text-emerald-700' : bad ? 'text-rose-600' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}
