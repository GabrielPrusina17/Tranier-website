import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft,FaEyeSlash, FaEye } from "react-icons/fa";
import landingHero from "../assets/LandingHero.jpeg"
import { motion } from "framer-motion";

function RegisterPage () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen relative lg:flex"
            style={{background: "radial-gradient(circle at 50% 0%, #1c1c15, #14140f)"}}>
            
            {/*BACK*/}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 z-10 text-[#7a8248]/50 cursor-pointer"
            >
                <FaArrowLeft size={24} />
            </button>

            <motion.div
                className="hidden lg:block lg:w-1/2 lg:h-screen"
                layoutId="auth-image"
                transition={{type: "spring", stiffness: 80, damping: 20}}
            >
                <img 
                    src={landingHero}
                    alt=""
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* FORM */}

            <div className="min-h-screen flex flex-col items-center justify-center px-6 lg:w-1/2">
            <motion.div
                className="w-full max-w-sm"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{ duration: 0.4, delay: 0.1}}
            >

                {/* TITLE */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl lg:text-4xl text-white">
                        Create an account!
                    </h1>
                    <p 
                        className="text-xl lg:text-2xl text-[#9aa87e]"
                        style={{ fontFamily: "'Fraunces', serif"}}
                    >
                        Register and start your journey
                    </p>
                </div>

                <form className="flex flex-col gap-4">

                    {/* NAME */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                            Name
                        </label>
                        <input 
                            type="text"
                            required
                            placeholder="Josip"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border border-[#7a8248]/40 rounded-lg px-4 py-3 text-[#e8e4d6] placeholder-[#8a8770] outline-none transition-colors focus:border-[#7a8248] focus:ring-1 focus:ring-[#7a8248]/40"
                        />
                    </div>

                    {/* LAST NAME */}
                    <div>
                        <label htmlFor="last" className="block text-sm font-medium text-white mb-1">
                            Last Name
                        </label>
                        <input 
                            type="text"
                            required
                            placeholder="Drežnjak"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-transparent border border-[#7a8248]/40 rounded-lg px-4 py-3 text-[#e8e4d6] placeholder-[#8a8770] outline-none transition-colors focus:border-[#7a8248] focus:ring-1 focus:ring-[#7a8248]/40"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                            E-mail adress
                        </label>
                        <input 
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
                        <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password
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
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e8e4d6] cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </label>
                    </div>

                    {/* REGISTER BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-[#7a8248] text-white rounded-full px-6 py-3 font-medium cursor-pointer transition-all duration-300 hover:bg-[#8a9358] hover:scale-105 disabled:obacity-50"
                    >
                        REGISTER
                    </button>
                </form>
                
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-[#e8e4d6] font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </motion.div>
            </div>
        </div>
    )
}

export default RegisterPage;