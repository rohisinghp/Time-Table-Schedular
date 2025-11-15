import { useEffect, useState } from "react";
import { API } from "../api";

function Timetable({ section }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTimetable();
  }, [section]);

  async function fetchTimetable() {
    try {
      setLoading(true);
      const res = await API.get(`/section/${section}`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Timetable for Section {section}
      </h2>

      {data.length === 0 ? (
        <p>No data found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Faculty</th>
              <th className="border p-2">Day</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) =>
              item.timings.map((slot, i) => (
                <tr key={i}>
                  <td className="border p-2">{item.subjectCode} - {item.subjectName}</td>
                  <td className="border p-2">{item.faculty}</td>
                  <td className="border p-2">{slot.day}</td>
                  <td className="border p-2">{slot.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Timetable;
