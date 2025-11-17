// =============================
// AuthForm.jsx
// =============================
import React, { useState } from "react";
import Input from "./Input";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuthFormContext } from "../../hooks/useAuthForm";
import { authRequest } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        isStudent,
        isLogin,
        id,
        setId,
        email,
        setEmail,
        course,
        setCourse,
        section,
        setSection,
        password,
        setPassword,
    } = useAuthFormContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Create payload
        const payload = { password };

        if (isStudent) payload.studentId = id;
        else payload.adminId = id;

        if (!isLogin) {
            payload.emailId = email;
            if (isStudent) {
                payload.course = course;
                payload.section = section;
            }
        }

        // API call
        const result = await authRequest(payload, isLogin, isStudent);

        setLoading(false);

        if (result.success) {
            // Save user data in localStorage
            localStorage.setItem("user", JSON.stringify(result.data.user));
            

            toast.success("Success!");
            navigate("/dashboard", { replace: true });
        }

        else {
            toast.error(result.message);
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
                placeholder={isStudent ? "Student ID" : "Admin ID"}
                value={id}
                onChange={(e) => setId(e.target.value)}
            />

            {!isLogin && (
                <Input
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}

            {!isLogin && isStudent && (
                <Input
                    placeholder="Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                />
            )}

            {!isLogin && isStudent && (
                <Input
                    placeholder="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                />
            )}

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white w-full p-3 rounded-xl font-semibold shadow-lg mt-2"
            >
                {loading ? "Loading..." : isLogin ? "Login" : "Register"}
            </motion.button>
        </form>
    );
}
