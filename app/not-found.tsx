"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFoundView() {
  const router = useRouter();

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-base-100 px-5 py-16">
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-error">
          Error 404
        </p>

        <h1 className="mt-4 text-7xl font-bold tracking-tight text-base-content sm:text-8xl">
          404
        </h1>

        <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-primary" />

        <h2 className="mt-6 text-2xl font-semibold text-base-content sm:text-3xl">
          Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-base-content/60 sm:text-base">
          Sorry, we couldn’t find the page you’re looking for. It may have been
          moved, deleted, or the URL might be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn btn-primary rounded-lg px-6"
          >
            Go to homepage
            <ArrowRight size={17} />
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost rounded-lg border border-base-300 px-6"
          >
            <ArrowLeft size={17} />
            Go back
          </button>
        </div>

        <p className="mt-12 text-xs text-base-content/40">
          If you believe this is an error, please try again later.
        </p>
      </section>
    </main>
  );
}