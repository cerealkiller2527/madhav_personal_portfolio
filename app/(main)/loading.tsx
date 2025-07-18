import { LoadingScreen } from "@/components/ui/loading-screen"

export default function Loading() {
  // This loading component will be shown via Suspense while data is being fetched.
  return <LoadingScreen />
}
