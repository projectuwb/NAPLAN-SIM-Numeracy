import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudent, setCurrentSession } from '../utils/storageManager';

function LandingPage() {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return;
    }

    const student = getStudent(studentId.trim());

    if (!student) {
      setError('Invalid Student ID. Please check and try again.');
      return;
    }

    if (student.status !== 'active') {
      setError('This Student ID has been deactivated. Please contact your teacher.');
      return;
    }

    // Set session and navigate to dashboard
    setCurrentSession(student.id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-medium text-gray-900 mb-2">
            NAPLAN Numeracy Practice
          </h1>
          <p className="text-gray-600">Victorian Students Practice Portal</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-medium mb-6">Login with Student ID</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your Student ID:
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="STU-Y3-XXXX"
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
              Login →
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm mb-2">Are you a teacher?</p>
          <button
            onClick={() => navigate('/admin')}
            className="text-primary hover:text-blue-700 font-medium text-sm"
          >
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
