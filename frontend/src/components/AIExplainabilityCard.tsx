'use client';

import React, { useState } from 'react';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  ListChecks,
  Zap,
  Target,
} from 'lucide-react';

interface RecommendationData {
  id?: string;
  recommendedAction: string;
  reason: string;
  confidenceScore: number;
  priority: string;
  expectedProfit?: number | null;
  spoilageRiskScore?: number | null;
  decisionHistories?: Array<{
    actionEvaluated: string;
    score: number;
    reasoning: string;
  }>;
}

interface AIExplainabilityCardProps {
  recommendation: RecommendationData;
  batchNumber?: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  SELL_NOW: { label: 'Sell Now', color: 'text-blue-600 bg-blue-50' },
  STORE: { label: 'Store', color: 'text-emerald-600 bg-emerald-50' },
  MOVE_TO_COLD_STORAGE: { label: 'Move to Cold Storage', color: 'text-sky-600 bg-sky-50' },
  TRANSFER_TO_ANOTHER_WAREHOUSE: { label: 'Transfer Warehouse', color: 'text-violet-600 bg-violet-50' },
  SEND_TO_PROCESSOR: { label: 'Send to Processor', color: 'text-amber-600 bg-amber-50' },
  MOVE_TO_MARKET: { label: 'Move to Market', color: 'text-indigo-600 bg-indigo-50' },
  PARTIAL_SELL: { label: 'Partial Sell', color: 'text-teal-600 bg-teal-50' },
  PARTIAL_STORE: { label: 'Partial Store', color: 'text-cyan-600 bg-cyan-50' },
  URGENT_ACTION_REQUIRED: { label: '⚡ Urgent Action', color: 'text-rose-600 bg-rose-50' },
  DISCARD: { label: 'Discard', color: 'text-red-700 bg-red-50' },
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-rose-100 text-rose-700 animate-pulse',
};

function getAlternativeRisks(action: string): string {
  const risks: Record<string, string> = {
    SELL_NOW: 'You may miss higher prices if the market trend continues upward. Monitor price predictions daily.',
    STORE: 'Storage costs accumulate. Spoilage risk increases if environmental conditions degrade.',
    MOVE_TO_COLD_STORAGE: 'Higher storage cost per day. Ensure cold chain is uninterrupted during transport.',
    MOVE_TO_MARKET: 'Market prices are volatile. If demand drops, revenue may fall below projection.',
    SEND_TO_PROCESSOR: 'Processing reduces direct profit margin. Consider only if spoilage risk is high.',
    URGENT_ACTION_REQUIRED: 'Immediate intervention needed. Delay may result in total batch loss.',
    DISCARD: 'Last resort. Consider partial processing or donation before discarding.',
  };
  return risks[action] || 'Monitor storage conditions and reassess within 48 hours.';
}

function getExpectedBenefit(action: string, profit?: number | null): string {
  const base: Record<string, string> = {
    SELL_NOW: 'Immediate cash flow. Eliminates spoilage risk entirely.',
    STORE: 'Capture market price increase. Premium return on Grade A quality.',
    MOVE_TO_COLD_STORAGE: 'Extends shelf life by up to 5×. Provides time to find optimal buyer.',
    MOVE_TO_MARKET: 'Capitalize on current demand peak. Maximum price realization.',
    SEND_TO_PROCESSOR: 'Guaranteed off-take. Eliminates price volatility risk.',
  };
  const base_msg = base[action] || 'Optimize produce lifecycle for maximum economic return.';
  if (profit) return `${base_msg} Estimated profit: ₹${profit.toLocaleString()}.`;
  return base_msg;
}

export default function AIExplainabilityCard({ recommendation, batchNumber }: AIExplainabilityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const actionStyle = ACTION_LABELS[recommendation.recommendedAction] || { label: recommendation.recommendedAction, color: 'text-slate-600 bg-slate-50' };
  const confidenceColor = recommendation.confidenceScore >= 85 ? 'text-emerald-600' : recommendation.confidenceScore >= 65 ? 'text-amber-600' : 'text-rose-600';
  const confidenceBg = recommendation.confidenceScore >= 85 ? 'bg-emerald-500' : recommendation.confidenceScore >= 65 ? 'bg-amber-500' : 'bg-rose-500';

  const alternatives = recommendation.decisionHistories
    ?.filter((h) => h.actionEvaluated !== recommendation.recommendedAction)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2) ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-sm">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">AI Recommendation</p>
              {batchNumber && <p className="text-xs text-slate-400">Batch: {batchNumber}</p>}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${PRIORITY_STYLES[recommendation.priority] || 'bg-slate-100 text-slate-600'}`}>
            {recommendation.priority} Priority
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <span className={`px-4 py-2 rounded-xl font-bold text-sm ${actionStyle.color}`}>
            {actionStyle.label}
          </span>
          <div className="flex-1 min-w-[120px]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Confidence</span>
              <span className={`font-bold ${confidenceColor}`}>{recommendation.confidenceScore.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${confidenceBg}`}
                style={{ width: `${recommendation.confidenceScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Core Reasoning */}
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <div className="p-1.5 bg-slate-100 rounded-lg h-fit mt-0.5">
            <Zap className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Reasoning</p>
            <p className="text-sm text-slate-700 leading-relaxed">{recommendation.reason}</p>
          </div>
        </div>

        {/* Spoilage Risk */}
        {recommendation.spoilageRiskScore != null && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <ShieldAlert className={`w-5 h-5 flex-shrink-0 ${recommendation.spoilageRiskScore > 60 ? 'text-rose-500' : recommendation.spoilageRiskScore > 30 ? 'text-amber-500' : 'text-emerald-500'}`} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600">Spoilage Risk Score</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full">
                  <div
                    className={`h-full rounded-full ${recommendation.spoilageRiskScore > 60 ? 'bg-rose-500' : recommendation.spoilageRiskScore > 30 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                    style={{ width: `${recommendation.spoilageRiskScore}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">{recommendation.spoilageRiskScore}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-2 border-t"
          aria-expanded={expanded}
          aria-label="Toggle detailed explanation"
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" /> Hide detailed analysis</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> Show detailed analysis</>
          )}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-4 pt-2 border-t animate-in slide-in-from-top-2 duration-200">
            {/* Expected Benefit */}
            <DetailSection
              icon={TrendingUp}
              title="Expected Benefit"
              color="text-emerald-600"
              content={getExpectedBenefit(recommendation.recommendedAction, recommendation.expectedProfit)}
            />

            {/* Potential Risks */}
            <DetailSection
              icon={AlertTriangle}
              title="Potential Risks"
              color="text-amber-600"
              content={getAlternativeRisks(recommendation.recommendedAction)}
            />

            {/* Factors Considered */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-blue-500" />
                Factors Considered
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Shelf Life Remaining', 'Quality Grade', 'Current Market Price', 'Demand Level', 'Storage Conditions', 'Transport Availability'].map((factor) => (
                  <div key={factor} className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2 py-1.5 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {factor}
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Actions */}
            {alternatives.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-violet-500" />
                  Alternative Actions Evaluated
                </p>
                <div className="space-y-2">
                  {alternatives.map((alt) => {
                    const altStyle = ACTION_LABELS[alt.actionEvaluated] || { label: alt.actionEvaluated, color: 'text-slate-600 bg-slate-50' };
                    return (
                      <div key={alt.actionEvaluated} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className={`px-2 py-0.5 rounded-lg text-xs font-semibold flex-shrink-0 ${altStyle.color}`}>
                          {altStyle.label}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-500">Score: {alt.score.toFixed(0)}%</span>
                            <div className="flex-1 h-1 bg-slate-200 rounded-full">
                              <div className="h-full bg-slate-400 rounded-full" style={{ width: `${alt.score}%` }} />
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">{alt.reasoning}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSection({ icon: Icon, title, content, color }: { icon: React.ElementType; title: string; content: string; color: string }) {
  return (
    <div className="flex gap-3">
      <div className="p-1.5 bg-slate-100 rounded-lg h-fit mt-0.5">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
