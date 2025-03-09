import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../Config";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function signup() {
        setLoading(true);
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password
            });

            if (response.data.token) {
                localStorage.setItem("token", `Bearer ${response.data.token}`);
                localStorage.setItem("username", username || "User");
                navigate("/dashboard");
            } else {
                alert("Signup failed! No token received.");
            }
        } catch (error) {
            alert("Error signing up!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Glassmorphism Card */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl px-10 py-8 max-w-sm w-full text-white">
                <h2 className="text-3xl font-extrabold text-center mb-2">Sign Up</h2>
                <p className="text-gray-300 text-center mb-6">Join us and start exploring!</p>

                {/* Input Fields */}
                <input 
                    ref={usernameRef} 
                    placeholder="Username" 
                    className="w-full bg-gray-700/30 border border-gray-500 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                />
                <input 
                    ref={passwordRef} 
                    type="password"
                    placeholder="Password" 
                    className="w-full mt-4 bg-gray-700/30 border border-gray-500 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                />

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                    <button 
                        onClick={signup} 
                        className={`w-full flex justify-center items-center bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer ${loading ? "opacity-60" : ""}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        ) : "Sign Up"}
                    </button>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Already have an account? 
                    <a href="/login" className="text-blue-400 hover:underline ml-1">Login</a>
                </p>
            </div>
        </div>
    );
}
