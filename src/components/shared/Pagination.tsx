"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  basePath?: string;
}

export default function Pagination({ total, limit, currentPage, basePath = "/events" }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${basePath}?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Always show page 1
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
          currentPage === 1 ? "border-slate-300 bg-white" : "border-transparent text-slate-600 hover:bg-slate-50"
        } font-medium text-sm transition-all`}
      >
        1
      </button>
    );

    if (totalPages <= maxVisiblePages) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
              currentPage === i ? "border-slate-300 bg-white" : "border-transparent text-slate-600 hover:bg-slate-50"
            } font-medium text-sm transition-all`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Logic for "..." elipsis
      if (currentPage > 3) {
        pages.push(<span key="dots-start" className="px-2 text-slate-400">...</span>);
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i === 1 || i === totalPages) continue;
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
              currentPage === i ? "border-slate-300 bg-white" : "border-transparent text-slate-600 hover:bg-slate-50"
            } font-medium text-sm transition-all`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="dots-end" className="px-2 text-slate-400">...</span>);
      }

      // Always show last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
            currentPage === totalPages ? "border-slate-300 bg-white" : "border-transparent text-slate-600 hover:bg-slate-50"
          } font-medium text-sm transition-all`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4 py-8 select-none">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 text-slate-600 font-medium hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      
      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 text-slate-600 font-medium hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
