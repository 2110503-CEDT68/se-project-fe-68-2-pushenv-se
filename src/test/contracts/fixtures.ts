export type UserRole = "jobSeeker" | "companyUser" | "systemAdmin";

export type ContractUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContractCompany = {
  id: string;
  companyUserId: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContractEvent = {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  banner: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ContractState = {
  users: ContractUser[];
  companies: ContractCompany[];
  events: ContractEvent[];
  eventCompanies: Array<{ eventId: string; companyId: string }>;
  registrations: Array<{
    id: string;
    eventId: string;
    jobSeekerId: string;
    registeredAt: string;
  }>;
};

const jsonToBase64 = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64");

export function makeToken(payload: { id: string; role: UserRole }) {
  return `${jsonToBase64({ alg: "none", typ: "JWT" })}.${jsonToBase64(payload)}.signature`;
}

export function makeSuccess<T>(message: string, data: T) {
  return { success: true, message, data };
}

export function makeError(message: string) {
  return { success: false, message };
}

export function createInitialContractState(): ContractState {
  return {
    users: [
      {
        id: "job-seeker-1",
        name: "Jane Jobseeker",
        email: "jane@example.com",
        role: "jobSeeker",
        password: "password123",
        phone: "0812345678",
        avatar: "/uploads/avatars/jane.png",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-02T00:00:00.000Z",
      },
      {
        id: "company-user-1",
        name: "Tech Corp",
        email: "hr@techcorp.com",
        role: "companyUser",
        password: "password123",
        phone: "0899999999",
        avatar: "/uploads/avatars/tech-corp.png",
        createdAt: "2025-01-03T00:00:00.000Z",
        updatedAt: "2025-01-04T00:00:00.000Z",
      },
      {
        id: "admin-1",
        name: "System Admin",
        email: "admin@example.com",
        role: "systemAdmin",
        password: "password123",
        phone: null,
        avatar: null,
        createdAt: "2025-01-05T00:00:00.000Z",
        updatedAt: "2025-01-06T00:00:00.000Z",
      },
    ],
    companies: [
      {
        id: "company-1",
        companyUserId: "company-user-1",
        description: "We build production software",
        logo: "/uploads/logos/company-1.png",
        website: "techcorp.com",
        createdAt: "2025-01-03T00:00:00.000Z",
        updatedAt: "2025-01-04T00:00:00.000Z",
      },
    ],
    events: [
      {
        id: "event-1",
        name: "SE2 Job Fair",
        description: "A published event for testing",
        location: "Bangkok",
        startDate: "2025-06-01T09:00:00.000Z",
        endDate: "2025-06-01T17:00:00.000Z",
        banner: "/uploads/event-banners/event-1.png",
        isPublished: true,
        createdAt: "2025-02-01T00:00:00.000Z",
        updatedAt: "2025-02-02T00:00:00.000Z",
        createdBy: "admin-1",
      },
      {
        id: "event-2",
        name: "Draft Event",
        description: "An unpublished event",
        location: "Chiang Mai",
        startDate: "2025-07-01T09:00:00.000Z",
        endDate: "2025-07-01T17:00:00.000Z",
        banner: null,
        isPublished: false,
        createdAt: "2025-02-03T00:00:00.000Z",
        updatedAt: "2025-02-04T00:00:00.000Z",
        createdBy: "admin-1",
      },
    ],
    eventCompanies: [{ eventId: "event-1", companyId: "company-1" }],
    registrations: [],
  };
}
