import React, {type FormEvent, useEffect, useRef, useState,} from "react";
import {useNavigate} from "react-router-dom";
import "./LoginPage.css";
import BackgroundImage from "../../assets/scl-loginbg.jpg";
import Profile from "../../assets/profile.jpg";
import SCLLogo from "../../assets/scl-logo.png";
import {MdContentCopy, MdVerified} from "react-icons/md";
import ToasterMessage from "../../components/ToasterMessages/ToasterMessage.tsx";
import {useAuth} from "../../hooks/useAuth.ts";
import {resentOtp, validateOTP} from "../../api/otpAuth.ts";
import {isLockStatus} from "../../api/isLocked.ts";
import {toggleDarkMode} from "../../utils/theme.ts";
import BarLoader from "../../components/Loading/Barloader/Loading.tsx";

const LoginPage = () => {
    const {checkUsername, checkPassword} = useAuth();
    const [step, setStep] = useState<"username" | "password" | "otp">("username");
    const [inputValue, setInputValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isCopy, setIsCopy] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [attemptCount, setAttemptCount] = useState<number>(0);
    const [passwordAttemptCount, setPasswordAttemptCount] = useState<number>(0);
    const [otpCount, setOtpCount] = useState<number>(0);
    const [isLocked, setIsLocked] = useState<boolean>();
    const [otpLocked, setOtpLocked] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastType, setToastType] = useState<string>('');
    const [timer, setTimer] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState<boolean>(false);
    const [dark, setDark] = useState<boolean>(false);
    const navigate = useNavigate();

    //Toaster Message
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Keep URL in sync when `step` changes
    useEffect(() => {
        if (step === 'otp') {
            navigate('/login/otp', {replace: true});
        } else {
            navigate('/login', {replace: true});
        }
    }, [step, navigate]);

    useEffect(() => {
        statusCheck()
        localStorage.getItem("isLocked");
    }, [isLocked]);

    const statusCheck = async () => {
        const status = await isLockStatus();
        if (status.success) {
            setIsLocked(status.data.isBlocked);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (step == "username") setUsername(e.target.value);
        if (step == "password") {
            setPassword(e.target.value);
            setIsPasswordInvalid(false);
        }
    };

    const handleCopy = async () => {
        setIsCopy(!isCopy)
    };

    const handleRetype = () => {
        setInputValue("");
        inputRef.current?.focus();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (step === "username") {
            if (!inputValue.trim() || isLocked) {
                setError("Username is required.");
                return;
            }

            setLoading(true);

            try {
                const [res] = await Promise.all([
                    checkUsername(inputValue.trim()),
                    new Promise(resolve => setTimeout(resolve, 3000))
                ]);
                // await delay

                if (res?.success) {
                    setStep('password');
                    setInputValue('');
                    setAttemptCount(0);
                } else {
                    const newCount = attemptCount + 1;
                    setAttemptCount(newCount);

                    if (newCount === 1) {
                        setError(res?.error);
                    } else if (newCount === 2) {
                        setError(res?.error);
                    } else if (newCount >= 3) {
                        setIsLocked(true);
                    }
                }

            } catch (err) {
                // Only runs on network or unexpected errors
                setError("Unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        } else if (step === "password") {
            if (!inputValue.trim() || isLocked) {
                setError("Password is required.");
                return;
            }

            setLoading(true);

            try {
                const [data] = await Promise.all([
                    checkPassword(inputValue.trim()),
                    new Promise(resolve => setTimeout(resolve, 3000))
                ])

                if (data?.success) {
                    setStep('otp');
                    setInputValue('');
                    setPasswordAttemptCount(0);
                    focus()
                } else {
                    const newCount = passwordAttemptCount + 1;
                    setPasswordAttemptCount(newCount);

                    if (newCount === 1) {
                        setError(data?.error);
                        setIsPasswordInvalid(true)
                    } else if (newCount === 2) {
                        setError(data?.error);
                        setIsPasswordInvalid(true)
                    } else if (newCount >= 3) {
                        setIsLocked(true);
                    }
                }
            } catch (err) {
                setError("Unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleInputClick = () => {
        if (step === "password" && inputValue.trim()) {
            const input = inputRef.current;
            if (!input) return;

            const pos = input.selectionStart ?? inputValue.length;

            setShowPassword((prev) => {
                setTimeout(() => {
                    input.focus();
                    input.setSelectionRange(pos, pos);
                }, 0);
                return !prev;
            });
        }
    };

    // OTP triggered by input change
    const handleOtpChange = async (value: string) => {
        // Only allow digits or empty string
        if (!/^[0-9]?$/.test(value)) return;

        const updatedOtp = [...otp];

        // Find first empty index (i.e., where to insert next digit)
        const firstEmptyIndex = updatedOtp.findIndex((digit) => digit === "");

        if (value) {
            if (firstEmptyIndex === -1) return;
            updatedOtp[firstEmptyIndex] = value;
        } else {
            const lastFilledIndex = [...updatedOtp].reverse().findIndex((digit) => digit !== "");
            const indexToClear = updatedOtp.length - 1 - lastFilledIndex;
            updatedOtp[indexToClear] = "";
        }

        setOtp(updatedOtp);

        const nextFocusIndex = updatedOtp.findIndex((digit) => digit === "");
        // Move to next input if character is typed
        if (value && inputsRef.current[nextFocusIndex]) {
            inputsRef.current[nextFocusIndex].focus();
        }

        // ✅ Auto-submit when all digits are filled
        const enteredOtp = updatedOtp.join("").trim();

        if (enteredOtp.length === 6) {

            if (!/^\d{6}$/.test(enteredOtp)) {
                setError("Please enter a valid 6-digit OTP.");
                setShowToast(true);
                return;
            }

            setLoading(true);

            try {
                const [data] = await Promise.all([
                    validateOTP({
                        method: 'email',
                        otp: enteredOtp,
                        username: username,
                    }),
                    new Promise(resolve => setTimeout(resolve, 3000))
                ])

                if (data.error) {
                    console.log(data?.error)
                    // setShowToast(true);
                    // setToastType('unsuccess')
                }

                if (data?.success) {
                    const accessToken = data.data.access_token;

                    localStorage.setItem("access_token", accessToken);

                    setShowToast(true);
                    // setToastType('success');
                    setError("");
                    navigate('/dashboard')
                } else {
                    const newOtpAttempts = otpCount + 1;

                    setOtpCount(newOtpAttempts);

                    if (newOtpAttempts === 1) {
                        setError(data?.error);
                    } else if (newOtpAttempts === 2) {
                        setError(data?.error);
                    } else if (newOtpAttempts >= 3) {
                        setOtpLocked(true);
                        console.log(otpLocked)
                    }
                }
            } catch (error) {
                setError("Failed to verify OTP. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOtpPast = async (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();

        if (!/^\d{6}$/.test(pasted)) return;

        const pastedArray = pasted.split("").slice(0, otp.length);
        const newOtp = [...otp];

        pastedArray.forEach((digit, i) => {
            newOtp[i] = digit;
            if (inputsRef.current[i]) {
                inputsRef.current[i]!.value = digit;
            }
        });

        setOtp(newOtp);

        // Focus the next empty input or the last one
        const nextIndex = pastedArray.length < otp.length ? pastedArray.length : otp.length - 1;
        inputsRef.current[nextIndex]?.focus();

        // ✅ Auto-submit manually when pasted
        const enteredOtp = newOtp.join("").trim();

        if (enteredOtp.length === 6) {
            if (!/^\d{6}$/.test(enteredOtp)) {
                setError("Please enter a valid 6-digit OTP.");
                setShowToast(true);
                return;
            }

            setLoading(true);

            try {
                const [data] = await Promise.all([
                    validateOTP({
                        method: 'email',
                        otp: enteredOtp,
                        username: username,
                    }),
                    new Promise(resolve => setTimeout(resolve, 3000)),
                ]);

                if (data?.error) {
                    console.log(data.error);
                    setShowToast(true);
                    setToastType('unsuccess');
                    setError(data.error);
                }

                if (data?.success) {
                    const accessToken = data.data.access_token;
                    localStorage.setItem("access_token", accessToken);
                    setShowToast(true);
                    setToastType('success');
                    setError("");
                    navigate('/dashboard');
                } else {
                    const newOtpAttempts = otpCount + 1;
                    setOtpCount(newOtpAttempts);

                    if (newOtpAttempts >= 3) {
                        setOtpLocked(true);
                    }

                    setError(data?.error);
                }
            } catch (err) {
                setError("Failed to verify OTP. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOtpKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && inputsRef.current[index - 1]) {
            inputsRef.current[index - 1].focus();
        }

        if (e.key === "ArrowLeft" && inputsRef.current[index - 1]) {
            inputsRef.current[index - 1].focus();
        }

        if (e.key === "ArrowRight" && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1].focus();
        }
    };

    const startCountdown = () => {
        if (intervalId) return; // prevent multiple intervals

        setTimer(20);

        const id = window.setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    setIntervalId(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setIntervalId(id);
    };

    const handleResetCode = async () => {
        if (timer > 0) return;
        try {
            const response = await resentOtp(username);
            if (response.success) {
                // Clear previous error
                setError("");
                // Optionally clear OTP inputs
                setOtp(["", "", "", "", "", ""]);
                // Restart timer
                startCountdown();
            } else {
                setError(response.errorMessage || "Failed to resend OTP.");
                setShowToast(true);
                setToastType('unsuccess');
            }
        } catch (err) {
            setError("An error occurred while resending the code.");
            setShowToast(true);
            setToastType('unsuccess');
        }
    }

    const formatTime = (seconds: number): string => {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    const handleToggleDarkMode = () => {
        const newMode = !dark;
        setDark(newMode);
        toggleDarkMode(newMode);
    }

    return (
        <>
            {/*Black screen while loading*/}
            <div className={loading ? "scl--loading-semi-transparent" : " "}></div>

            <button className={'scl--darkmode-toggle'} onClick={handleToggleDarkMode}>Toggle</button>

            {/*ToasterMessage*/}
            {showToast && (
                <ToasterMessage type={toastType}/>
            )}

            {/*Login username & password & otp Form*/}
            <div className="scl--login-page">
                {/*Background Image*/}
                <img src={BackgroundImage} alt=""/>
                {/*Formulario de login*/}
                <div className="scl--login-form">
                    {/*Company Logo*/}
                    <div
                        className={`scl--login-form-background ${step === "otp" ? "scl--login-form-background-otp" : ""}`}>

                        {/*Company Logo*/}
                        <div className="scl--login-form-logo">
                            <img src={SCLLogo} alt=""/>
                            {step === "username" || step === 'otp' ? (
                                <p>
                                    {step === "otp" ? "Your password was verify. We’ve send activation code to your authentication app." : "With your username to continue. This account will be available"}
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

                        {/*Form Title like "Username", "Password", "OTP"*/}
                        <div
                            className={`scl--login-form-field ${step === "otp" ? "scl--login-form-field-otp" : ""}`}>
                            <div
                                className={`scl--login-form-field-title ${step === "otp" ? "scl--login-form-field-otp-title-width" : ""}`}>
                                <h2>{isLocked || otpLocked ? "Account Temporarily Locked" : "Login"}</h2>
                                {step === "username" && !isLocked && (
                                    <p>Please input your username to continue your account.</p>
                                )}

                                {step === "username" && isLocked && (
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

                                {step === "otp" && !otpLocked && (
                                    <p>Please enter the 6-digit OTP code sent to your email.</p>
                                )}

                                {step === "otp" && otpLocked && (
                                    (<p>You have attempted verification code wrong too many times.</p>)
                                )}

                            </div>
                            <div
                                className={`scl--login-form-field-input ${step === "otp" ? "scl--login-form-field-otp-input" : ""}`}>
                                <form onSubmit={handleSubmit}>
                                    {step === "otp" ? (
                                        // OTP Input
                                        <div className={'scl--login-verify-otp'}>
                                            <div
                                                className={`scl--login-verify-boxes ${
                                                    (error || isLocked ? "scl--login-verify-boxes-error-border" : "") +
                                                    (otpLocked ? " scl--otp-locked" : "")
                                                }`}>
                                                {[...Array(6)].map((_, index) => (
                                                    <input
                                                        key={index}
                                                        disabled={otpLocked}
                                                        type="text"
                                                        maxLength={1}
                                                        value={otp[index]}
                                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                        onPaste={handleOtpPast}
                                                        ref={(el) => {
                                                            inputsRef.current[index] = el!;
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span
                                                className={`scl--otp-error${error && step !== "otp" ? "visible" : ""}`}>{!otpLocked && error}</span>
                                            {!otpLocked && (
                                                <div className="scl--login-verify-resend-code">
                                                    <span
                                                        onClick={handleResetCode}
                                                        style={{
                                                            cursor: timer === 0 ? "pointer" : "not-allowed",
                                                            textDecoration: timer === 0 ? "underline" : "none",
                                                            color: timer === 0 ? "#0d6efd" : "#999",
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                      Resend code?
                                                    </span>
                                                    <span>{formatTime(timer)}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // Username & Password Input
                                        <div
                                            className={`scl--login-full-form ${
                                                (error || isLocked ? "scl--login-error-border" : "") +
                                                (isLocked ? " scl--locked" : "") + (step === "password" && isPasswordInvalid ? " scl--lock-button" : "") +
                                                (step === "username" && inputValue.length >= 2 ? " scl--login-full-border" : "") +
                                                (step === "password" && inputValue.length >= 2 ? " scl--login-full-border" : "")
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
                                            {!isLocked && inputValue.trim().length >= 1 && (
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
                                            {inputValue.trim().length >= 1 && (
                                                <button
                                                    type="submit"
                                                    className={
                                                        `${step === "username" && inputValue.length >= 2 ? "scl--btn-active" : ""}
                                                         ${step === "password" && inputValue.length >= 2 ? "scl--btn-active" : ""}
                                                        `
                                                    }
                                                >
                                                    <svg className="svg-login-btn" width="37" height="31"
                                                         viewBox="0 0 37 31" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M34.5 15.5L35.4959 14.7445L36.069 15.5L35.4959 16.2555L34.5 15.5ZM1.5 16.75C0.809643 16.75 0.25 16.1904 0.25 15.5C0.25 14.8096 0.809643 14.25 1.5 14.25V16.75ZM23.5 1L24.4959 0.244517L35.4959 14.7445L34.5 15.5L33.5041 16.2555L22.5041 1.75548L23.5 1ZM34.5 15.5L35.4959 16.2555L24.4959 30.7555L23.5 30L22.5041 29.2445L33.5041 14.7445L34.5 15.5ZM34.5 15.5V16.75H1.5V15.5V14.25H34.5V15.5Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </form>
                                {
                                    step !== 'otp' && (<span
                                        className={`scl--login-error ${error ? "visible" : ""}`}>{error}</span>)
                                }
                            </div>
                        </div>
                    </div>

                    {/*Loading Animation*/}
                    {/*{loading && (*/}
                    {/*    <span className="scl--barloader-container">*/}
                    {/*        <span className="scl--spinner-item"></span>*/}
                    {/*    </span>*/}
                    {/*)}*/}

                    {/*Loading Animation*/}
                    {loading && (
                        <span className="scl--barloader-container">
                            <BarLoader/>
                        </span>
                    )}

                    {/*Policy*/}
                    <div className="scl--login-text-policy">
                        <p>English (United State) <svg width="8" height="4" viewBox="0 0 8 4" fill="none"
                                                       xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L0 0H8L4 4Z" fill="white" fill-opacity="0.6"/>
                        </svg>
                        </p>
                        <ul>
                            <li>
                                <p>Help</p>
                            </li>
                            <li>
                                <p>Privacy</p>
                            </li>
                            <li>
                                <p>Term</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
