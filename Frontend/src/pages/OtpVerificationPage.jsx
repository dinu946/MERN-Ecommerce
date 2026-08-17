import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logimg from "../assets/images/LoginImage.svg";

const OtpVerificationPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        sessionStorage.getItem("pendingUserEmail") ||
        "";

    const inputRefs = useRef([]);

    const [otp, setOtp] = useState([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const otpValue = otp.join("");


    // Handle OTP input
    const handleInputChange = (value, index) => {

        const sanitizedValue = value
            .replace(/\D/g, "")
            .slice(0, 1);

        const newOtp = [...otp];

        newOtp[index] = sanitizedValue;

        setOtp(newOtp);

        // Move to next input
        if (sanitizedValue && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };


    // Handle backspace
    const handleKeyDown = (e, index) => {

        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };


    // Verify OTP
    const handleVerify = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email) {
            setError(
                "Email is required. Please sign up again."
            );
            return;
        }

        if (otpValue.length !== 6) {
            setError("Please enter the 6-digit OTP");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                "/api/auth/verify-otp",
                {
                    email,
                    otp: otpValue,
                }
            );

            setSuccess(
                response.data.message ||
                "Account verified successfully!"
            );

            // Remove temporary signup information
            sessionStorage.removeItem(
                "pendingUserEmail"
            );

            // Redirect to login
            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "OTP verification failed"
            );

        } finally {

            setLoading(false);

        }
    };


    // Resend OTP
    const handleResendOTP = async () => {

        setError("");
        setSuccess("");

        if (!email) {
            setError(
                "Email is required. Please sign up again."
            );
            return;
        }

        try {

            const response = await axios.post(
                "/api/auth/resend-otp",
                {
                    email,
                }
            );

            setSuccess(
                response.data.message ||
                "New OTP sent to your email."
            );

            // Clear old OTP boxes
            setOtp([
                "",
                "",
                "",
                "",
                "",
                "",
            ]);

            inputRefs.current[0]?.focus();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to resend OTP"
            );

        }
    };


    return (

        <div className="min-h-screen w-full flex">

            {/* Form Section */}

            <div className="w-full lg:w-3/4 min-h-screen flex items-center justify-center">

                <div className="h-auto lg:h-[75%] w-[80%] lg:w-[50%] bg-gray-100 rounded-2xl p-10">

                    <form
                        onSubmit={handleVerify}
                        className="flex flex-col gap-4 lg:gap-5"
                    >

                        <h1 className="text-3xl font-integral flex justify-center font-bold">
                            Shop.Co
                        </h1>

                        <p className="text-gray-600 font-satoshi flex justify-center">
                            Verify your email address
                        </p>

                        <h1 className="text-2xl font-bold">
                            OTP Verification
                        </h1>

                        <p className="text-sm text-gray-500">
                            Enter the 6-digit OTP sent to:
                        </p>

                        <p className="font-bold break-all">
                            {email}
                        </p>


                        {/* Error */}

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Success */}

                        {success && (
                            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
                                {success}
                            </div>
                        )}


                        {/* OTP */}

                        <div className="flex flex-col gap-2">

                            <label
                                htmlFor="otp-0"
                                className="font-bold font-satoshi"
                            >
                                Enter OTP
                            </label>

                            <div className="flex justify-between gap-2">

                                {otp.map((digit, index) => (

                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        ref={(el) =>
                                            (inputRefs.current[index] = el)
                                        }
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e.target.value,
                                                index
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        className="h-12 w-12 text-center font-satoshi rounded-xl border border-gray-300 bg-white outline-none focus:border-black"
                                        required
                                    />

                                ))}

                            </div>

                        </div>


                        {/* Verify */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full mt-5 rounded-xl bg-black font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>


                        {/* Resend */}

                        <button
                            type="button"
                            onClick={handleResendOTP}
                            className="text-sm font-medium text-gray-700 underline"
                        >
                            Resend OTP
                        </button>


                        {/* Back */}

                        <p className="text-center font-satoshi">

                            <Link
                                to="/signUp"
                                className="font-bold underline"
                            >
                                Back to Sign Up
                            </Link>

                        </p>

                    </form>

                </div>

            </div>


            {/* Image Section */}

            <div className="hidden lg:block lg:w-2/4 min-h-screen bg-gray-100">

                <div className="h-[70%] w-[40%] absolute top-45 right-30">

                    <img
                        src={logimg}
                        className="object-cover"
                        alt=""
                    />

                </div>

            </div>


            <hr className="hidden lg:block w-full border-black absolute top-194" />

        </div>
    );
};

export default OtpVerificationPage;