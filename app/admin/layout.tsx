// VanRoute Pro admin layout — no sidebar wrapper needed.
// The admin page handles its own full-page layout + AdminGate PIN protection.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
