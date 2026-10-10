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

        <div className="flex items-start">
          <div className="h-20 w-20 flex justify-center text-5xl pt-0">
            {p.emoji}
          </div>
          <div>
            <div className="font-bold text-lg">{p.name}</div>
            <div className="text-sm text-gray-400 font-thin">{p.unit}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div><p className="text-xs text-gray-500">আজকের দাম</p><p className="text-lg font-bold" >{fmtPrice(p.price)} টাকা</p></div>
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(p => <ProductCard key={p.slug} p={p} />)}</div>
);
