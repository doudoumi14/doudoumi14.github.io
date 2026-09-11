"use client";

import { headlineMetrics, type Metric } from "@/data/metrics";
import { useCountUp } from "@/hooks/useCountUp";

function MetricCard({ metric }: { metric: Metric }) {
  const { ref, value } = useCountUp(metric.value);
  const decimals = metric.decimals ?? 0;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40"
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <p className="text-4xl font-bold tracking-tight tabular-nums">
        <span className="gradient-text">
          {value.toFixed(decimals)}
          {metric.suffix}
        </span>
      </p>
      <p className="mt-2 font-medium">{metric.label}</p>
      <p className="mt-1 text-sm text-muted">{metric.detail}</p>
    </div>
  );
}

export function Metrics() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-8">
      <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {headlineMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}
