"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useProducts, fmtPrice } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Badge, Skeletons } from "@/components/ProductCard";
import NotFoundView from "@/components/NotFoundView";

export default function Detail() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const { data, loading } = useProducts();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("এই পেজ দেখতে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, session]);

  if (isPending || !session || loading)
    return (
      <div className="py-4 sm:py-8">
        <Skeletons n={3} />
      </div>
    );

  const p = data?.find((x) => x.slug === decodeURIComponent(slug));

  console.log("Product detail:", p);

  if (!p) return <NotFoundView msg="পণ্যটি খুঁজে পাওয়া যায়নি" />;

  const stat = (l: string, v: number) => (
    <div className="min-w-0 rounded-xl border bg-white p-3 sm:p-4">
      <p className="text-xs text-gray-500">{l}</p>
      <p className="text-base font-bold break-words sm:text-lg">
        {fmtPrice(v)} টাকা
      </p>
    </div>
  );

  console.log("per products from product page", p);

  return (
    <div className="space-y-4 py-3 sm:space-y-6 sm:py-8">
      <div className="flex flex-col gap-4 bg-white p-3 sm:gap-6 sm:p-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10 lg:py-6">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-6">
          <div className="shrink-0 rounded-lg bg-slate-100 px-3 py-3 text-3xl sm:px-4 sm:py-4 sm:text-5xl">
            {p.emoji}
          </div>

          <div className="min-w-0">
            <h1 className="break-words text-xl font-bold sm:text-2xl md:text-3xl">
              {p.name}
            </h1>

            <h1 className="break-words text-sm text-gray-500 sm:text-base">
              {p.unit} / {p.categoryName}
            </h1>

            <h1 className="mt-2 break-words text-sm text-gray-500 sm:text-base">
              <span>
                {p.changeDir == "up"
                  ? "গতকালের তুলনায় আজ দাম বেড়েছে   "
                  : "গতকালের তুলনায় আজ দাম কমেছে   "}
              </span>
              <span>{fmtPrice(Math.abs(p.change))}</span>
              <span>%</span>
            </h1>
          </div>
        </div>

        <div className="w-full shrink-0 rounded-lg bg-slate-200 p-3 text-center text-gray-500 sm:p-5 md:w-auto md:min-w-40">
          <div>আজকের দাম</div>

          <div>
            <span className="break-words text-lg font-bold sm:text-xl">
              {fmtPrice(p.price)}
            </span>
          </div>

          <div className="text-sm sm:text-base">
            টাকা/{p.unit.split(" ")[1]}
          </div>

          <div
            className={
              p.changeDir == "up"
                ? "text-red-600"
                : "text-green-600"
            }
          >
            {p.changeDir == "up" ? "▲  " : "▼  "}
            <span>{fmtPrice(Math.abs(p.change))}</span>
            <span>%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-4">
        {stat("সর্বনিম্ন", p.min)}
        {stat("সর্বোচ্চ", p.max)}
        {stat("গড়", p.avg)}
        {stat("আজকের দাম", p.price)}
      </div>

      {p.markets.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="table w-full min-w-[520px]">
            <thead>
              <tr>
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th>সর্বনিম্ন</th>
                <th>সর্বাধিক</th>
                <th>গড়</th>
              </tr>
            </thead>

            <tbody>
              {p.markets.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>{m.division}</td>
                  <td>{fmtPrice(m.min)} টাকা</td>
                  <td>{fmtPrice(m.max)} টাকা</td>
                  <td>{fmtPrice((m.min + m.max) / 2)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
