import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logimg from "../assets/images/LoginImage.svg";
import { AuthContext } from "../context/AuthContext";

const SignUpPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/register",
        formData
      );

      sessionStorage.setItem("pendingUserEmail", formData.email);
      if (response.data?.otp) {
        sessionStorage.setItem("pendingOtp", response.data.otp);
      }

      navigate("/verify-otp", {
        state: { email: formData.email },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full lg:w-3/4 min-h-screen flex items-center justify-center">
        <div className="h-[70%] lg:h-[75%] w-[80%] lg:w-[50%] bg-gray-100 rounded-2xl p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 lg:gap-4">
            <h1 className="text-3xl font-integral flex justify-center font-bold">
              Shop.Co
            </h1>

            <p className="text-gray-600 font-satoshi flex justify-center">
              Create your account
            </p>

            <h1 className="text-2xl font-bold">Sign Up</h1>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-bold font-satoshi">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name.."
                className="h-12 w-full font-satoshi rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-black"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-bold font-satoshi">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-center font-satoshi">
              Already have an account? {" "}
              <Link to="/login" className="font-bold underline">
                Log In
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

export default SignUpPage;