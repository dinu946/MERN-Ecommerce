import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logimg from "../assets/images/LoginImage.svg";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { email, password }
            );

            login(response.data.user, response.data.token);
            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            <div className="w-full lg:w-3/4 min-h-screen flex items-center justify-center">
                <div className="h-[55%] lg:h-[75%] w-[80%] lg:w-[50%] bg-gray-100 rounded-2xl p-10">
                    <form onSubmit={handleLogin} className="flex flex-col gap-2 lg:gap-5">
                        <h1 className="text-3xl font-integral flex justify-center font-bold">
                            Shop.Co
                        </h1>

                        <p className="text-gray-600 font-satoshi flex justify-center">
                            Welcome back !!!
                        </p>

                        <h1 className="text-2xl font-bold">LogIn</h1>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-bold font-satoshi">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Your Email.."
                                className="h-12 w-full font-satoshi rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-black"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="font-bold font-satoshi">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Your Password.."
                                className="h-12 w-full font-satoshi rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-black"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full mt-7 lg:mt-10 rounded-xl bg-black font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? "Logging in..." : "LogIn"}
                        </button>

                        <p className="text-center font-satoshi">
                            I have an account? {" "}
                            <Link to="/signUp" className="font-bold underline">
                                SignUp
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            <div className="hidden lg:block lg:w-2/4 min-h-screen bg-gray-100 object-cover">
                <div className="h-[70%] w-[40%] absolute top-45 right-30">
                    <img src={logimg} className="object-cover" alt="" />
                </div>
            </div>
            <hr className="hidden lg:block w-full border-black absolute top-194" />
        </div>
    );
};

export default LoginPage;