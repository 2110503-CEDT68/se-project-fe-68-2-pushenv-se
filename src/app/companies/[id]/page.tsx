"use client";

import { useCompany } from "@/hooks/company/useCompany";
import EventCard from "@/components/shared/EventCard";
import { use } from "react";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { company, loading, error } = useCompany(id);

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex justify-center items-center font-sans">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="w-full py-20 text-center text-red-500 font-sans text-xl">
        {error || "Company not found."}
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col items-center font-sans pb-24">
      <div className="w-full max-w-[1200px] mt-12 px-6 mx-auto flex flex-col gap-10">
        {/* Company Details */}
        <section className="flex flex-col gap-8 w-full">
          {/* Logo and Title */}
          <div className="flex items-center gap-10">
            <div className="w-[120px] h-[120px] rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm flex items-center justify-center">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.companyUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 font-medium">No Logo</span>
              )}
            </div>
            <h2 className="text-[30px] font-semibold text-black leading-tight">
              {company.companyUser.name}
            </h2>
          </div>

          {/* Info Grid */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {/* <div className="flex flex-col gap-1">
              <span className="text-[#525252] text-[16px] font-normal">ID</span>
              <span className="text-black text-[20px] font-medium">
                {company.id}
              </span>
            </div> */}
            <div className="flex flex-col gap-1">
              <span className="text-[#525252] text-[16px] font-normal">
                Email
              </span>
              <span className="text-black text-[20px] font-medium">
                {company.companyUser.email}
              </span>
            </div>
            {company.companyUser.phone && (
              <div className="flex flex-col gap-1">
                <span className="text-[#525252] text-[16px] font-normal">
                  Phone
                </span>
                <span className="text-black text-[20px] font-medium">
                  {company.companyUser.phone}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[#525252] text-[16px] font-normal">
                Website
              </span>
              {company.website ? (
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black text-[20px] font-medium hover:underline break-all"
                >
                  {company.website}
                </a>
              ) : (
                <span className="text-black text-[20px] font-medium italic opacity-50">
                  Not Available
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[20px] font-semibold text-black">
              Description
            </h4>
            <p className="text-[#525252] text-[16px] font-normal leading-relaxed whitespace-pre-line max-w-4xl">
              {company.description || "No description provided."}
            </p>
          </div>
        </section>

        {/* Participated Events */}
        <section className="flex flex-col mt-4">
          <h3 className="text-[24px] font-semibold text-center text-black mb-8">
            Participated Events
          </h3>
          {company.eventLinks && company.eventLinks.length > 0 ? (
            <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto">
              {company.eventLinks.map(({ event }) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="w-full py-10 text-center text-slate-400 italic font-sans text-lg">
              No participated events at the moment.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
