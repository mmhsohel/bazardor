
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

const isUp = false;

export default function Page() {
  const router = useRouter();

  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (busy) return;

    if (isUp && !f.name.trim()) {
      return toast.error("নাম দিন");
    }

    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      return toast.error("সঠিক ইমেইল দিন");
    }

    if (f.password.length < 8) {
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    }

    setBusy(true);

    try {
      const { error } = isUp
        ? await signUp.email(f)
        : await signIn.email({
            email: f.email,
            password: f.password,
          });

      if (error) {
        toast.error(error.message || "কিছু ভুল হয়েছে");
        return;
      }

      toast.success(
        isUp
          ? "রেজিস্ট্রেশন সফল! এখন সাইন ইন করুন"
          : "সাইন ইন সফল হয়েছে"
      );

      router.push(isUp ? "/signin" : "/");
    } catch {
      toast.error("সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না");
    } finally {
      setBusy(false);
    }
  };

  const social = async (provider: "google" | "github") => {
    if (busy) return;

    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.error("সোশ্যাল লগইন করা যাচ্ছে না");
    }
  };

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <section className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
        <div className="mb-7 space-y-2 text-center sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {isUp ? "সাইন আপ" : "সাইন ইন"}
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-6 text-base-content/60">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {isUp && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium"
              >
                নাম
              </label>

              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                className="input input-bordered w-full"
                placeholder="আপনার নাম"
                value={f.name}
                onChange={(e) =>
                  setF({ ...f, name: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium"
            >
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input input-bordered w-full"
              placeholder="আপনার ইমেইল"
              value={f.email}
              onChange={(e) =>
                setF({ ...f, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={
                isUp ? "new-password" : "current-password"
              }
              className="input input-bordered w-full"
              placeholder={
                isUp
                  ? "কমপক্ষে ৮ অক্ষর"
                  : "আপনার পাসওয়ার্ড"
              }
              value={f.password}
              onChange={(e) =>
                setF({ ...f, password: e.target.value })
              }
            />
          </div>

          {!isUp && (
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn btn-success min-h-12 w-full text-white"
          >
            {busy ? "অপেক্ষা করুন..." : isUp ? "সাইন আপ" : "সাইন ইন"}
          </button>
        </form>

        <div className="divider my-6 text-sm text-base-content/50">
          অথবা
        </div>

        <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
          <button
            type="button"
            onClick={() => social("google")}
            disabled={busy}
            className="btn btn-outline min-w-0 gap-2"
          >
            <Image
              src="/assets/images/googlelogo.jpg"
              alt=""
              width={20}
              height={20}
              className="shrink-0 rounded-full"
            />

            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => social("github")}
            disabled={busy}
            className="btn btn-outline min-w-0 gap-2"
          >
            <Image
              src="/assets/images/githublogo.jpg"
              alt=""
              width={20}
              height={20}
              className="shrink-0 rounded-full"
            />

            <span>GitHub</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm leading-6 text-base-content/70">
          {isUp ? "আগেই অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
          <Link
            href={isUp ? "/signin" : "/signup"}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {isUp ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>
      </section>
    </main>
  );
}
