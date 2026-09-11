import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FaArrowLeft,FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LandingHero from "../assets/LandingHero.jpeg"

function LoginPage () {
    
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    

    return (
        <div className="min-h-screen relative lg:flex"
            style={{background: "radial-gradient(circle at 50% 0%, #1c1c15, #14140f)"}}>

            {/*BACK*/}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 z-10 text-[#7a8248]/50 cursor-pointer"
            >
                <FaArrowLeft size={24} />
            </button>

            {/* FORM */}
            <div className="min-h-screen flex flex-col items-center justify-center px-6 lg:w-1/2">
                <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{ duration: 0.4, delay: 0.1}}
                    className="w-full max-w-sm"
                >
                    {/* TITLE */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl lg:text-4xl text-white">
                            Welcome Back!
                        </h1>
                        <p 
                            className="text-xl lg:text-2xl text-[#9aa87e]"
                            style={{ fontFamily: "'Fraunces', serif"}}
                        >
                            Login to start your journey.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4">

                        {/* EMAIL */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                E-mail adress
                            </label>
                            <input 
                                id="email"
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border border-[#7a8248]/40 rounded-lg px-4 py-3 text-[#e8e4d6] placeholder-[#8a8770] outline-none transition-colors focus:border-[#7a8248] focus:ring-1 focus:ring-[#7a8248]/40"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border border-[#7a8248]/40 rounded-lg px-4 py-3 text-[#e8e4d6] placeholder-[#8a8770] outline-none transition-colors focus:border-[#7a8248] focus:ring-1 focus:ring-[#7a8248]/40"
                                />
                                <button
                                    type="button"
                                    onClick={(() => setShowPassword(!showPassword))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e8e4d6] cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="text-xs text-[#e8e4d6] font-semibold hover:underline self-end"
                        >
                            Forgot your password?
                        </Link>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-[#7a8248] text-white rounded-full px-6 py-3 font-medium cursor-pointer transition-all duration-300 hover:bg-[#8a9358] hover:scale-105 disabled:obacity-50"
                        >
                            LOGIN
                        </button>

                        {/* DIVIDER */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-[#e8e4d6]/15" />
                            <span className="text-sm text-[#8a8770]">or</span>
                            <div className="flex-1 h-px bg-[#e8e4d6]/15" />
                        </div>             
                    </form>

                    {/* LINK FOR REGISTRATION */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don't have an account? {" "}
                        <Link
                            to="/register"
                            className="text-[#e8e4d6] font-medium hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="hidden lg:block lg:w-1/2 lg:h-screen"
                layoutId="auth-image"
                transition={{ type: "spring", stiffness: 80, damping: 20}}
            >
                <img 
                    src={LandingHero}
                    alt=""
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </div>
    )
}

export default LoginPage;