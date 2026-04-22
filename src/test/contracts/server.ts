import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  createInitialContractState,
  makeError,
  makeSuccess,
  makeToken,
  type ContractCompany,
  type ContractState,
  type ContractUser,
  type UserRole,
} from "./fixtures";

const API_BASE = "http://localhost:4000/api/v1";

export let contractState: ContractState = createInitialContractState();

export function resetContractState() {
  contractState = createInitialContractState();
}

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const withCounts = (eventId: string) => {
  const event = contractState.events.find(item => item.id === eventId);
  if (!event) return null;

  return {
    ...event,
    _count: {
      registrations: contractState.registrations.filter(
        item => item.eventId === eventId,
      ).length,
      companies: contractState.eventCompanies.filter(
        item => item.eventId === eventId,
      ).length,
    },
  };
};

const getUserById = (id: string) =>
  contractState.users.find(user => user.id === id) ?? null;

const getCompanyByUserId = (companyUserId: string) =>
  contractState.companies.find(company => company.companyUserId === companyUserId) ??
  null;

const getCompanyById = (id: string) =>
  contractState.companies.find(company => company.id === id) ?? null;

const decodeToken = (value: string) => {
  try {
    const [, payload] = value.split(".");
    if (!payload) return null;

    const json = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");

    return JSON.parse(json) as { id: string; role: UserRole };
  } catch {
    return null;
  }
};

const getAuthorizedUser = (request: Request) => {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const payload = decodeToken(header.slice("Bearer ".length));
  if (!payload) return null;

  const user = getUserById(payload.id);
  if (!user) return null;

  return user;
};

const unauthorized = () =>
  HttpResponse.json(makeError("Unauthorized"), { status: 401 });

const forbidden = () =>
  HttpResponse.json(makeError("Forbidden"), { status: 403 });

const jsonOrFormData = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    return request.formData();
  }

  if (contentType.includes("application/json")) {
    return request.json();
  }

  return null;
};

const paginate = <T>(items: T[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const sliced = items.slice(start, start + limit);

  return {
    data: sliced,
    total: items.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(items.length / limit)),
  };
};

const requireRole = (request: Request, roles: UserRole[]) => {
  const user = getAuthorizedUser(request);
  if (!user) return { error: unauthorized() };
  if (!roles.includes(user.role)) return { error: forbidden() };
  return { user };
};

function companyResponse(company: ContractCompany) {
  const companyUser = getUserById(company.companyUserId);
  if (!companyUser) return null;

  return {
    ...company,
    companyUser: {
      id: companyUser.id,
      name: companyUser.name,
      email: companyUser.email,
      avatar: companyUser.avatar,
      phone: companyUser.phone,
    },
  };
}

export const handlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password) {
      return HttpResponse.json(makeError("Missing required fields"), {
        status: 400,
      });
    }

    const user = contractState.users.find(item => item.email === body.email);
    if (!user || user.password !== body.password) {
      return HttpResponse.json(makeError("Invalid credentials"), {
        status: 401,
      });
    }

    return HttpResponse.json(
      makeSuccess("Login successful", {
        token: makeToken({ id: user.id, role: user.role }),
      }),
    );
  }),

  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    if (!body.name || !body.email || !body.password || !body.role) {
      return HttpResponse.json(makeError("Missing required fields"), {
        status: 400,
      });
    }

    if (body.role !== "jobSeeker") {
      return HttpResponse.json(makeError("Invalid role"), { status: 400 });
    }

    const existing = contractState.users.find(item => item.email === body.email);
    if (existing) {
      return HttpResponse.json(makeError("Email already in use"), {
        status: 409,
      });
    }

    const id = createId("job-seeker");
    const now = new Date().toISOString();
    contractState.users.push({
      id,
      name: body.name,
      email: body.email,
      password: body.password,
      role: "jobSeeker",
      phone: null,
      avatar: null,
      createdAt: now,
      updatedAt: now,
    });

    return HttpResponse.json(
      makeSuccess("Registered successfully", {
        token: makeToken({ id, role: "jobSeeker" }),
      }),
      { status: 201 },
    );
  }),

  http.get(`${API_BASE}/auth/me`, ({ request }) => {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();

    return HttpResponse.json(
      makeSuccess("Profile", {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      }),
    );
  }),

  http.put(`${API_BASE}/auth/me`, async ({ request }) => {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();

    const body = await jsonOrFormData(request);

    if (body instanceof FormData) {
      const avatar = body.get("avatar");
      if (!avatar) {
        return HttpResponse.json(makeError("Server error"), { status: 500 });
      }

      user.avatar = `/uploads/avatars/${createId("avatar")}.png`;
    } else if (body && typeof body === "object") {
      const { name, phone } = body as { name?: string; phone?: string };

      if (name !== undefined && name.trim() === "") {
        return HttpResponse.json(makeError("Name cannot be empty"), {
          status: 400,
        });
      }

      if (phone !== undefined && phone.trim() === "") {
        return HttpResponse.json(makeError("Phone cannot be empty"), {
          status: 400,
        });
      }

      if (name !== undefined) user.name = name;
      if (phone !== undefined) user.phone = phone;
    }

    user.updatedAt = new Date().toISOString();

    return HttpResponse.json(
      makeSuccess("Profile updated", {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      }),
    );
  }),

  http.post(`${API_BASE}/auth/change-password`, async ({ request }) => {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();

    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!body.currentPassword || !body.newPassword) {
      return HttpResponse.json(makeError("Missing fields"), { status: 400 });
    }

    if (body.newPassword.length < 6) {
      return HttpResponse.json(
        makeError("New password must be at least 6 characters"),
        { status: 400 },
      );
    }

    if (body.currentPassword !== user.password) {
      return HttpResponse.json(
        makeError("Current password is incorrect"),
        { status: 401 },
      );
    }

    user.password = body.newPassword;
    user.updatedAt = new Date().toISOString();
    return HttpResponse.json(makeSuccess("Password changed", null));
  }),

  http.post(`${API_BASE}/auth/logout`, ({ request }) => {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    return HttpResponse.json(makeSuccess("Logout successful", {}));
  }),

  http.delete(`${API_BASE}/users/me`, ({ request }) => {
    const auth = requireRole(request, ["jobSeeker"]);
    if (auth.error) return auth.error;

    const index = contractState.users.findIndex(item => item.id === auth.user.id);
    if (index === -1) {
      return HttpResponse.json(makeError("User not found"), { status: 404 });
    }

    contractState.users.splice(index, 1);
    contractState.registrations = contractState.registrations.filter(
      item => item.jobSeekerId !== auth.user.id,
    );

    return HttpResponse.json(makeSuccess("User deleted", null));
  }),

  http.get(`${API_BASE}/company/profile`, ({ request }) => {
    const auth = requireRole(request, ["companyUser"]);
    if (auth.error) return auth.error;

    const company = getCompanyByUserId(auth.user.id);
    if (!company) {
      return HttpResponse.json(makeError("Profile not found"), { status: 404 });
    }

    return HttpResponse.json(makeSuccess("Company profile", company));
  }),

  http.put(`${API_BASE}/company/profile`, async ({ request }) => {
    const auth = requireRole(request, ["companyUser"]);
    if (auth.error) return auth.error;

    const company = getCompanyByUserId(auth.user.id);
    if (!company) {
      return HttpResponse.json(makeError("Profile not found"), { status: 404 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      return HttpResponse.json(makeError("Server error"), { status: 500 });
    }

    const body = (await request.json()) as {
      description?: string;
      logo?: string;
      website?: string;
    };

    if (body.description !== undefined) company.description = body.description;
    if (body.logo !== undefined) company.logo = body.logo;
    if (body.website !== undefined) company.website = body.website;
    company.updatedAt = new Date().toISOString();

    return HttpResponse.json(makeSuccess("Profile updated", company));
  }),

  http.get(`${API_BASE}/companies`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? undefined;
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(url.searchParams.get("limit") ?? "10"));
    const sort = url.searchParams.get("sort") ?? undefined;

    let companies = contractState.companies
      .map(company => companyResponse(company))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (q) {
      const lower = q.toLowerCase();
      companies = companies.filter(item =>
        item.companyUser.name.toLowerCase().includes(lower),
      );
    }

    if (sort === "oldest") {
      companies.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    } else if (sort === "a-z") {
      companies.sort((a, b) => a.companyUser.name.localeCompare(b.companyUser.name));
    } else if (sort === "z-a") {
      companies.sort((a, b) => b.companyUser.name.localeCompare(a.companyUser.name));
    } else {
      companies.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    return HttpResponse.json(
      makeSuccess("Companies", paginate(companies, page, limit)),
    );
  }),

  http.get(`${API_BASE}/companies/:companyId`, ({ params }) => {
    const company = getCompanyById(String(params.companyId));
    if (!company) {
      return HttpResponse.json(makeError("Company not found"), { status: 404 });
    }

    const companyDetails = companyResponse(company);
    if (!companyDetails) {
      return HttpResponse.json(makeError("Company not found"), { status: 404 });
    }

    const eventLinks = contractState.eventCompanies
      .filter(link => link.companyId === company.id)
      .map(link => ({
        eventId: link.eventId,
        companyId: link.companyId,
        event: contractState.events.find(event => event.id === link.eventId),
      }))
      .filter(
        (
          item,
        ): item is {
          eventId: string;
          companyId: string;
          event: NonNullable<typeof item.event>;
        } => Boolean(item.event),
      );

    return HttpResponse.json(
      makeSuccess("Company", {
        ...companyDetails,
        eventLinks,
      }),
    );
  }),

  http.get(`${API_BASE}/events`, ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(url.searchParams.get("limit") ?? "20"));
    const search = url.searchParams.get("search")?.toLowerCase();

    let events = contractState.events.filter(event => event.isPublished);
    if (search) {
      events = events.filter(
        event =>
          event.name.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search),
      );
    }

    events.sort((a, b) => a.startDate.localeCompare(b.startDate));

    return HttpResponse.json(
      makeSuccess("Published events", {
        events: paginate(events, page, limit).data,
        total: events.length,
        page,
        limit,
      }),
    );
  }),

  http.get(`${API_BASE}/events/:id`, ({ params }) => {
    const event = contractState.events.find(item => item.id === String(params.id));
    if (!event || !event.isPublished) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    return HttpResponse.json(
      makeSuccess("Event details", withCounts(event.id)),
    );
  }),

  http.get(`${API_BASE}/events/:id/companies`, ({ params }) => {
    const event = contractState.events.find(item => item.id === String(params.id));
    if (!event) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    const companies = contractState.eventCompanies
      .filter(link => link.eventId === event.id)
      .map(link => getCompanyById(link.companyId))
      .filter((item): item is ContractCompany => Boolean(item))
      .map(company => companyResponse(company))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map(company => ({ company }));

    return HttpResponse.json(makeSuccess("Event companies", companies));
  }),

  http.get(`${API_BASE}/events/:id/registration-status`, ({ request, params }) => {
    const auth = requireRole(request, ["jobSeeker"]);
    if (auth.error) return auth.error;

    const event = contractState.events.find(item => item.id === String(params.id));
    if (!event) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    if (!event.isPublished) {
      return HttpResponse.json(makeError("Event not available"), {
        status: 403,
      });
    }

    const registered = contractState.registrations.some(
      item => item.eventId === event.id && item.jobSeekerId === auth.user.id,
    );

    return HttpResponse.json(
      makeSuccess("Event registration status", { registered }),
    );
  }),

  http.post(`${API_BASE}/events/:id/register`, ({ request, params }) => {
    const auth = requireRole(request, ["jobSeeker"]);
    if (auth.error) return auth.error;

    const event = contractState.events.find(item => item.id === String(params.id));
    if (!event) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    if (!event.isPublished) {
      return HttpResponse.json(makeError("Event not available"), {
        status: 403,
      });
    }

    const existing = contractState.registrations.find(
      item => item.eventId === event.id && item.jobSeekerId === auth.user.id,
    );
    if (existing) {
      return HttpResponse.json(makeError("Already registered for this event"), {
        status: 409,
      });
    }

    const registration = {
      id: createId("registration"),
      eventId: event.id,
      jobSeekerId: auth.user.id,
      registeredAt: new Date().toISOString(),
    };
    contractState.registrations.push(registration);

    return HttpResponse.json(
      makeSuccess("Registered for event", registration),
      { status: 201 },
    );
  }),

  http.get(`${API_BASE}/admin/accounts`, ({ request }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const url = new URL(request.url);
    const name = url.searchParams.get("name")?.toLowerCase();
    const role = url.searchParams.get("role");
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(url.searchParams.get("limit") ?? "10"));

    let users = [...contractState.users];

    if (role) {
      users = users.filter(item => item.role === role);
    }
    if (name) {
      users = users.filter(item => item.name.toLowerCase().includes(name));
    }

    users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return HttpResponse.json(
      makeSuccess(
        "All accounts",
        paginate(
          users.map(user => {
            const { password: _password, ...safeUser } = user;
            return safeUser;
          }),
          page,
          limit,
        ),
      ),
    );
  }),

  http.post(`${API_BASE}/admin/accounts`, async ({ request }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    if (!body.name || !body.email || !body.password || !body.role) {
      return HttpResponse.json(makeError("Missing required fields"), {
        status: 400,
      });
    }

    if (!["companyUser", "jobSeeker"].includes(body.role)) {
      return HttpResponse.json(makeError("Invalid role"), { status: 400 });
    }

    if (contractState.users.some(item => item.email === body.email)) {
      return HttpResponse.json(makeError("Email already in use"), {
        status: 409,
      });
    }

    const now = new Date().toISOString();
    const id = createId("user");
    const user: ContractUser = {
      id,
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role as UserRole,
      phone: null,
      avatar: null,
      createdAt: now,
      updatedAt: now,
    };
    contractState.users.push(user);

    if (user.role === "companyUser") {
      contractState.companies.push({
        id: createId("company"),
        companyUserId: user.id,
        description: null,
        logo: null,
        website: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    return HttpResponse.json(
      makeSuccess("Account created", {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      { status: 201 },
    );
  }),

  http.put(`${API_BASE}/admin/accounts/:id`, async ({ request, params }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const user = getUserById(String(params.id));
    if (!user) {
      return HttpResponse.json(makeError("Account not found"), { status: 404 });
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    };

    if (
      body.email &&
      body.email !== user.email &&
      contractState.users.some(item => item.email === body.email)
    ) {
      return HttpResponse.json(makeError("Email already in use"), {
        status: 409,
      });
    }

    if (body.name !== undefined) user.name = body.name;
    if (body.email !== undefined) user.email = body.email;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.password !== undefined) user.password = body.password;
    user.updatedAt = new Date().toISOString();

    const { password: _password, ...safeUser } = user;
    return HttpResponse.json(makeSuccess("Account updated", safeUser));
  }),

  http.delete(`${API_BASE}/admin/accounts/:id`, ({ request, params }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const id = String(params.id);
    if (auth.user.id === id) {
      return HttpResponse.json(makeError("Cannot delete your own account"), {
        status: 400,
      });
    }

    const index = contractState.users.findIndex(item => item.id === id);
    if (index === -1) {
      return HttpResponse.json(makeError("Account not found"), { status: 404 });
    }

    contractState.users.splice(index, 1);

    const company = getCompanyByUserId(id);
    if (company) {
      contractState.companies = contractState.companies.filter(
        item => item.companyUserId !== id,
      );
      contractState.eventCompanies = contractState.eventCompanies.filter(
        item => item.companyId !== company.id,
      );
    }

    return HttpResponse.json(makeSuccess("Account deleted", null));
  }),

  http.get(`${API_BASE}/admin/companies`, ({ request }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const url = new URL(request.url);
    const name = url.searchParams.get("name")?.toLowerCase();
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(url.searchParams.get("limit") ?? "10"));

    let companies = contractState.companies
      .map(company => {
        const response = companyResponse(company);
        if (!response) return null;
        return {
          ...response,
          _count: {
            jobs: 0,
          },
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (name) {
      companies = companies.filter(item =>
        item.companyUser.name.toLowerCase().includes(name),
      );
    }

    companies.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return HttpResponse.json(
      makeSuccess("All companies", paginate(companies, page, limit)),
    );
  }),

  http.put(`${API_BASE}/admin/companies/:id`, async ({ request, params }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const company = getCompanyById(String(params.id));
    if (!company) {
      return HttpResponse.json(makeError("Company not found"), { status: 404 });
    }

    const body = (await request.json()) as {
      description?: string;
      website?: string;
    };

    if (body.description !== undefined) company.description = body.description;
    if (body.website !== undefined) company.website = body.website;
    company.updatedAt = new Date().toISOString();

    return HttpResponse.json(makeSuccess("Company updated", company));
  }),

  http.get(`${API_BASE}/admin/events`, ({ request }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const url = new URL(request.url);
    const name = url.searchParams.get("name")?.toLowerCase();
    const date = url.searchParams.get("date");
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(url.searchParams.get("limit") ?? "10"));

    let events = contractState.events.map(event => withCounts(event.id)).filter(
      (item): item is NonNullable<typeof item> => Boolean(item),
    );

    if (name) {
      events = events.filter(item => item.name.toLowerCase().includes(name));
    }
    if (date) {
      events = events.filter(item => item.startDate.startsWith(date));
    }

    events.sort((a, b) => a.startDate.localeCompare(b.startDate));

    return HttpResponse.json(
      makeSuccess("All events", paginate(events, page, limit)),
    );
  }),

  http.post(`${API_BASE}/admin/events`, async ({ request }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const body = (await request.json()) as {
      name?: string;
      description?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      banner?: string | null;
    };

    if (
      !body.name ||
      !body.description ||
      !body.location ||
      !body.startDate ||
      !body.endDate
    ) {
      return HttpResponse.json(makeError("Missing required fields"), {
        status: 400,
      });
    }

    const now = new Date().toISOString();
    const event = {
      id: createId("event"),
      name: body.name,
      description: body.description,
      location: body.location,
      startDate: new Date(body.startDate).toISOString(),
      endDate: new Date(body.endDate).toISOString(),
      banner: body.banner ?? null,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
      createdBy: auth.user.id,
    };
    contractState.events.push(event);

    return HttpResponse.json(makeSuccess("Event created", event), {
      status: 201,
    });
  }),

  http.put(`${API_BASE}/admin/events/:id`, async ({ request, params }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const event = contractState.events.find(item => item.id === String(params.id));
    if (!event) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    const body = (await request.json()) as Partial<typeof event>;

    if (body.name !== undefined) event.name = body.name;
    if (body.description !== undefined) event.description = body.description;
    if (body.location !== undefined) event.location = body.location;
    if (body.startDate !== undefined) {
      event.startDate = new Date(body.startDate).toISOString();
    }
    if (body.endDate !== undefined) {
      event.endDate = new Date(body.endDate).toISOString();
    }
    if (body.banner !== undefined) event.banner = body.banner;
    event.updatedAt = new Date().toISOString();

    return HttpResponse.json(makeSuccess("Event updated", event));
  }),

  http.delete(`${API_BASE}/admin/events/:id`, ({ request, params }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const id = String(params.id);
    const index = contractState.events.findIndex(item => item.id === id);
    if (index === -1) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    contractState.events.splice(index, 1);
    contractState.eventCompanies = contractState.eventCompanies.filter(
      item => item.eventId !== id,
    );
    contractState.registrations = contractState.registrations.filter(
      item => item.eventId !== id,
    );

    return HttpResponse.json(makeSuccess("Event deleted", null));
  }),

  http.patch(`${API_BASE}/admin/events/:id/publish`, ({ request, params }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const event = contractState.events.find(item => item.id === String(params.id));
    if (!event) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    event.isPublished = !event.isPublished;
    event.updatedAt = new Date().toISOString();

    return HttpResponse.json(
      makeSuccess(
        event.isPublished ? "Event published" : "Event unpublished",
        event,
      ),
    );
  }),

  http.post(`${API_BASE}/admin/events/:id/companies`, async ({ request, params }) => {
    const auth = requireRole(request, ["systemAdmin"]);
    if (auth.error) return auth.error;

    const body = (await request.json()) as { companyId?: string };
    if (!body.companyId) {
      return HttpResponse.json(makeError("companyId is required"), {
        status: 400,
      });
    }

    const event = contractState.events.find(item => item.id === String(params.id));
    if (!event) {
      return HttpResponse.json(makeError("Event not found"), { status: 404 });
    }

    if (!getCompanyById(body.companyId)) {
      return HttpResponse.json(makeError("Company not found"), { status: 404 });
    }

    if (
      contractState.eventCompanies.some(
        item => item.eventId === event.id && item.companyId === body.companyId,
      )
    ) {
      return HttpResponse.json(
        makeError("Company is already linked to this event"),
        { status: 409 },
      );
    }

    const link = { eventId: event.id, companyId: body.companyId };
    contractState.eventCompanies.push(link);

    return HttpResponse.json(makeSuccess("Company added to event", link), {
      status: 201,
    });
  }),

  http.delete(
    `${API_BASE}/admin/events/:id/companies/:companyId`,
    ({ request, params }) => {
      const auth = requireRole(request, ["systemAdmin"]);
      if (auth.error) return auth.error;

      const eventId = String(params.id);
      const companyId = String(params.companyId);
      const existing = contractState.eventCompanies.find(
        item => item.eventId === eventId && item.companyId === companyId,
      );

      if (!existing) {
        return HttpResponse.json(
          makeError("Company is not linked to this event"),
          { status: 404 },
        );
      }

      contractState.eventCompanies = contractState.eventCompanies.filter(
        item => !(item.eventId === eventId && item.companyId === companyId),
      );

      return HttpResponse.json(
        makeSuccess("Company removed from event", null),
      );
    },
  ),
];

export const server = setupServer(...handlers);
