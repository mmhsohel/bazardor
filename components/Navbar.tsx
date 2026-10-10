
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useProducts, fmtPrice, toBn } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";

const bnDate = () =>
  new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();

  const { data: session } = useSession();
  const { data } = useProducts();

  console.log("products data for navbar", data)

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

  console.log("cats",);

  const logout = async () => {
    await signOut({});
    toast.success("সাইন আউট সফল হয়েছে");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/">
          <div className="flex items-center justify-between gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
              <Image
                src="/assets/images/logo-icon.png"
                alt="Bazar logo"
                width={24}
                height={24}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-extrabold text-md">বাজার দর</div>
              <div className="text-sm text-gray-400">{bnDate()}</div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden text-sm sm:inline">
                👤 {(session as { user: { name: string } }).user.name}
              </span>

              <button
                onClick={logout}
                className="btn btn-sm btn-outline sm:btn-md"
              >
                সাইন আউট
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-sm btn-ghost sm:btn-md"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="btn btn-sm btn-success text-white sm:btn-md"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-2">
        <Link
          href="/"
          className={`btn btn-sm ${path === "/" ? "btn-success text-white" : "btn-ghost"
            }`}
        >
          হোম
        </Link>

        {cats.map((p) => {
          const href = `/category/${encodeURIComponent(p.category)}`;

          return (
            <Link
              key={p.category}
              href={href}
              className={`btn btn-sm whitespace-nowrap ${decodeURIComponent(path) === `/category/${p.category}`
                ? "btn-success text-white"
                : "btn-ghost"
                }`}
            >
              <span>
                {p.categoryIcon} {p.categoryName}
              </span>
            </Link>
          );
        })}
      </nav>

      {data && data.length > 0 && (
        <div className="overflow-hidden border-t bg-green-50 py-1.5 text-sm">
          <div className="marquee">
            {[...data, ...data].map((p, i) => (
              <span key={i} className="mx-4 whitespace-nowrap">
                {p.emoji} {p.name} {fmtPrice(p.price)} টাকা
                {p.unit && `/${p.unit.replace("প্রতি ", "")}`}{" "}
                <b
                  className={
                    p.change > 0
                      ? "text-red-600"
                      : p.change < 0
                        ? "text-green-600"
                        : "text-gray-500"
                  }
                >
                  {p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"}{" "}
                  {toBn(Math.abs(p.change))}%
                </b>
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
