"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useProducts, fmtPrice, toBn } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
const bnDate = () => new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export default function Navbar() {
  const path = usePathname(); const router = useRouter();
  const { data: session } = useSession();
  const { data } = useProducts();
  const cats = Array.from(
    new Map(
      (data || []).map((p) => [
        p.category,
        {
          category: p.category,
          categorySlug: p.categorySlug,
          categoryName: p.categoryName,
          categoryIcon: p.categoryIcon,
        },
      ])
    ).values()
  );
  console.log(cats)
  const logout = async () => { await signOut({}); toast.success("সাইন আউট সফল হয়েছে"); router.push("/"); };
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <Link href="/"><div className="font-bold text-xl">🛒 বাজার দর</div><div className="text-xs text-gray-500" suppressHydrationWarning>{bnDate()}</div></Link>
        <div className="flex gap-2 items-center">
          {session ? <>
            <span className="text-sm hidden sm:inline">👤 {(session as { user: { name: string } }).user.name}</span>
            <button onClick={logout} className="btn btn-sm sm:btn-md btn-outline">সাইন আউট</button>
          </> : <>
            <Link href="/signin" className="btn btn-sm sm:btn-md btn-ghost">সাইন ইন</Link>
            <Link href="/signup" className="btn btn-sm sm:btn-md btn-success text-white">সাইন আপ</Link>
          </>}
        </div>
      </div>
      <nav className="max-w-6xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto">
        <Link href="/" className={`btn btn-sm ${path === "/" ? "btn-success text-white" : "btn-ghost"}`}>হোম</Link>
        {cats.map(p => {
          const href = `/category/${encodeURIComponent(p.category)}`;
          return <Link key={p.category} href={href} className={`btn btn-sm whitespace-nowrap ${decodeURIComponent(path) === `/category/${p.category}` ? "btn-success text-white" : "btn-ghost"}`}><span>{p.categoryIcon} {p.category}</span></Link>;
        })}
      </nav>
      {data && data.length > 0 && (
        <div className="bg-green-50 border-t overflow-hidden py-1.5 text-sm">
          <div className="marquee">
            {[...data, ...data].map((p, i) => (
              <span key={i} className="mx-4 whitespace-nowrap">{p.emoji} {p.name} {fmtPrice(p.price)} টাকা{p.unit && `/${p.unit.replace("প্রতি ", "")}`}{" "}
                <b className={p.change > 0 ? "text-red-600" : p.change < 0 ? "text-green-600" : "text-gray-500"}>{p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"} {toBn(Math.abs(p.change))}%</b></span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
