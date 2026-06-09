import { getCurrentUser } from "@/services/auth.service";
import { getAuthToken } from "@/store/authSlice";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";

const useGetCurrentUser = () => {

  const token = useAppSelector(getAuthToken)
  return useQuery({
    queryKey: ["curerentUser", token],
    queryFn: ({ queryKey }) => {
      const [_key, token] = queryKey
      return getCurrentUser(token as string)
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity
  })
}

export default useGetCurrentUser;