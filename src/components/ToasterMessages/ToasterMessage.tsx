import {useEffect, useState, type ReactNode} from "react";
import "./ToasterMessage.css";

type ToastType = "success" | "no-connection" | "unsuccess" | "new-device";

interface ToastData {
    title?: string;
    description?: string;
    svg?: ReactNode;
    type: ToastType;
}

const toastMessages: ToastData[] = [
    {
        title: "Login successfully",
        description: "Your login has successfully.",
        svg: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20Z"
                    fill="#00DF80"
                />
            </svg>
        ),
        type: "success",
    },
    {
        title: "No internet connection.",
        description: "Please check your network and try again.",
        svg: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#F05C42"/>
                <path d="M13.25 8.9996C11.3662 7.33347 8.75 7.33347 6.75 8.9996" stroke="#242C32" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M5 7.49936C8.15789 4.83356 11.8421 4.83355 15 7.49931" stroke="#242C32" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M9.99643 11.4893V12.2449M9.99643 13.2303V13.2458" stroke="#242C32" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        ),
        type: "no-connection",
    },
    {
        title: "Login Unsuccessfully",
        description: "Your login was unsuccessful.",
        svg: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.4 15L10 11.4L13.6 15L15 13.6L11.4 10L15 6.4L13.6 5L10 8.6L6.4 5L5 6.4L8.6 10L5 13.6L6.4 15ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20Z"
                    fill="#F04248"
                />
            </svg>
        ),
        type: "unsuccess",
    },
    {
        title: "New device detected.",
        description: "Are you trying to sign in from a new device?",
        svg: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#0562BB"/>
                <path d="..." fill="#242C32"/>
            </svg>
        ),
        type: "new-device",
    },
];

interface ToasterMessageProps {
    type?: ToastType;
}

const ToasterMessage = ({type}: ToasterMessageProps) => {
    const toast = toastMessages.find((t) => t.type === type);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        const fadeOut = setTimeout(() => setAnimateOut(true), 4800);
        const cleanup = setTimeout(() => setAnimateOut(false), 5200);
        return () => {
            clearTimeout(fadeOut);
            clearTimeout(cleanup);
        };
    }, [type]);

    if (!toast) return null;

    return (
        <div
            className={`scl--login-toast 
        ${toast.type === "new-device" ? "scl--login-toast--wide" : ""}
        ${animateOut ? "scl--login-toast-animate-out" : "scl--login-toast-animate-in"}`}
        >
            <div className="scl--login-toast-message">
                <div className={`scl--login-toast-svg toast--${toast.type}`}>
                    {toast.svg}
                </div>
                <div className="scl--login-toast-title">
                    <p>{toast.title}</p>
                    <p>{toast.description}</p>
                </div>
                {toast.type === "new-device" && (
                    <div className="scl--login-confirm-newdevice">
                        <p>That was me</p>
                        <span/>
                        <p>That wasn't me</p>
                    </div>
                )}
            </div>
            <div className={`scl--login-toast-bar toast--${toast.type}`}/>
        </div>
    );
};

export default ToasterMessage;
