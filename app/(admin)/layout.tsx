import DashboardLayoutWrapper from '@/components/layouts/DashboardLayoutWrapper';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}