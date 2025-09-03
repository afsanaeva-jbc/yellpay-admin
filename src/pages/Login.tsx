import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgEyeAlt } from "react-icons/cg";
import { RiEyeCloseLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Assets
import Login_Logo from "../assets/loginBanner.png";

// Types for form
type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      //  login API call
      const response = await fakeLoginAPI(data);
      if (response.success) {
        toast.success("Login successful!");
        navigate("/dashboard"); // Redirect after login
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Right side login form */}
      <div className="flex flex-col justify-center items-center w-full">
        <img src={Login_Logo} alt="Logo" className="mb-8 w-100" />
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="button"
              className="absolute right-2 top-11 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <RiEyeCloseLine size={15} />
              ) : (
                <CgEyeAlt size={15} />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex justify-items-center mt-10">
          {/* <Link to="/change-password">
            <button
              type="button"
              className="bg-amber-300 text-black py-2 px-4 rounded cursor-pointer"
            >
              Change Password
            </button>
          </Link> */}
          <Link to="/forgot-password">
            <button
              type="button"
              className="border border-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-50 py-2 px-6 rounded cursor-pointer"
            >
              Forget Password
            </button>
          </Link>
          <Link to="/change-password">
            <button
              type="button"
              className="border border-gray-300 text-gray-800 font-medium text-sm py-2 px-10 rounded cursor-pointer hover:bg-gray-50 ml-8"
            >
              Change Password
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// login API for demo
const fakeLoginAPI = async (data: LoginFormInputs) => {
  return new Promise<{ success: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      if (data.email === "test@example.com" && data.password === "password") {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "Invalid credentials" });
      }
    }, 1000);
  });
};

export default Login;
