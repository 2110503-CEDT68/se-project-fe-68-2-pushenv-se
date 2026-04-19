export interface CompanyProfile {
  id: string;
  companyUserId: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  createdAt: string;
  updatedAt: string;
  companyUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    phone?: string | null;
  };
}

export interface Company {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  logo?: string | null;
}
