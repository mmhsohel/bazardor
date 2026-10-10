"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

const isUp = true;

export default function Page() {
  const router = useRouter();

  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (busy) return;

    if (isUp && !f.name.trim()) {
      return toast.error("নাম দিন");
    }

    const email = f.email.trim();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("সঠিক ইমেইল দিন");
    }

    if (f.password.length < 8) {
      return toast.error(
        "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"
      );
    }

    if (isUp && f.password !== f.confirmPassword) {
      return toast.error("পাসওয়ার্ড দুটি মিলছে না");
    }

    setBusy(true);

    try {
      const { error } = isUp
        ? await signUp.email({
            name: f.name.trim(),
            email,
            password: f.password,
          })
        : await signIn.email({
            email,
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
      toast.error("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি");
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
      toast.error("সোশ্যাল লগইন শুরু করা যায়নি");
    }
  };

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <section className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
        <header className="mb-7 space-y-2 text-center sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {isUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-6 text-base-content/60">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </header>

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
                required
                type="text"
                id="name"
                autoComplete="name"
                className="input input-bordered w-full"
                placeholder="যেমন: রহিম উদ্দিন"
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
              ই-মেইল
            </label>

            <input
              required
              type="email"
              id="email"
              autoComplete="email"
              className="input input-bordered w-full"
              placeholder="you@gmail.com"
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
              পাসওয়ার্ড
            </label>

            <input
              required
              type="password"
              id="password"
              minLength={8}
              autoComplete={
                isUp ? "new-password" : "current-password"
              }
              className="input input-bordered w-full"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={f.password}
              onChange={(e) =>
                setF({ ...f, password: e.target.value })
              }
            />
          </div>

          {isUp && (
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                required
                type="password"
                id="confirmPassword"
                minLength={8}
                autoComplete="new-password"
                aria-invalid={
                  !!f.confirmPassword &&
                  f.password !== f.confirmPassword
                }
                aria-describedby={
                  f.confirmPassword &&
                  f.password !== f.confirmPassword
                    ? "password-mismatch"
                    : undefined
                }
                className="input input-bordered w-full"
                placeholder="আবার পাসওয়ার্ড লিখুন"
                value={f.confirmPassword}
                onChange={(e) =>
                  setF({
                    ...f,
                    confirmPassword: e.target.value,
                  })
                }
              />

              {f.confirmPassword &&
                f.password !== f.confirmPassword && (
                  <p
                    id="password-mismatch"
                    className="text-sm text-error"
                    role="alert"
                  >
                    পাসওয়ার্ড দুটি মিলছে না।
                  </p>
                )}
            </div>
          )}

          <button
            disabled={busy}
            type="submit"
            className="btn btn-success min-h-12 w-full text-white"
          >
            {busy
              ? "অপেক্ষা করুন..."
              : isUp
                ? "অ্যাকাউন্ট তৈরি করুন"
                : "সাইন ইন"}
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
          {isUp ? (
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href="/signin"
            >
              অ্যাকাউন্ট আছে? সাইন ইন করুন
            </Link>
          ) : (
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href="/signup"
            >
              অ্যাকাউন্ট নেই? সাইন আপ করুন
            </Link>
          )}
        </p>
      </section>
    </main>
  );
}
