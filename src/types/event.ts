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
