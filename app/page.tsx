"use client";
import { useProducts, sortProducts, Sort } from "@/lib/api";
import { Grid, Skeletons } from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { useState } from "react";
export default function Home() {
  const { data, loading, error } = useProducts();
  const [sort, setSort] = useState<Sort>("default");
  const risers = [...(data || [])].filter(p => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6);
  const fallers = [...(data || [])].filter(p => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6);
  const S = ({ id, title, sub, children }: any) => <section id={id} className="mt-10 scroll-mt-40"><h2 className="text-2xl font-bold">{title}</h2>{sub && <p className="text-gray-500 mb-4">{sub}</p>}<div className="mt-3">{children}</div></section>;
  return (<>
    <section className="grid md:grid-cols-2 gap-6 items-center py-10">
      <div>
        <p className="text-green-700 font-semibold text-sm">আজকের বাজার দর</p>
        <h1 className="text-3xl md:text-5xl font-bold my-3">নিত্যপ্রয়োজনীয় পণ্যের দাম, এক নজরে</h1>
        <p className="text-gray-600 mb-5">চাল, ডাল, সবজি, মাছ-মাংস — প্রতিদিনের হালনাগাদ দাম ও দামের পরিবর্তন জানুন।</p>
        <a href="#সব-পণ্য" className="btn btn-success text-white">সব পণ্য দেখুন</a>
      </div>
      <div className="text-center text-[8rem] md:text-[10rem] select-none">🧺</div>
    </section>
    {error && <p className="text-red-600">ডেটা লোড করা যায়নি।</p>}
    <S title="আজ দাম বেড়েছে ▲">{loading ? <Skeletons n={6} /> : <Grid list={risers} />}</S>
    <S title="আজ দাম কমেছে ▼">{loading ? <Skeletons n={6} /> : <Grid list={fallers} />}</S>
    <S id="সব-পণ্য" title="সব পণ্য" sub="সব পণ্যের আজকের দাম">
      <div className="flex justify-end mb-3"><SortSelect value={sort} onChange={setSort} /></div>
      {loading ? <Skeletons /> : <Grid list={sortProducts(data || [], sort)} />}
    </S>
  </>);
}
