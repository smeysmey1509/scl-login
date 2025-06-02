import React, {type FormEvent, useEffect, useRef, useState,} from "react";
import "./LoginPage.css";
import BackgroungImage from "../../assets/scl-loginbg.jpg";
import Profile from "../../assets/profile.jpg";
import SCLLogo from "../../assets/scl-logo.png";
import BtnSVG from "../../assets/Icon.svg";
import {MdContentCopy, MdVerified} from "react-icons/md";

const LoginPage = () => {
    const [step, setStep] = useState<"name" | "password" | "otp">("name");
    const [inputValue, setInputValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isCopy, setIsCopy] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [attemptCount, setAttemptCount] = useState<number>(0);
    const [passwordAttemptCount, setPasswordAttemptCount] = useState<number>(0);
    const [otpCount, setOtpCount] = useState<number>(0);
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [showToast, setShowToast] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const inputsRef = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (step == "name") setName(e.target.value);
        if (step == "password") setPassword(e.target.value);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(inputValue).then(() => {
            setIsCopy(!isCopy);
        });
    };

    const handleRetype = () => {
        setInputValue("");
        inputRef.current?.focus();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (step === "name") {
            if (!inputValue.trim() || isLocked) {
                setError("Username is required.");
                return;
            }
            setLoading(true);
            setTimeout(() => {
                setLoading(false);

                if (inputValue === "admin") {
                    // ✅ Correct username
                    setStep("password");
                    setName(inputValue);
                    setInputValue("");
                    setError("");
                    setAttemptCount(0);
                } else {
                    const newCount = attemptCount + 1;
                    setAttemptCount(newCount);

                    if (newCount === 1) {
                        setError(
                            "The username you entered doesn't match. Please check your username again."
                        );
                    } else if (newCount === 2) {
                        setError(
                            "Still incorrect. Please checking and make sure that your username."
                        );
                    } else if (newCount >= 3) {
                        setIsLocked(true);
                    }
                }
            }, 100);
        } else if (step === "password") {
            if (!inputValue.trim() || isLocked) {
                setError("Password is required.");
                return;
            }
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                if (inputValue !== "123") {
                    const newPassAttempts = passwordAttemptCount + 1;
                    setPasswordAttemptCount(newPassAttempts);

                    if (newPassAttempts === 1) {
                        setError(
                            "The password you entered is incorrect. Please try again."
                        );
                    } else if (newPassAttempts === 2) {
                        setError("Still incorrect. Please double-check your password.");
                    } else if (newPassAttempts >= 3) {
                        setIsLocked(true);
                    }
                    return;
                }

                if (name === "admin" && password === "123") {
                    setPasswordAttemptCount(0);
                    setStep("otp");
                    setInputValue("");
                    setTimeout(() => inputsRef.current[0]?.focus(), 0);
                } else {
                    alert("Login failed: Invalid username or password");
                }
            }, 100);
        } else if (step === "otp") {
            const enteredOtp = otp.join("").trim();

            // Check if OTP is 6 digits
            if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
                setError("Please enter a valid 6-digit OTP.");
                setShowToast(true);
                return;
            }

            if (enteredOtp !== "123456") {
                const newOtpAttempts = otpCount + 1;
                setOtpCount(newOtpAttempts);

                if (newOtpAttempts === 1) {
                    setError("Your verification code is incorrect. Please check and try again.")
                } else if (newOtpAttempts === 2) {
                    setError("Still incorrect. Please double-check your password.");
                } else if (newOtpAttempts >= 3) {
                    setIsLocked(true);
                }
            } else {
                alert("Invalid OTP ❌");
            }
        }
    };

    const handleInputClick = () => {
        if (step === "password" && inputValue.trim()) {
            const input = inputRef.current;
            const pos = input?.selectionStart ?? 0;

            setShowPassword((prev) => !prev);

            setTimeout(() => {
                input?.focus();
                input?.setSelectionRange(pos, pos);
            }, 0);
        }
    };

    // const isTyping = inputValue.trim() !== "";

    return (
        <>
            <div className={loading ? "scl--loading-semi-transparent" : ""}></div>
            {showToast && (
                <div className="scl--login-toast">
                    <div className="scl--login-toast-message">
                        <div className="scl--login-toast-svg">Logo</div>
                        <div className="scl--login-toast-title">
                            <p>Login successfully</p>
                            <p>Your login has sucessfully.</p>
                        </div>
                    </div>
                    <div className="scl--login-toast-bar"></div>
                </div>
            )}
            <div className="scl--login-page">
                <img src={BackgroungImage} alt=""/>
                <div className="scl--login-form">
                    <div className="scl--login-form-background">
                        <div className="scl--login-form-logo">
                            <img src={SCLLogo} alt=""/>
                            {step === "name" ? (
                                <p>
                                    With your username to continue. This account will be available
                                    to other Sodexs applications.
                                </p>
                            ) : (
                                <div className="scl--login-account-confirm">
                                    <div className="scl--login-verify-name">
                                        <span>You are verify</span>
                                        <MdVerified/>
                                    </div>
                                    <div className="scl--login-verify">
                                        <div className="scl--login-verify-profile">
                                            <img src={Profile} alt=""/>
                                        </div>
                                        <span>InDesign</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="scl--login-form-field">
                            <div className="scl--login-form-field-title">
                                <h2>{isLocked ? "Account Temporarily Locked" : "Login"}</h2>

                                {step === "name" && !isLocked && (
                                    <p>Please input your username to continue your account.</p>
                                )}

                                {step === "name" && isLocked && (
                                    <p className="scl--login-error-text">
                                        You have attempted username wrong too many times.
                                    </p>
                                )}

                                {step === "password" && !isLocked && (
                                    <p>Please input your password to continue your account.</p>
                                )}

                                {step === "password" && isLocked && (
                                    <p className="scl--login-error-text">
                                        Your account has been locked due to multiple failed password
                                        attempts.
                                    </p>
                                )}

                                {step === "otp" && isLocked && (
                                    <p>Please enter the 6-digit OTP code sent to your email.</p>
                                )}

                                {step === "otp" && !isLocked && (
                                    (<p>Please input your 6 digit OTP code for continue your account.</p>)
                                )}

                            </div>
                            <div className="scl--login-form-field-input">
                                <form onSubmit={handleSubmit}>
                                    {step === "otp" ? (
                                        <div className={'scl--login-verify-otp'}>
                                            <div
                                                className={`scl--login-verify-boxes ${
                                                    (error || isLocked ? "scl--login-verify-boxes-error-border" : "") +
                                                    (isLocked ? " scl--locked" : "")
                                                }`}>
                                                {[...Array(6)].map((_, index) => (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        maxLength={1}
                                                        value={otp[index]}
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            // Only allow digits or empty string
                                                            if (!/^[0-9]?$/.test(value)) return;

                                                            const updatedOtp = [...otp];
                                                            updatedOtp[index] = value;
                                                            setOtp(updatedOtp);

                                                            // Move to next input if character is typed
                                                            if (value && inputsRef.current[index + 1]) {
                                                                inputsRef.current[index + 1].focus();
                                                            }

                                                            // ✅ Auto-submit when all digits are filled
                                                            const enteredOtp = updatedOtp.join("").trim();

                                                            // Only proceed if all 6 digits are filled
                                                            if (enteredOtp.length === 6) {
                                                                if (!/^\d{6}$/.test(enteredOtp)) {
                                                                    setError("Please enter a valid 6-digit OTP.");
                                                                    setShowToast(true);
                                                                    return;
                                                                }

                                                                if (enteredOtp !== "123456") {
                                                                    const newOtpAttempts = otpCount + 1;
                                                                    setOtpCount(newOtpAttempts);

                                                                    if (newOtpAttempts === 1) {
                                                                        setError("Your verification code is incorrect. Please check and try again.");
                                                                    } else if (newOtpAttempts === 2) {
                                                                        setError("Still incorrect. Please double-check your code.");
                                                                    } else if (newOtpAttempts >= 3) {
                                                                        setError("You’ve entered the wrong OTP 3 times. You're now locked out.");
                                                                        setIsLocked(true);
                                                                    }
                                                                } else {
                                                                    setShowToast(true);
                                                                }
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key === "Backspace" &&
                                                                !otp[index] &&
                                                                inputsRef.current[index - 1]
                                                            ) {
                                                                inputsRef.current[index - 1].focus();
                                                            }
                                                        }}
                                                        ref={(el) => {
                                                            inputsRef.current[index] = el!;
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            {step === "otp" && <span className="scl--otp-error">{error}</span>}
                                            <div className="scl--login-verify-resend-code">
                                                <span>Resend code?</span> <span>00:00</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`scl--login-full-form ${
                                                (error || isLocked ? "scl--login-error-border" : "") +
                                                (isLocked ? " scl--locked" : "")
                                            }`}
                                        >
                                            <input
                                                ref={inputRef}
                                                disabled={isLocked}
                                                type={
                                                    step === "password" && !showPassword
                                                        ? "password"
                                                        : "text"
                                                }
                                                placeholder={
                                                    step === "password" ? "Password" : "Username"
                                                }
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                onClick={handleInputClick}
                                            />
                                            {!isLocked && (
                                                <div
                                                    className="scl--login-fn"
                                                >
                                                    <div className="scl--login-copy" onClick={handleCopy}>
                                                        {isCopy ? <span>Copied</span> : <MdContentCopy/>}
                                                    </div>
                                                    <div
                                                        className="scl--login-retype"
                                                        onClick={handleRetype}
                                                    >
                                                        <span>Retype</span>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="submit"
                                                className={
                                                    step === "name" && inputValue === "admin"
                                                        ? "scl--btn-active"
                                                        : ""
                                                }
                                            >
                                                <img src={BtnSVG} alt=""/>
                                            </button>
                                        </div>
                                    )}
                                </form>
                                {step !== "otp" && error && <span className="scl--login-error">{error}</span>}
                            </div>
                        </div>
                    </div>
                    {loading && (
                        <span className="scl--barloader-container">
              <span className="scl--spinner-item"></span>
            </span>
                    )}
                    <div className="scl--login-text-policy">
                        <p>English (United State)</p>
                        <ul>
                            <li>
                                <a href="">Help</a>
                            </li>
                            <li>
                                <a href="">Privacy</a>
                            </li>
                            <li>
                                <a href="">Term</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
