import React from "react";
import { motion } from "framer-motion";


export default function Input({ type = "text", placeholder, value, onChange }) {
    return (
        <motion.input
            whileFocus={{ scale: 1.02 }}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="p-3 border rounded-xl bg-white/80 shadow-sm"
        />
    );
}