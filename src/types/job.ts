export interface JobListing {
  id: string;
  title: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  location: string;
  description?: string;
  requirements?: string;
  qualifications?: string;
  salary?: string;
  attachment?: string;
  isClosed: boolean;
  createdAt: string;
}
