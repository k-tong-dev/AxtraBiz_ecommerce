export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top-right,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_bottom-left,rgba(59,130,246,0.15),transparent_35%)]">
      {children}
    </div>
  )
}
