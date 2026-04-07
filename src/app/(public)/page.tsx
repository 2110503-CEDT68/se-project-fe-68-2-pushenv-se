import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Students and applicants",
    body: "Browse published events, register once, and manage a personal profile.",
  },
  {
    title: "Companies",
    body: "Maintain a public profile, join fairs, and publish hiring opportunities.",
  },
  {
    title: "Admins",
    body: "Run the platform, manage accounts, publish events, and moderate listings.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <section className="grid gap-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/90 p-10 shadow-sm md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
              Job Fair Platform
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Connect students, companies, and event organizers in one hiring workflow.
            </h1>
            <p className="max-w-xl text-base text-[var(--muted-foreground)]">
              This scaffold follows the supplied specification: public auth pages, role-based
              dashboards, typed API helpers, and shared UI building blocks.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)]"
                href="/register"
              >
                Register
              </a>
              <a
                className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold"
                href="/login"
              >
                Login
              </a>
            </div>
          </div>
          <Card className="grid gap-4 bg-stone-950 text-stone-50">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-300">Upcoming events</p>
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">Career Launch Week</p>
                <p className="text-sm text-stone-300">Preview slot for `useEvents({` limit: 3 `})`.</p>
              </div>
              <div className="rounded-2xl border border-dashed border-white/20 p-4 text-sm text-stone-300">
                API integration is ready to be wired to the backend at `NEXT_PUBLIC_API_URL`.
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{feature.body}</p>
            </Card>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
