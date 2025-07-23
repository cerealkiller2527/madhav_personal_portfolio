import { LogoSpinnerOverlay } from "@/components/common/ui/logo-spinner"

export default function Loading() {
  // This loading component will be shown via Suspense while data is being fetched.
  return <LogoSpinnerOverlay />
}
