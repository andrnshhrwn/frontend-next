import AdminLayout from "@/components/layouts/AdminLayout";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
