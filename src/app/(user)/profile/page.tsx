import { SpecPage } from "@/components/shared/SpecPage";

export default function UserProfilePage() {
  return (
    <SpecPage
      title="User Profile"
      route="/profile"
      summary="Own-profile page with avatar, account details, and edit navigation."
      bullets={["Bind to useMe()", "Show avatar, name, email, and phone", "Link to /profile/edit"]}
    />
  );
}
