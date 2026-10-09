
"use client";

import type { Sort } from "@/lib/api";

export default function SortSelect({
  value,
  onChange,
}: {
  value: Sort;
  onChange: (sort: Sort) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span>সাজান:</span>

      <select
        name="product-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as Sort)}
        className="select select-bordered select-sm sm:select-md"
      >
        <option value="default">ডিফল্ট</option>
        <option value="asc">দাম: কম থেকে বেশি</option>
        <option value="desc">দাম: বেশি থেকে কম</option>
      </select>
    </label>
  );
}

