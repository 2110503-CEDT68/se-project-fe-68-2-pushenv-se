import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <Button variant="ghost" size="sm" className="w-fit mb-4 -ml-2" asChild>
          <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div className="rounded-2xl bg-background p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy and User Consent</h1>
          
          <div className="space-y-6 text-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly to us when you register for an account on the Job Fair platform. This includes your name, email address, password, and any additional profile information such as phone number and avatar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use the information we collect to operate, maintain, and provide the features and functionality of the Job Fair platform. This includes processing your registrations for events, facilitating connections with companies, and sending administrative communications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Share Your Information</h2>
              <p className="text-muted-foreground">
                When you register for a specific job fair event, your profile data may be shared with companies actively participating in that event to facilitate recruitment efforts. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Your Consent</h2>
              <p className="text-muted-foreground">
                By acknowledging this privacy policy and proceeding with registration, you consent to the data collection, utilization, and sharing practices described herein. You can withdraw your consent at any time by securely deleting your account via the settings page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures designed to protect your personal information against unauthorized access, disclosure, alteration, or destruction. However, please be aware that no security measure is entirely foolproof.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
