import { getCurrentAdmin } from "@/services/auth_admin.service";
import { getAuthAdminToken, setUser } from "@/store/authAdminSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentAdmin = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(getAuthAdminToken);

  return useQuery({
    queryKey: ["currentAdmin", token],
    queryFn: async ({ queryKey }) => {
      const [_key, token] = queryKey;
      if (!token) throw new Error("No token found");

      const data = await getCurrentAdmin(token as string);

      // 🔑 normalize response
      const user = data?.user ?? data; // use data.user if available, else data

      if (!user) throw new Error("No user returned from /admin/me");

      // store in Redux
      dispatch(setUser(user));

      return user;
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
};
