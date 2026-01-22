import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  hasAdminPassword,
  setAdminPassword,
  checkAdminPassword,
  getAllStudents,
  createStudent,
  saveStudent,
  deleteStudent,
  exportAllData
} from '../utils/storageManager';

function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentYear, setNewStudentYear] = useState(3);
  const [createdStudent, setCreatedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasAdminPassword()) {
      setNeedsSetup(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadStudents();
    }
  }, [isAuthenticated]);

  const loadStudents = () => {
    setStudents(getAllStudents());
  };

  const handleSetup = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setAdminPassword(password);
    setNeedsSetup(false);
    setIsAuthenticated(true);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (checkAdminPassword(password)) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    setError('');

    if (!newStudentName.trim()) {
      setError('Please enter student name');
      return;
    }

    const student = createStudent(newStudentName.trim(), newStudentYear);
    setCreatedStudent(student);
    setNewStudentName('');
    setNewStudentYear(3);
    setShowCreateForm(false);
    loadStudents();
  };

  const handleToggleStatus = (studentId) => {
    const student = students[studentId];
    student.status = student.status === 'active' ? 'inactive' : 'active';
    saveStudent(student);
    loadStudents();
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? All their data will be lost.')) {
      deleteStudent(studentId);
      loadStudents();
    }
  };

  const handleExportData = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naplan-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Setup screen
  if (needsSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Admin Setup</h1>
            <p className="text-gray-600">Create your admin password</p>
          </div>

          <div className="card">
            <form onSubmit={handleSetup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full"
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                Create Admin Account
              </button>
            </form>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600">Enter your password to continue</p>
          </div>

          <div className="card">
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full"
                  autoFocus
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                Login
              </button>
            </form>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Student Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main admin dashboard
  const studentList = Object.values(students);
  const totalTests = studentList.reduce((sum, s) => sum + s.tests.length, 0);
  const avgScores = {};

  studentList.forEach(student => {
    student.tests.forEach(test => {
      if (!avgScores[student.yearLevel]) {
        avgScores[student.yearLevel] = { total: 0, count: 0 };
      }
      avgScores[student.yearLevel].total += test.percentage;
      avgScores[student.yearLevel].count++;
    });
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600">Manage students and view analytics</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-outline"
          >
            ← Student Login
          </button>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Students</h3>
            <p className="text-3xl font-medium text-primary">{studentList.length}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tests</h3>
            <p className="text-3xl font-medium text-secondary">{totalTests}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Average Scores</h3>
            {Object.entries(avgScores).map(([year, data]) => (
              <div key={year} className="text-sm">
                Year {year}: {(data.total / data.count).toFixed(1)}%
              </div>
            ))}
            {Object.keys(avgScores).length === 0 && (
              <p className="text-gray-500">No data yet</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            + Generate Student ID
          </button>
          <button
            onClick={handleExportData}
            className="btn-secondary"
          >
            Export Data (JSON)
          </button>
        </div>

        {/* Create Student Form */}
        {showCreateForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-medium mb-4">Generate Student ID</h2>
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter student name"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Level
                </label>
                <select
                  value={newStudentYear}
                  onChange={(e) => setNewStudentYear(Number(e.target.value))}
                  className="input-field w-full"
                >
                  <option value={3}>Year 3</option>
                  <option value={5}>Year 5</option>
                  <option value={7}>Year 7</option>
                </select>
              </div>
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Generate ID
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError('');
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Created Student Confirmation */}
        {createdStudent && (
          <div className="card mb-6 bg-green-50 border-2 border-green-200">
            <h2 className="text-xl font-medium mb-4 text-green-800">Student ID Created!</h2>
            <div className="space-y-2 mb-4">
              <p><strong>Name:</strong> {createdStudent.name}</p>
              <p><strong>Year Level:</strong> {createdStudent.yearLevel}</p>
              <p className="text-2xl font-mono"><strong>ID:</strong> {createdStudent.id}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(createdStudent.id)}
                className="btn-primary"
              >
                Copy ID
              </button>
              <button
                onClick={() => setCreatedStudent(null)}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Student List */}
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Student Management</h2>

          {studentList.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No students yet. Generate a student ID to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Year</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Tests</th>
                    <th className="text-left py-3 px-2">Avg Score</th>
                    <th className="text-left py-3 px-2">Created</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map(student => {
                    const avgScore = student.tests.length > 0
                      ? (student.tests.reduce((sum, t) => sum + t.percentage, 0) / student.tests.length).toFixed(1)
                      : 'N/A';

                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 font-mono text-sm">{student.id}</td>
                        <td className="py-3 px-2">{student.name}</td>
                        <td className="py-3 px-2">{student.yearLevel}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">{student.tests.length}</td>
                        <td className="py-3 px-2">{avgScore}{avgScore !== 'N/A' && '%'}</td>
                        <td className="py-3 px-2 text-sm">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleStatus(student.id)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {student.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;
