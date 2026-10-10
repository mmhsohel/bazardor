
"use client";

import { useEffect, useState } from "react";

export const BASES = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

const BN = "০১২৩৪৫৬৭৮৯";

export const toBn = (v: number | string) =>
  String(v).replace(/\d/g, (d) => BN[+d]);

export const fmtPrice = (n: number) => toBn(n.toLocaleString("en-US"));

// Bengali (or English) numerals -> number. Used for sorting.
export const parseNum = (v: any): number => {
  if (typeof v === "number") return v;

  const s = String(v ?? "")
    .replace(/[০-৯]/g, (d) => String(BN.indexOf(d)))
    .replace(/,/g, "")
    .replace(/[^\d.\-]/g, "");

  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

export type Market = {
  name: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  price: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: number;
  category: string;
  categorySlug: string;
  categoryName: string;
  categoryIcon: string;
  markets: Market[];
  min: number;
  max: number;
  avg: number;
  changeDir : string
};

const UNITS: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

export function normalize(r: any, i: number): Product {
  const markets: Market[] = (r.markets || []).map((m: any) => ({
    name: m.market,
    division: m.division,
    min: parseNum(m.min),
    max: parseNum(m.max),
  }));

  const mins = markets.map((m) => m.min);
  const maxs = markets.map((m) => m.max);

  const today = parseNum(r.today);
  const pct = Math.abs(parseNum(r.change?.pct));

  const change =
    r.change?.dir === "up"
      ? pct
      : r.change?.dir === "down"
        ? -pct
        : 0;
  const changeDir = r.change.dir

  return {
    slug: String(r.slug ?? r.id ?? i),
    name: r.nameBn,
    emoji: r.image || r.categoryIcon || "🛒",
    unit: UNITS[r.unit] || r.unit || "",
    price: today,
    yesterday: parseNum(r.yesterday),
    lastWeek: parseNum(r.lastWeek),
    lastMonth: parseNum(r.lastMonth),
    change,
    changeDir,
    category: r.category,
    categorySlug: r.category,
    categoryName: r.categoryNameBn,
    categoryIcon: r.categoryIcon || "🛒",
    markets,
    min: mins.length ? Math.min(...mins) : today,
    max: maxs.length ? Math.max(...maxs) : today,
    avg: markets.length
      ? Math.round(
          markets.reduce((a, m) => a + (m.min + m.max) / 2, 0) /
            markets.length
        )
      : today,
  };
}

let cache: Product[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (cache) return cache;

  for (const b of BASES) {
    try {
      const res = await fetch(b);

      if (!res.ok) continue;

      const j = await res.json();
      const arr = Array.isArray(j)
        ? j
        : j.products || j.data || j.items || [];

      cache = arr.map(normalize);
      return cache!;
    } catch {}
  }

  throw new Error("Failed to load");
}

export function useProducts() {
  const [data, setData] = useState<Product[] | null>(cache);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!data) {
      getProducts()
        .then(setData)
        .catch(() => setError(true));
    }
  }, []);

  return { data, loading: !data && !error, error };
}

export type Sort = "default" | "asc" | "desc";

export const sortProducts = (l: Product[], s: Sort) =>
  s === "default"
    ? l
    : [...l].sort((a, b) =>
        s === "asc" ? a.price - b.price : b.price - a.price
      );