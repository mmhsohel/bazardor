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
  useEffect(() => { if (!isPending && !session) { toast.error("এই পেজ দেখতে সাইন ইন করুন"); router.replace("/signin"); } }, [isPending, session]);
  if (isPending || !session || loading) return <div className="py-8"><Skeletons n={3} /></div>;
  const p = data?.find(x => x.slug === decodeURIComponent(slug));
  console.log("Product detail:", p);
  if (!p) return <NotFoundView msg="পণ্যটি খুঁজে পাওয়া যায়নি" />;
  const stat = (l: string, v: number) => <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">{l}</p><p className="font-bold text-lg">{fmtPrice(v)} টাকা</p></div>;
  console.log("per products from product page", p)
  return (
    <div className="py-8 space-y-6">

      <div className="flex items-center justify-between bg-white px-10 py-6">
        <div className="flex items-center justify-center gap-6">
          <div className="text-5xl bg-slate-100 rounded-lg px-4 py-4">{p.emoji}</div>
          <div>
            <h1 className="text-3xl font-bold">{p.name}</h1>
            <h1 className="text-gray-500">{p.unit} / {p.categoryName}</h1>
            <h1 className="text-gray-500">
              <span> {p.changeDir == "up" ? "গতকালের তুলনায় আজ দাম বেড়েছে   " : "গতকালের তুলনায় আজ দাম কমেছে   " }</span>
              <span>{fmtPrice(Math.abs(p.change))}</span>
              <span>%</span>
            </h1></div>
        </div>
        <div className="text-center bg-slate-200 text-gray-500 p-5 rounded-lg">
          <div>আজকের দাম</div>
          <div><span className="font-bold text-lg">{fmtPrice(p.price)}</span></div>
          <div>টাকা/{p.unit.split(" ")[1]}</div>
          <div className=  {p.changeDir == "up" ? "text-red-600" : "text-green-600"}> 
            {p.changeDir == "up" ? "▲  " : "▼  "}
            <span>{fmtPrice (Math.abs(p.change))}</span>
            <span>%</span>
          </div>
        </div>
      </div>



      {/* <div>
        <div className="text-5xl">{p.emoji}</div>
        <h1 className="text-3xl font-bold">{p.name}</h1>
        {p.slug && <p className="text-gray-600">{p.slug}</p>}

        <div className="flex items-start">
          <div>left</div>
          <div>right</div>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap"><span className="badge badge-outline">{p.category}</span><span className="badge badge-outline">{p.unit}</span><Badge c={p.change} /></div>
      </div> */}




      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{stat("সর্বনিম্ন", p.min)}{stat("সর্বোচ্চ", p.max)}{stat("গড়", p.avg)}{stat("আজকের দাম", p.price)}</div>
      {p.markets.length > 0 && <div className="bg-white border rounded-xl overflow-x-auto"><table className="table"><thead><tr><th>বাজার</th> <th>বিভাগ</th> <th>সর্বনিম্ন</th><th>সর্বাধিক</th> <th>গড়</th></tr></thead>
        <tbody>{p.markets.map((m, i) =>
          <tr key={i}>
            <td>{m.name}</td>
            <td>{m.division}</td>
            <td>{fmtPrice(m.min)} টাকা</td>
            <td>{fmtPrice(m.max)} টাকা</td>
            <td>{fmtPrice((m.min + m.max) / 2)} টাকা</td>
          </tr>

        )}
        </tbody>
      </table></div>}
    </div>
  );
}
