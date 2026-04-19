import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { CompanyProfile } from "@/types/company";
import type { EventType } from "@/components/shared/EventCard";

export interface CompanyDetail extends CompanyProfile {
  eventLinks?: {
    eventId: string;
    companyId: string;
    event: EventType;
  }[];
}

export function useCompany(companyId: string) {
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<CompanyDetail>>(`/companies/${companyId}`);
      setCompany(res.data);
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : "Failed to load company details";
      setError(message);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return {
    company,
    loading,
    error,
    refetch: fetchCompany,
  };
}
