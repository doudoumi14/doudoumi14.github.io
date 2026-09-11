export interface Metric {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  detail: string;
}

// Headline outcomes, all drawn from the Bell engagement unless noted.
export const headlineMetrics: Metric[] = [
  {
    value: 4,
    suffix: "+",
    label: "Years in engineering",
    detail: "Across simulation, finance, and telecom infrastructure",
  },
  {
    value: 30,
    suffix: "%",
    label: "Fewer interruptions",
    detail: "AI-driven capacity planning on enterprise infrastructure",
  },
  {
    value: 90,
    suffix: "%",
    label: "Reporting automated",
    detail: "Manual performance reporting replaced with automation",
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Service availability",
    detail: "Maintained across critical national services",
  },
];
