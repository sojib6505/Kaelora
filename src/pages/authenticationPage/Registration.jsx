import React, {  useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";
import Logo from "../../utils/Logo";
import { Target } from "lucide-react";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import useAuth from "../../hooks/useAuth";


export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const {signUp} = useAuth()
  console.log(signUp)
   
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const {email,password} = data
    signUp(email,password).then( async(userCredential) => {
        const user = userCredential.user;
        console.log(user)
        // const userData = {
        //   name: data.name,
        //   email:data.email,
        //   role: "user"
        // }
    }).catch((error)=>{
      console.log(error.message)
    })
  };
  


  return (
    <>
      <ScrollToTop />
      <div className="md:min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 mt-16.5">
        <div className="bg-white py-5 px-8 rounded-2xl shadow-lg w-full max-w-md ">
          <div className="flex items-center gap-5 justify-center mb-6">
            <h2 className="text-2xl font-bold text-center font-serif ">
              Register on the
            </h2>
            <div className="flex justify-center items-center">
              <Logo />
              <p className="text-xl font-bold font-serif ">KAELORA</p>
            </div>
          </div>

          {/* Google login */}
          <button className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100 transition font-semibold font-serif">
            <FcGoogle size={22} />
            Direact Login with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <hr className="flex-1" />
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-1" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/*Name */}
            <div>
              <label className="font-semibold text-sm">Your Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="Enter Your Name"
                className="w-full border font-medium p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            {/* Email */}
            <div>
              <label className="font-semibold text-sm">Email</label>
              <input
                required
                {...register("email", {
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
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            {/* Password */}
            <div>
              <label className="font-semibold text-sm">Password</label>
              <div className="relative">
                <input
                  required
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
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 cursor-pointer text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Sign Up
            </button>
            {/* Forgot Password */}
            <button className="hover:underline font-bold">
              Forgot Password?
            </button>
          </form>
          {/* SignUp */}
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <Link to="/auth" className=" font-bold">
              Already you have an account?{" "}
              <span className="font-serif text-red-primary md:font-bold underline ">
                Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
