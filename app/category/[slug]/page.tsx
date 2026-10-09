"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useProducts, sortProducts, Sort } from "@/lib/api";
import { Grid, Skeletons } from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import NotFoundView from "@/components/NotFoundView";
export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const name = decodeURIComponent(slug);
  const { data, loading } = useProducts();
  const [sort, setSort] = useState<Sort>("default");
  const list = (data || []).filter(p => p.category === name);
  return (
    <div className="py-8">
      {loading ? <Skeletons /> : list.length === 0 ? <NotFoundView msg="এই ক্যাটাগরিতে কোনো পণ্য নেই" /> : <>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">{list[0].emoji} {name}</h1><SortSelect value={sort} onChange={setSort} />
        </div>
        <Grid list={sortProducts(list, sort)} /></>}
    </div>
  );
}
