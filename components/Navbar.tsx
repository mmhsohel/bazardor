
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useProducts, fmtPrice, toBn } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);


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


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const logout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("সাইন আউট সফল হয়েছে");
            router.replace("/");
          },
        },
      });
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-700">
              <Image
                src="/assets/images/logo.png"
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

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="btn btn-sm btn-ghost gap-2 sm:btn-md hover:bg-gray-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xl text-white font-semibold">
                  {(session as { user: { name: string } }).user.name.charAt(0).toLocaleUpperCase()}
                </div>  <span className="hidden text-sm sm:inline">
                  {(session as { user: { name: string } }).user.name}
                </span>
                <span className="text-xs">{profileOpen ? "▲" : "▼"}</span>
              </button>


              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                >
                  <div className="border-b border-gray-100 px-3 py-3">
                    <div className="truncate text-sm font-semibold text-gray-500">
                      {(session as { user: { name: string } }).user.name}
                    </div>

                    <div className="mt-1 truncate text-xs text-gray-500">
                      {(session as { user: { email: string } }).user.email}
                    </div>
                  </div>

                  
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    👤 প্রোফাইল
                  </Link>

                  <div className="my-1 border-t border-gray-100" />

                  {/* Sign out */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    ↩ সাইন আউট
                  </button>
                </div>
              )}

            </div>

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
