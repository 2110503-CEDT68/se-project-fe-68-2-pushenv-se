export interface EventSummary {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  banner?: string;
  companyCount: number;
  isPublished?: boolean;
}

export type PublicEventSummary = {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  banner?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicEventCompany = {
  company: {
    id: string;
    description?: string | null;
    logo?: string | null;
    website?: string | null;
    companyUser: { name: string; email: string };
  };
};

export type PublishedEventsPayload = {
  events: PublicEventSummary[];
  total: number;
  page: number;
  limit: number;
};

export type EventRegistrationStatusPayload = {
  registered: boolean;
};

export type AuthTokenPayload = {
  role?: string;
};
