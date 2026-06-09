// src/components/auth/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import { setAdminCredentials } from "@/store/authAdminSlice"; // Import admin slice
import { loginUser } from "@/services/auth.service";
import { loginAdmin } from "@/services/auth_admin.service";
import { loginFormSchema } from "./schemas";
import type { LoginFormValues } from "./schemas";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToRegister 
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  // User login mutation
  const userLoginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Use user auth slice
      dispatch(setCredentials(data));
      toast.success("Login Successful!", { toastId: "loginSuccess" });
      reset();
      navigate("/");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Login failed", { toastId: "loginError" });
    }
  });

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      // Use admin auth slice (NOT the same as user slice)
      dispatch(setAdminCredentials(data));
      toast.success("Admin Login Successful!", { toastId: "adminLoginSuccess" });
      reset();
      navigate("/"); // Redirect to admin dashboard
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Admin login failed", { toastId: "adminLoginError" });
    }
  });

  const handleLoginSubmit = async (data: LoginFormValues) => {
    try {
      // First try user login
      await userLoginMutation.mutateAsync(data);
    } catch (userError: any) {
      // If user login fails → try admin login
      try {
        await adminLoginMutation.mutateAsync(data);
      } catch (adminError: any) {
        toast.error(
          adminError?.message || userError?.message || "Login failed. Please try again.",
          { toastId: "loginError" }
        );
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRegisterClick = () => {
    handleClose();
    onSwitchToRegister();
  };

  const isPending = userLoginMutation.isPending || adminLoginMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-4">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
          <div>
            <input
              {...register("username")}
              type="text"
              placeholder="Username or Email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="w-full py-2 rounded-lg transition-colors text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting || isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleRegisterClick}
            className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium focus:outline-none focus:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "@/store/hooks";
// import { setCredentials } from "@/store/authSlice";
// import { setAdmin } from "@/store/adminAuthSlice";
// import { loginUser } from "@/services/auth.service";
// import { loginAdmin } from "@/services/adminAuth.service";
// import { loginFormSchema } from "./schemas";
// import type { LoginFormValues } from "./schemas";

// interface LoginProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSwitchToRegister: () => void;
// }

// const Login: React.FC<LoginProps> = ({ 
//   isOpen, 
//   onClose, 
//   onSwitchToRegister 
// }) => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginFormSchema),
//     defaultValues: { username: "", password: "" },
//   });

//   // User login mutation
//   const userLoginMutation = useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       console.log("User login success:", data);
//       dispatch(setCredentials(data));
//       toast.success("Login Successful!", { toastId: "loginSuccess" });
//       reset();
//       navigate("/");
//       onClose();
//     },
//     onError: (error: any) => {
//       console.log("User login failed:", error.message);
//       // Don't show error here - we'll try admin login next
//     }
//   });

//   // Admin login mutation - FIXED: Remove profile verification to avoid errors
//   const adminLoginMutation = useMutation({
//     mutationFn: loginAdmin,
//     onSuccess: (data) => {
//       console.log("Admin login success, setting credentials:", data);
      
//       // Set credentials in Redux immediately - this should be enough
//       dispatch(setAdmin(data));
      
//       toast.success("Admin Login Successful!", { toastId: "adminLoginSuccess" });
//       reset();
//       navigate("/admin_dashboard");
//       onClose();
//     },
//     onError: (error: any) => {
//       console.log("Admin login failed:", error.message);
//       toast.error(error.message || "Admin login failed", { toastId: "adminLoginError" });
//     }
//   });

//   const handleLoginSubmit = async (data: LoginFormValues) => {
//     console.log("=== LOGIN FLOW STARTED ===");

//     // First try USER login
//     try {
//       console.log("1. Attempting USER login...");
//       await userLoginMutation.mutateAsync(data);
//       return; // Exit if user login succeeds
//     } catch (userError: any) {
//       console.log("1. USER login failed, trying ADMIN login...");
//     }

//     // If user login failed, try ADMIN login
//     try {
//       console.log("2. Attempting ADMIN login...");
//       await adminLoginMutation.mutateAsync(data);
//       return; // Exit if admin login succeeds
//     } catch (adminError: any) {
//       console.log("2. ADMIN login failed");
//       // Show error toast for final failure
//       toast.error("Login failed. Please check your credentials.", { 
//         toastId: "loginError",
//         position: "top-center"
//       });
//     }

//     console.log("=== LOGIN FLOW COMPLETED ===");
//   };

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   const handleRegisterClick = () => {
//     handleClose();
//     onSwitchToRegister();
//   };

//   const isPending = userLoginMutation.isPending || adminLoginMutation.isPending;

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
//       <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg w-full max-w-md relative">
//         <button
//           onClick={handleClose}
//           className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
//           disabled={isPending}
//         >
//           ✕
//         </button>

//         <h2 className="text-xl font-bold text-center mb-4">
//           Welcome Back
//         </h2>

//         <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
//           <div>
//             <input
//               {...register("username")}
//               type="text"
//               placeholder="Username or Email"
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//               disabled={isPending}
//             />
//             {errors.username && (
//               <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
//             )}
//           </div>

//           <div>
//             <input
//               {...register("password")}
//               type="password"
//               placeholder="Password"
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//               disabled={isPending}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting || isPending}
//             className="w-full py-2 rounded-lg transition-colors text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
//           >
//             {isSubmitting || isPending ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
//           Don't have an account?{" "}
//           <button
//             type="button"
//             onClick={handleRegisterClick}
//             className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium focus:outline-none focus:underline"
//             disabled={isPending}
//           >
//             Sign up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;