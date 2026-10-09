import Link from "next/link";
export default function NotFoundView({ msg = "পেজটি খুঁজে পাওয়া যায়নি" }: { msg?: string }) {
  return (
    <div className="text-center py-20"><div className="text-6xl">404</div><p className="my-4 text-lg">{msg}</p>
      <Link href="/" className="btn btn-success text-white">হোম পেজে ফিরে যান</Link></div>
  );
}
