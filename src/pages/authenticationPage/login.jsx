import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";
import Logo from "../../utils/Logo";
import { Target } from "lucide-react";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";

export default function login() {
    const [showPassword,setShowPassword] = useState(false)
    const {login} = useAuth()
    console.log(login)
    const {
      register,
      handleSubmit,
      formState: {errors}
    } = useForm()
    
    const onSubmit = (data) => {
      console.log(data)
    }
  return (
    <>
     <ScrollToTop/>
      <div className="md:min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 mt-16.5">
        <div className="bg-white py-5 px-8 rounded-2xl shadow-lg w-full max-w-md ">
             
             <div className="flex items-center gap-5 justify-center mb-6">
                <h2 className="text-2xl font-bold text-center font-serif ">Stay With</h2> 
               <div className="flex justify-center items-center">
                 <Logo/>
                 <p className="text-xl font-bold font-serif ">KAELORA</p>
               </div>
             </div>

             {/* Google login */}
          <button
          
            className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100 transition font-semibold font-serif"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>
         
          {/* Divider */}
          <div className="flex items-center my-5">
            <hr className="flex-1" />
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-1" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4">
            {/* Email */}
            <div>
              <label className="font-semibold text-sm">Email</label>
              <input
                {...register('email',{
                  pattern:{
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email"
                  }
                })}
                type="email"
                placeholder="Enter Your Email"
               
                className="w-full border font-medium p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.email && <p className="text-red">{errors.email.message}</p>}
            </div>
            {/* Password */}
            <div>
              <label className="font-semibold text-sm">Password</label>
              <div className="relative">
                <input
                 {...register('password')}
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Login
            </button>
            {/* Forgot Password */}
            <button
              className="hover:underline font-bold"
            >
              Forgot Password?
            </button>
          </form>
          {/* SignUp */}
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <Link to="/auth/sign_up" className=" font-bold">
              You have no account?{" "}
              <span className="font-serif text-red-primary md:font-bold underline ">Sign Up</span>
            </Link>
          </div>
         
        </div>
      </div>
    </>
  );
}
