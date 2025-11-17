import React from "react";
import { useAuthFormContext } from "../../hooks/useAuthForm";


export default function SwitchAuth() {
    const { isLogin, setIsLogin } = useAuthFormContext();


    return (
        <p className="text-center mt-6 text-sm text-gray-700">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
                className="text-blue-700 font-semibold ml-1"
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? "Register" : "Login"}
            </button>
        </p>
    );
}