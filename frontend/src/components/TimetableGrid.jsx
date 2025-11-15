import React from "react";
import { BookOpen, User } from "lucide-react";

const TIMES = [
  "8:00–8:55",
  "8:55–9:50",
  "9:50–10:10",
  "10:10–11:05",
  "11:05–12:00",
  "12:00–12:55",
  "1:10–2:05",
  "2:05–3:00",
  "3:10–4:05",
  "4:05–5:00",
  "5:00–5:55"
];


const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableGrid({ timetable }) {
  // Convert your DB format into grid format
  const getSlot = (day, time) => {
    for (let entry of timetable) {
      for (let slot of entry.timings) {
        if (slot.day === day && slot.time === time) {
          return entry; // subject entry
        }
      }
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1200px] w-full border-collapse">
        {/* Header */}
        <thead>
          <tr>
            <th className="p-4 text-white font-semibold bg-gradient-to-r from-purple-500 to-purple-700 rounded-tl-xl">
              Day / Time
            </th>
            {TIMES.map((t, i) => (
              <th key={i} className="p-4 text-white font-semibold bg-gradient-to-r from-purple-500 to-purple-700">
                <div className="flex items-center justify-center gap-2">
                  <span>🕒</span> {t}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {DAYS.map((day, rowIndex) => (
            <tr key={rowIndex} className="border">
              {/* Day Name */}
              <td className="p-4 font-semibold bg-gray-50">{day}</td>

              {/* Time Slots */}
              {TIMES.map((time, colIndex) => {
                const slot = getSlot(day, time);

                return (
                  <td key={colIndex} className="p-2 text-center align-top h-28">
                    {slot ? (
                      <div
                        className={`rounded-xl p-3 text-sm shadow-md border 
                        ${slot.subjectCode.includes("MC") ? "bg-blue-100 border-blue-300" : "bg-green-100 border-green-300"}
                        `}
                      >
                        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                          <BookOpen size={16} /> {slot.subjectCode}
                        </div>

                        <div className="mt-1 text-gray-700 font-medium">{slot.subjectName}</div>

                        <div className="flex items-center gap-1 mt-2 text-gray-600 text-sm">
                          <User size={14} /> {slot.faculty}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
