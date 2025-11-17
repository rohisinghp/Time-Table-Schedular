import React from "react";
import { useAuthFormContext } from "../../hooks/useAuthForm";


export default function ToggleRole() {
    const { isStudent, setIsStudent } = useAuthFormContext();


    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Smart Timetable Schedular</h1>
        
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-2xl shadow-inner">
            
            <button
                onClick={() => setIsStudent(true)}
                className={`flex-1 p-3 rounded-2xl font-semibold transition-all duration-300 ${isStudent ? "bg-blue-600 text-white shadow-md" : "text-gray-600"
                    }`}
            >
                Student
            </button>
            <button
                onClick={() => setIsStudent(false)}
                className={`flex-1 p-3 rounded-2xl font-semibold transition-all duration-300 ${!isStudent ? "bg-blue-600 text-white shadow-md" : "text-gray-600"
                    }`}
            >
                Teacher
            </button>
        </div>
        </div>
    );
}