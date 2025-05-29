import React, {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type FormEventHandler,
} from "react";
import "./LoginPage.css";
import BackgroungImage from "../../assets/scl-loginbg.jpg";
import Profile from "../../assets/profile.jpg";
import SCLLogo from "../../assets/scl-logo.png";
import { FaArrowRight } from "react-icons/fa";
import { MdContentCopy, MdVerified } from "react-icons/md";

const LoginPage = () => {
  const [step, setStep] = useState<"name" | "password" | "otp">("name");
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputsRef = useRef<HTMLInputElement[]>([]);

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

    if (step === "name") {
      if (!inputValue.trim()) return;
      setLoading(true);

      // Simulate checking email (you can also fetch user profile info here if needed)
      setTimeout(() => {
        setLoading(false);
        setStep("password");
        setInputValue("");
        setTimeout(() => inputRef.current?.focus(), 0); // focus after DOM update
      }, 1000);
    } else if (step === "password") {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/v1/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }),
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
          console.log("Log Successfully.");
          setLoginSuccess(loginSuccess)
          // Redirect or set token here
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        setLoading(false);
        alert("Network error");
      }
    } else if (step === "otp") {
      const enteredOtp = otp.join("");
      if (enteredOtp === "123456") {
        alert("OTP Verified! ✅");
        // Proceed to dashboard or auth logic
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

  const isTyping = inputValue.trim() !== "";

  return (
    <>
      <div className={loading ? "scl--loading-semi-transparent" : ""}></div>
      <div className="scl--login-page">
        <img src={BackgroungImage} alt="" />
        <div className="scl--login-form">
          <div className="scl--login-form-background">
            <div className="scl--login-form-logo">
              <img src={SCLLogo} alt="" />
              {step === "name" ? (
                <p>
                  With your username to continue. This account will be available
                  to other Sodexs applications.
                </p>
              ) : (
                <div className="scl--login-account-confirm">
                  <div className="scl--login-verify-name">
                    <span>You are verify</span>
                    <MdVerified />
                  </div>
                  <div className="scl--login-verify">
                    <div className="scl--login-verify-profile">
                      <img src={Profile} alt="" />
                    </div>
                    <span>uiuxdesign</span>
                  </div>
                </div>
              )}
            </div>
            <div className="scl--login-form-field">
              <div className="scl--login-form-field-title">
                <h2>Login</h2>
                {step === "name" && (
                  <p>Please input your username to continue your account.</p>
                )}

                {step === "password" && (
                  <p>Please input your password to continue your account.</p>
                )}

                {step === "otp" && (
                  <p>Please enter the 6-digit OTP code sent to your email.</p>
                )}
              </div>
              <div className="scl--login-form-field-input">
                <form onSubmit={handleSubmit}>
                  <div className="scl--login-full-form">
                    <input
                      ref={inputRef}
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
                    <div
                      className="scl--login-fn"
                      style={{ display: isTyping ? "flex" : "none" }}
                    >
                      <div className="scl--login-copy" onClick={handleCopy}>
                        {isCopy ? <span>Copied</span> : <MdContentCopy />}
                      </div>
                      <div className="scl--login-retype" onClick={handleRetype}>
                        <span>Retype</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      style={{
                        display: isTyping ? "block" : "none",
                        backgroundColor: isTyping ? "#286BEE" : "#282828",
                        color: isTyping ? "#ffffff" : "#cbc9c9",
                      }}
                    >
                      <FaArrowRight className="scl--login-full-form-icon" />
                    </button>
                  </div>
                  {/* <div className="scl--login-verify-otp">
                    <div className="scl--login-verify-boxes">
                      {[...Array(6)].map((_, index) => (
                        <input key={index} type="text" />
                      ))}
                    </div>
                    <div className="scl--login-verify-resend-code">
                      <span>Resend code?</span> <span>00:00</span>
                    </div>
                  </div> */}
                </form>
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
