
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser, useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();
    const { data: sessionData, isPending } = useSession();
    const session = sessionData as
        | { user: { name?: string | null; email?: string | null } }
        | null
        | undefined;


    const [name, setName] = useState("");


    const [savingName, setSavingName] = useState(false);

    
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


    useEffect(() => {
        if (session?.user) {
            setName(session.user.name ?? "");
        }
    }, [session]);

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/");
        }
    }, [isPending, session, router]);

    const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            toast.error("নাম লিখুন");
            return;
        }

        setSavingName(true);

        try {
            const result = await updateUser({ name: trimmedName });

            if (result.error) {
                toast.error(result.error.message || "নাম আপডেট করা যায়নি");
                return;
            }

            toast.success("নাম সফলভাবে আপডেট হয়েছে");
        } catch {
            toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setSavingName(false);
        }
    };


    if (isPending || !session) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-success" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        আমার প্রোফাইল
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </div>

                <div className="space-y-6">

                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-3 px-5">

                            <div className="flex items-center justify-start">
                                <div className="h-12 w-12 flex items-center justify-center mr-4  rounded-full bg-green-500 text-xl text-white font-semibold"> <span className="text-4xl items-center">  {(session as { user: { name: string } }).user.name.charAt(0).toLocaleUpperCase()}</span></div>
                                <div> <h2 className="font-semibold text-2xl text-gray-900">{session.user.name}</h2>
                                    <p>{session.user.email}</p></div>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={logout}
                                    className="block w-full rounded-md px-3 py-2 text-left text-lg border-2 border-red-600 text-red-600 hover:bg-red-50"
                                >
                                    ↩ সাইন আউট
                                </button>
                            </div>
                        </div>

                    </section>




                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    নাম হালনাগাদ করুন                </h2>
                            </div>
                        </div>
                        <form onSubmit={handleUpdateName} className="space-y-4">
                            <div>

                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    আপনার নাম
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="আপনার নাম লিখুন"
                                    autoComplete="name"
                                    required
                                    maxLength={100}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={savingName || !name.trim()}
                                className="btn btn-success text-white"
                            >
                                {savingName ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        আপডেট হচ্ছে...
                                    </>
                                ) : (
                                    "নাম হালনাগাদ করুন"
                                )}
                            </button>
                        </form>
                    </section>

                </div>
            </div>
        </main>
    );
}
