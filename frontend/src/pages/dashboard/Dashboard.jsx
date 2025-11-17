import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  User
} from "lucide-react";
import LogoutButton from "../../components/auth/LogoutButton";

export default function Dashboard() {
  // Read logged-in user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isStudent = user?.role === "student";

  // Fixed course/section list for teachers
  const [courses] = useState(["MCA", "MSc IT"]);
  const [sections] = useState(["A", "B", "C", "D", "MScIT"]);

  // Student → auto-load from backend data
  const [selectedCourse, setSelectedCourse] = useState(user?.course || "MCA");
  const [selectedSection, setSelectedSection] = useState(user?.section || "A");

  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Leave form (only for teachers)
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    teacherName: user?.adminId || "",
    startDate: "",
    endDate: ""
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const timeSlots = [
    "8:00–8:55",
    "8:55–9:50",
    "10:10–11:05",
    "11:05–12:00",
    "12:00–12:55",
    "1:10–2:05",
    "2:05–3:00",
    "3:10–4:05",
    "4:05–5:00"
  ];

  // Load timetable whenever section changes
  useEffect(() => {
    fetchTimetable();
  }, [selectedSection]);

  const fetchTimetable = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/section/${selectedSection}`);
    const data = await res.json();
    setTimetableData(data);
    setLoading(false);
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    setLeaveSubmitting(true);

    await fetch("http://localhost:5000/api/leave/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leaveForm)
    });

    setLeaveSuccess(true);
    fetchTimetable();

    setTimeout(() => {
      setLeaveSuccess(false);
      setShowLeaveForm(false);
    }, 2000);

    setLeaveSubmitting(false);
  };

  const isLab = (code) => code.includes("LAB") || code.startsWith("PMC");

  const getColor = (code, replaced) => {
    if (replaced) return "bg-red-100 border-red-400 text-red-900";
    if (isLab(code)) return "bg-blue-100 border-blue-300 text-blue-900";
    return "bg-green-100 border-green-300 text-green-900";
  };

  const getClassInfo = (day, time) => {
    for (const s of timetableData) {
      const t = s.timings?.find((x) => x.day === day && x.time === time);
      if (t) {
        return {
          ...s,
          replaced: s.originalSubjectCode !== s.subjectCode
        };
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow p-6 rounded-xl mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-indigo-600" /> Timetable Viewer
          </h1>

          {/* Teacher only */}
          {!isStudent && (
            <button
              onClick={() => setShowLeaveForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FileText className="w-5 h-5" /> Apply Leave
            </button>
          )}

          <LogoutButton />
        </div>

        {/* Teacher dropdowns */}
        {!isStudent && (
          <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4">
            <div className="flex-1">
              <label className="font-medium">Course</label>
              <select
                className="w-full mt-1 border p-3 rounded-lg"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="font-medium">Section</label>
              <select
                className="w-full mt-1 border p-3 rounded-lg"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Student banner */}
        {isStudent && (
          <div className="bg-white p-4 rounded-xl shadow mb-6 text-lg font-semibold">
            Logged in as Student — Section: <span className="text-indigo-600">{selectedSection}</span>
          </div>
        )}

        {/* Leave Form (Teacher Only) */}
        {!isStudent && showLeaveForm && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

            {leaveSuccess && (
              <div className="bg-green-100 border border-green-300 p-3 mb-4 rounded-lg">
                Leave submitted!
              </div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={submitLeave}>
              <input
                type="text"
                placeholder="Teacher Name"
                className="border p-3 rounded-lg"
                value={leaveForm.teacherName}
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, teacherName: e.target.value })
                }
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={leaveForm.startDate}
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, startDate: e.target.value })
                }
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={leaveForm.endDate}
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, endDate: e.target.value })
                }
              />

              <button className="col-span-full bg-indigo-600 text-white p-3 rounded-lg" disabled={leaveSubmitting}>
                {leaveSubmitting ? "Submitting..." : "Submit Leave"}
              </button>
            </form>
          </div>
        )}

        {/* Timetable */}
        {!loading && timetableData.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="p-4 sticky left-0 bg-indigo-600">Day</th>
                    {timeSlots.map((slot) => (
                      <th key={slot} className="p-4">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {days.map((day, idx) => (
                    <tr key={day} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 sticky left-0 bg-inherit font-medium">{day}</td>

                      {timeSlots.map((time) => {
                        const info = getClassInfo(day, time);

                        return (
                          <td key={time} className="p-2">
                            {info ? (
                              <div
                                className={`${getColor(
                                  info.subjectCode,
                                  info.replaced
                                )} p-3 border rounded-lg min-h-[75px]`}
                              >
                                <div className="font-semibold">{info.subjectName}</div>
                                <div className="text-xs opacity-70">{info.subjectCode}</div>

                                <div className="text-xs flex gap-1 mt-1">
                                  <User className="w-3 h-3" />
                                  {info.faculty}
                                </div>

                                {info.replaced && (
                                  <div className="mt-1 text-xs font-bold flex items-center gap-1 text-red-600">
                                    <AlertCircle className="w-3 h-3" /> REPLACED
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center text-gray-300">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-12 bg-white rounded-xl shadow text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto" />
            <p className="mt-4">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
