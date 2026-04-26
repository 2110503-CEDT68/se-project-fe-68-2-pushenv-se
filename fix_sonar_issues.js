const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(public)/events/[id]/page.tsx',
  'src/app/admin/companies/[id]/page.tsx',
  'src/app/admin/events/[id]/page.tsx',
  'src/app/admin/layout.tsx',
  'src/app/admin/users/[id]/page.tsx',
  'src/app/companies/[id]/page.tsx',
  'src/app/events/page.tsx',
  'src/components/admin/AdminLayoutShell.tsx',
  'src/components/admin/admin-ui.tsx',
  'src/components/layout/Navbar.tsx',
  'src/components/providers/AppProviders.tsx',
  'src/components/shared/AdminCompanyDetailPage.tsx',
  'src/components/shared/AdminEventDetailPage.tsx',
  'src/components/shared/AdminUserDetailPage.tsx',
  'src/components/shared/CompanyCard.tsx',
  'src/components/shared/CompanyManagementPage.tsx',
  'src/components/shared/CompanyProfile.tsx',
  'src/components/shared/CompanySearchModal.tsx',
  'src/components/shared/CompanyTableView.tsx',
  'src/components/shared/ConfirmModal.tsx',
  'src/components/shared/EventCard.tsx',
  'src/components/shared/EventModals/CreateModal.tsx',
  'src/components/shared/EventModals/DeleteModal.tsx',
  'src/components/shared/EventModals/EditModal.tsx',
  'src/components/shared/EventSearch.tsx',
  'src/components/shared/EventTableView.tsx',
  'src/components/shared/ExplorerToolbar.tsx',
  'src/components/shared/Pagination.tsx',
  'src/components/shared/ProfilePage.tsx',
  'src/components/shared/PublicEventDetailPage.tsx',
  'src/components/shared/RegisterForm.tsx',
  'src/components/shared/UserManagementPage.tsx',
  'src/components/ui/form.tsx',
  'src/lib/api.ts',
  'src/lib/auth.ts',
  'src/lib/utils.ts'
];

for (const filePath of files) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  // Fix window -> globalThis.window
  content = content.replace(/(?<!globalThis\.)\bwindow\b/g, 'globalThis.window');

  // Fix Props / Types
  // For page components that take props directly
  content = content.replace(/\{ params \}: \{ params: \{ id: string \} \}/g, '{ params }: Readonly<{ params: { id: string } }>');
  content = content.replace(/\{ params \}: \{ params: Promise<\{ id: string \}> \}/g, '{ params }: Readonly<{ params: Promise<{ id: string }> }>');
  content = content.replace(/\{ children \}: \{ children: React\.ReactNode \}/g, '{ children }: Readonly<{ children: React.ReactNode }>');
  content = content.replace(/\{ searchParams \}: \{ searchParams: \{ \[key: string\]: string \| string\[\] \| undefined \} \}/g, '{ searchParams }: Readonly<{ searchParams: { [key: string]: string | string[] | undefined } }>');
  
  // Custom props interfaces/types inline
  content = content.replace(/}: Props\)/g, '}: Readonly<Props>)');
  content = content.replace(/}: Props \{/g, '}: Readonly<Props> {');
  content = content.replace(/}: (\w+Props)\)/g, '}: Readonly<$1>)');

  // Negated conditions fixes (simple cases only)
  // We'll skip negated condition fixes here and do it manually if needed, it's safer.
  // We also had "This assertion is unnecessary since the receiver accepts the original type of the expression."
  // in AdminEventDetailPage line 540. Let's check that manually.

  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', filePath);
  }
}
