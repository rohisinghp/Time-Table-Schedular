import React from "react";
import ToggleRole from "../../components/auth/ToggleRole";
import AuthForm from "../../components/auth/AuthForm";
import SwitchAuth from "../../components/auth/SwitchAuth";
import { motion } from "framer-motion";


export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md backdrop-blur-lg bg-white/70 shadow-2xl rounded-3xl p-10 border border-white/40"
            >
                <ToggleRole />
                <AuthForm />
                <SwitchAuth />
            </motion.div>
        </div>
    );
}