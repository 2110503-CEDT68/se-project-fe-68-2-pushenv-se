import { AuthCard } from "@/components/shared/AuthCard";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Register"
      description="Public self-registration scaffold for user accounts."
      fields={["Name", "Email", "Password", "Confirm Password"]}
      footerLink={{ href: "/login", label: "Already have an account?" }}
    />
  );
}
