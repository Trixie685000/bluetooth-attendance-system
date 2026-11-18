import { useEffect, useState } from "react";
import {
  getStudents,
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from "../api";

const emptyForm = { studentId: "", course: "", status: "Present" };

function Attendance() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [attendanceData, studentData] = await Promise.all([
        getAttendance(),
        getStudents()
      ]);
      setRecords(attendanceData);
      setStudents(studentData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateAttendance(editingId, {
          course: formData.course,
          status: formData.status
        });
      } else {
        await createAttendance(formData);
      }

      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(record) {
    setEditingId(record.id);
    setFormData({
      studentId: String(record.studentId),
      course: record.course,
      status: record.status
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this attendance record?")) {
      return;
    }

    try {
      await deleteAttendance(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormData(emptyForm);
  }

  return (
    <div className="panel">

      <h2>{editingId ? "Edit Attendance" : "Record Attendance"}</h2>

      <form className="inline-form" onSubmit={handleSubmit}>

        {/* The API does not allow changing the student of an existing record */}
        <select
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          disabled={editingId !== null}
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.fullName} ({student.matricule})
            </option>
          ))}
        </select>

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
        />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>

        <button type="submit">{editingId ? "Save" : "Record"}</button>

        {editingId && (
          <button type="button" className="secondary" onClick={resetForm}>
            Cancel
          </button>
        )}

      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Matricule</th>
            <th>Course</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan="6" className="empty">No attendance records yet.</td>
            </tr>
          )}

          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.student.fullName}</td>
              <td>{record.student.matricule}</td>
              <td>{record.course}</td>
              <td>{new Date(record.date).toLocaleString()}</td>
              <td>
                <span className={`status ${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </td>
              <td className="actions">
                <button className="small" onClick={() => handleEdit(record)}>
                  Edit
                </button>
                <button
                  className="small danger"
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Attendance;
