
"use client";

import { useProducts, sortProducts, type Sort } from "@/lib/api";
import { Grid, Skeletons } from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { data, loading, error } = useProducts();
  const [sort, setSort] = useState<Sort>("default");

  const scrollY = useRef(0);

  const handleSortChange = (value: Sort) => {
    scrollY.current = window.scrollY;
    setSort(value);
  };

  useLayoutEffect(() => {
    window.scrollTo({
      top: scrollY.current,
      behavior: "instant",
    });
  }, [sort]);

  const products = data || [];

  const risers = [...products]
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = [...products]
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  const sortedProducts = sortProducts(products, sort);

  const bnDate = () =>
    new Date().toLocaleDateString("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      <section className="my-10 grid grid-cols-1 items-center gap-8 rounded-2xl bg-[#fafcfa] p-6 sm:p-8 md:grid-cols-2 lg:gap-12">
        <div className="order-2 md:order-1">
          <div
            className="mb-5 inline-flex min-h-10 items-center justify-center rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-medium text-green-700 shadow-sm"
            suppressHydrationWarning
          >
            {bnDate()}
          </div>

          <p className="text-sm font-semibold text-green-700">
            আজকের বাজার দর
          </p>

          <h1 className="my-3 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mb-6 text-sm leading-7 text-gray-600 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        <div className="order-1 flex items-center justify-center md:order-2">
          <Image
            src="/assets/images/bazar-hero.png"
            alt="আজকের বাজারের পণ্যের চিত্র"
            width={500}
            height={350}
            priority
            className="h-auto w-full max-w-[320px] object-contain sm:max-w-[380px] lg:max-w-[450px]"
          />
        </div>
      </section>

      {error && (
        <p className="text-red-600">
          ডেটা লোড করা যায়নি।
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          আজ দাম বেড়েছে ▲
        </h2>

        <div className="mt-3">
          {loading ? (
            <Skeletons n={6} />
          ) : (
            <Grid list={risers} />
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          আজ দাম কমেছে ▼
        </h2>

        <div className="mt-3">
          {loading ? (
            <Skeletons n={6} />
          ) : (
            <Grid list={fallers} />
          )}
        </div>
      </section>

      {/* All products */}
      <section id="সব-পণ্য" className="mt-10 scroll-mt-40">
        <h2 className="text-2xl font-bold">
          সব পণ্য
        </h2>

        <p className="mb-4 text-gray-500">
          সব পণ্যের আজকের দাম
        </p>

        <div className="mb-3 flex justify-end">
          <SortSelect
            value={sort}
            onChange={handleSortChange}
          />
        </div>

        <div className="mt-3">
          {loading ? (
            <Skeletons />
          ) : (
            <Grid list={sortedProducts} />
          )}
        </div>
      </section>
    </>
  );
}