"use client";
import { Sort } from "@/lib/api";
export default function SortSelect({ value, onChange }: { value: Sort; onChange: (s: Sort) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">সাজান:
      <select className="select select-bordered select-sm sm:select-md" value={value} onChange={e => onChange(e.target.value as Sort)}>
        <option value="default">ডিফল্ট</option>
        <option value="asc">দাম: কম থেকে বেশি</option>
        <option value="desc">দাম: বেশি থেকে কম</option>
      </select>
    </label>
  );
}
