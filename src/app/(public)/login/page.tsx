import { AuthCard } from "@/components/shared/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard
      title="Login"
      description="Public sign-in route for user, company, and admin accounts."
      fields={["Email", "Password"]}
      footerLink={{ href: "/register", label: "Create an account" }}
    />
  );
}
