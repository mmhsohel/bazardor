import Link from "next/link";
import { Product, fmtPrice, toBn } from "@/lib/api";
export function Badge({ c }: { c: number }) {
  const cls = c > 0 ? "bg-green-100 text-red-700" : c < 0 ? "bg-red-100 text-green-700" : "bg-gray-100 text-gray-600";
  const t = c > 0 ? `▲ ${toBn(c)}%` : c < 0 ? `▼ ${toBn(Math.abs(c))}%` : "—০.০%";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{t}</span>;

 
}
export default function ProductCard({ p }: { p: Product }) {
 console.log("all products", p)
  return (
    <Link href={`/product/${p.slug}`} className="card bg-white border hover:shadow-md transition">
      <div className="card-body p-4 gap-1">
        <div className="text-4xl">{p.emoji}</div>
        <h3 className="font-bold text-lg">{p.name}</h3>
        <p className="text-sm text-gray-500">{p.unit}</p>
        <div className="flex items-center justify-between mt-2">
          <div><p className="text-xs text-gray-500">আজকের দাম</p><p className={
            p.change > 0
              ? "text-red-600"
              : p.change < 0
                ? "text-green-500"
                : "text-gray-500"
          }>{fmtPrice(p.price)} টাকা</p></div>
          <Badge c={p.change} />
        </div>
      </div>
    </Link>
  );
}
export const Skeletons = ({ n = 8 }: { n?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton h-40 w-full" />)}
  </div>
);
export const Grid = ({ list }: { list: Product[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{list.map(p => <ProductCard key={p.slug} p={p} />)}</div>
);
