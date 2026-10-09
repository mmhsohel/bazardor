"use client";

import Link from "next/link";
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
    ? await signUp.email({
        name: f.name.trim(),
        email: f.email.trim(),
        password: f.password,
      })
    : await signIn.email({
        email: f.email.trim(),
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
try {
await signIn.social({
provider,
callbackURL: "/",
});
} catch {
toast.error("সোশ্যাল লগইন শুরু করা যায়নি");
}
};

return ( <div className="max-w-md mx-auto py-12"> <h1 className="text-2xl font-bold mb-4">
{isUp ? "সাইন আপ" : "সাইন ইন"} </h1>

  <form onSubmit={submit} className="space-y-3">
    {isUp && (
      <input
        required
        className="input input-bordered w-full"
        placeholder="নাম"
        autoComplete="name"
        value={f.name}
        onChange={(e) =>
          setF({ ...f, name: e.target.value })
        }
      />
    )}

    <input
      required
      type="email"
      className="input input-bordered w-full"
      placeholder="ইমেইল"
      autoComplete="email"
      value={f.email}
      onChange={(e) =>
        setF({ ...f, email: e.target.value })
      }
    />

    <input
      required
      type="password"
      minLength={8}
      className="input input-bordered w-full"
      placeholder="পাসওয়ার্ড"
      autoComplete={isUp ? "new-password" : "current-password"}
      value={f.password}
      onChange={(e) =>
        setF({ ...f, password: e.target.value })
      }
    />

    <button
      disabled={busy}
      className="btn btn-success text-white w-full"
      type="submit"
    >
      {busy
        ? "অপেক্ষা করুন..."
        : isUp
          ? "রেজিস্টার"
          : "সাইন ইন"}
    </button>
  </form>

  <div className="divider">অথবা</div>

  <div className="grid grid-cols-2 gap-2">
    <button
      type="button"
      onClick={() => social("google")}
      className="btn btn-outline"
    >
      Google
    </button>

    <button
      type="button"
      onClick={() => social("github")}
      className="btn btn-outline"
    >
      GitHub
    </button>
  </div>

  <p className="text-center mt-4 text-sm">
    {isUp ? (
      <Link className="link" href="/signin">
        অ্যাকাউন্ট আছে? সাইন ইন করুন
      </Link>
    ) : (
      <Link className="link" href="/signup">
        অ্যাকাউন্ট নেই? সাইন আপ করুন
      </Link>
    )}
  </p>
</div>

);
}
