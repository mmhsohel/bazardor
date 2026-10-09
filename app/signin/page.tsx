"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";
const isUp = false;
export default function Page() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUp && !f.name.trim()) return toast.error("নাম দিন");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("সঠিক ইমেইল দিন");
    if (f.password.length < 8) return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setBusy(true);
    const { error } = isUp ? await signUp.email(f) : await signIn.email({ email: f.email, password: f.password });
    setBusy(false);
    if (error) return toast.error(error.message || "কিছু ভুল হয়েছে");
    toast.success(isUp ? "রেজিস্ট্রেশন সফল! এখন সাইন ইন করুন" : "সাইন ইন সফল হয়েছে");
    router.push(isUp ? "/signin" : "/");
  };
  const social = (provider: "google" | "github") => signIn.social({ provider, callbackURL: "/" });
  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">সাইন ইন</h1>
      <form onSubmit={submit} className="space-y-3">
        {isUp && <input className="input input-bordered w-full" placeholder="নাম" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />}
        <input className="input input-bordered w-full" placeholder="ইমেইল" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
        <input type="password" className="input input-bordered w-full" placeholder="পাসওয়ার্ড" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
        <button disabled={busy} className="btn btn-success text-white w-full">{busy ? "অপেক্ষা করুন..." : "সাইন ইন"}</button>
      </form>
      <div className="divider">অথবা</div>
      <div className="grid grid-cols-2 gap-2"><button onClick={() => social("google")} className="btn btn-outline">Google</button><button onClick={() => social("github")} className="btn btn-outline">GitHub</button></div>
      <p className="text-center mt-4 text-sm"><Link className="link" href="/signup">অ্যাকাউন্ট নেই? সাইন আপ করুন</Link></p>
    </div>
  );
}
