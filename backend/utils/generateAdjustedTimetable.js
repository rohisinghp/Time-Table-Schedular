// utils/generateAdjustedTimetable.js (debug version)
import subjectPriority from "../data/subjectPriority.js";

/** Normalize faculty names to lowercase tokens */
function extractTeachers(facultyString) {
  if (!facultyString) return [];
  return facultyString
    .split(/[,/]/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

/** Return a deep copy of timetable object (so we never mutate DB objects) */
function deepCopyTimetable(rawSubjects, section) {
  const tt = {};
  rawSubjects.forEach(s => {
    tt[s._id] = JSON.parse(JSON.stringify(s.toObject ? s.toObject() : s));
    if (!tt[s._id].timings) tt[s._id].timings = {};
    if (!tt[s._id].timings[section]) tt[s._id].timings[section] = [];
  });
  return tt;
}

/**
 * generateAdjustedTimetable(section, activeLeaves, Subject)
 * - returns adjusted timetable (in-memory) and a report of replacements done / failed
 */
export async function generateAdjustedTimetable(section, activeLeaves, Subject) {
  const rawSubjects = await Subject.find();
  const timetable = deepCopyTimetable(rawSubjects, section);

  const report = {
    activeLeaves,
    replacements: [],   // { teacherName, subjectCode, day, time, replacement }
    skipped: []         // reasons why replacement not done
  };

  if (!activeLeaves || activeLeaves.length === 0) {
    console.log("No active leaves -> returning original timetable");
    return { timetable, report };
  }

  console.log("Active leaves:", activeLeaves);

  for (const leave of activeLeaves) {
    const teacherName = String(leave.teacherName || "").trim();
    const normalizedLeave = teacherName.toLowerCase();
    console.log("\nProcessing leave for:", teacherName);

    // Find classes taught by that teacher
    const teacherClasses = []; // { subjectCode, day, time }

    for (const subjectCode in timetable) {
      const subj = timetable[subjectCode];
      const facultyList = extractTeachers(subj.faculty);
      if (facultyList.includes(normalizedLeave)) {
        // collect timings (for requested section)
        const list = subj.timings[section] || [];
        list.forEach(slot => teacherClasses.push({
          subjectCode,
          day: slot.day,
          time: slot.time
        }));
      }
    }

    if (teacherClasses.length === 0) {
      report.skipped.push({
        teacherName,
        reason: "no-classes-found"
      });
      console.log(`No classes found for ${teacherName} (maybe faculty string mismatch?)`);
      continue;
    }

    console.log(`Found ${teacherClasses.length} classes for ${teacherName}:`, teacherClasses);

    // For each class, remove and try to replace
    for (const cls of teacherClasses) {
      const { subjectCode, day, time } = cls;
      console.log(`Attempting replace: ${subjectCode} ${day} ${time}`);

      // Remove original slot
      timetable[subjectCode].timings[section] =
        (timetable[subjectCode].timings[section] || []).filter(s => !(s.day === day && s.time === time));

      // Build busy set
      const busy = new Set();
      for (const sc in timetable) {
        const arr = timetable[sc].timings[section] || [];
        arr.forEach(t => { if (t.day === day && t.time === time) busy.add(sc); });
      }

      // Free subjects
      const freeSubjects = Object.keys(timetable).filter(sc => !busy.has(sc) && sc !== subjectCode);

      console.log("Busy at that slot:", [...busy]);
      console.log("Free candidates:", freeSubjects);

      if (freeSubjects.length === 0) {
        report.skipped.push({
          teacherName,
          subjectCode,
          day,
          time,
          reason: "no-free-subjects"
        });
        console.log("No free subjects available -> skipping replacement for this slot");
        continue;
      }

      // Sort by priority
      freeSubjects.sort((a, b) => (subjectPriority[b] || 0) - (subjectPriority[a] || 0));
      const replacement = freeSubjects[0];

      // Insert replacement
      timetable[replacement].timings[section].push({ day, time });

      report.replacements.push({
        teacherName,
        subjectCode,
        day,
        time,
        replacement
      });

      console.log(`Replaced ${subjectCode} with ${replacement} on ${day} ${time}`);
    }
  }

  return { timetable, report };
}
