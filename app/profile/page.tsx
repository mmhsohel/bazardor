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
        <main className="min-h-screen bg-gray-50 px-2 py-5 min-[360px]:px-4 min-[360px]:py-8 sm:py-10">
            <div className="mx-auto w-full max-w-2xl min-w-0">
                <div className="mb-5 min-[360px]:mb-8">
                    <h1 className="text-xl font-bold text-gray-900 min-[360px]:text-2xl">
                        আমার প্রোফাইল
                    </h1>
                    <p className="mt-2 text-xs text-gray-500 min-[360px]:text-sm">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </div>

                <div className="space-y-4 min-[360px]:space-y-6">
                    <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm min-[360px]:p-5 sm:p-6">
                        <div className="mb-4 flex min-w-0 flex-col items-stretch gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between min-[360px]:mb-5">
                            <div className="flex min-w-0 items-center gap-2 min-[360px]:gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-500 font-semibold text-white min-[360px]:h-12 min-[360px]:w-12">
                                    <span className="text-xl min-[360px]:text-2xl">
                                        {(session.user.name ?? "").charAt(0).toLocaleUpperCase()}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="break-words text-base font-semibold text-gray-900 min-[360px]:text-lg sm:text-2xl">
                                        {session.user.name}
                                    </h2>
                                    <p className="break-all text-xs text-gray-500 min-[360px]:text-sm">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full min-[420px]:w-auto min-[420px]:shrink-0">
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={logout}
                                    className="flex w-full items-center justify-center whitespace-nowrap rounded-md border-2 border-red-600 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 min-[420px]:w-auto min-[420px]:text-base"
                                >
                                    ↩ সাইন আউট
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm min-[360px]:p-5 sm:p-6">
                        <div className="mb-4 flex items-center gap-3 min-[360px]:mb-5">
                            <div className="min-w-0">
                                <h2 className="break-words text-base font-semibold text-gray-900 min-[360px]:text-lg">
                                    নাম হালনাগাদ করুন
                                </h2>
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
                                    className="input input-bordered w-full min-w-0 text-sm min-[360px]:text-base"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={savingName || !name.trim()}
                                className="btn btn-success min-h-10 h-auto w-full whitespace-normal px-3 py-2 text-sm text-white min-[420px]:w-auto min-[420px]:text-base"
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