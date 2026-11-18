import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from "../api";

const emptyForm = { fullName: "", email: "", matricule: "" };

function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      setStudents(await getStudents());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadStudents();
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
        await updateStudent(editingId, formData);
      } else {
        await createStudent(formData);
      }

      resetForm();
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(student) {
    setEditingId(student.id);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      matricule: student.matricule
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this student and all their attendance records?")) {
      return;
    }

    try {
      await deleteStudent(id);
      loadStudents();
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

      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

      <form className="inline-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="matricule"
          placeholder="Matricule"
          value={formData.matricule}
          onChange={handleChange}
          required
        />

        <button type="submit">{editingId ? "Save" : "Add"}</button>

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
            <th>Full Name</th>
            <th>Email</th>
            <th>Matricule</th>
            <th>Records</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan="5" className="empty">No students yet.</td>
            </tr>
          )}

          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.matricule}</td>
              <td>{student.attendances.length}</td>
              <td className="actions">
                <button className="small" onClick={() => handleEdit(student)}>
                  Edit
                </button>
                <button
                  className="small danger"
                  onClick={() => handleDelete(student.id)}
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

export default Students;
