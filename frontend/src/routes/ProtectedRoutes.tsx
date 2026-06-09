import LoadingSpinner from "@/components/custom/Loader";
import { useGetCurrentAdmin } from "@/hooks/useGetCurrentAdmin";
import { getAuthAdminToken } from "@/store/authAdminSlice";
import { useAppSelector } from "@/store/hooks";
import { Suspense } from "react";
import { Navigate } from "react-router-dom";



interface ChildrenProps {
  children: React.ReactNode;
}


// common
const LazyLoader = ({ children }: ChildrenProps) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);



export const GuestAdminRoutes = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthAdminToken)
  const { data: admin } = useGetCurrentAdmin()

  if (token && admin) {
    return <Navigate to={'/'} replace />
  }

  return <LazyLoader>{children}</LazyLoader>
}
export const AdminProtectedRoute = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthAdminToken)
  const { data: admin, isLoading } = useGetCurrentAdmin()

  if (!token) return <Navigate to={"/"} replace />

  if (isLoading) return <LoadingSpinner />

  if (!admin) return <Navigate to={"/"} replace />

  return <LazyLoader>{children}</LazyLoader>
}