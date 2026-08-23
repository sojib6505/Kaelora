import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import Logo from "../../utils/Logo";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import axios from "axios"; 

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp, googleSignIn, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //  firebaseUser  token send
  const saveUserToDB = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      console.log("TOKEN:", token); 
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("DB save success:", res.data);
    } catch (err) {
      console.error(" Status:", err.response?.status);
      console.error(" Message:", err.response?.data);
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password } = data;
    setError("");
    setLoading(true);
    try {
      const userCredential = await signUp(email, password);
      await updateUserProfile(name);
      await saveUserToDB(userCredential.user); 
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await googleSignIn();
      await saveUserToDB(result.user); 
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="md:min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 mt-16.5">
        <div className="bg-white py-5 px-8 rounded-2xl shadow-lg w-full max-w-md">
          <div className="flex items-center gap-5 justify-center mb-6">
            <h2 className="text-2xl font-bold text-center font-serif">
              Register on the
            </h2>
            <div className="flex justify-center items-center">
              <Logo />
              {/* <p className="text-xl font-bold font-serif">KAELORA</p> */}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3 bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100 transition font-semibold font-serif disabled:opacity-50"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="flex items-center my-5">
            <hr className="flex-1" />
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-1" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="font-semibold text-sm">Your Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Enter Your Name"
                className="w-full border font-medium p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-sm">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email",
                  },
                })}
                type="email"
                placeholder="Enter Your Email"
                className="w-full border font-medium p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-sm">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border font-medium p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 cursor-pointer text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </form>

          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <Link to="/auth" className="font-bold">
              Already have an account?{" "}
              <span className="font-serif text-red-primary md:font-bold underline">
                Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
