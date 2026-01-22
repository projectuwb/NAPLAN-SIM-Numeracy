import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentSession,
  getStudent,
  clearCurrentSession,
  clearStudentProgress
} from '../utils/storageManager';
import { calculateBandScore, getPerformanceColor } from '../utils/bandCalculator';

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      navigate('/');
      return;
    }

    const studentData = getStudent(session.studentId);
    if (!studentData) {
      navigate('/');
      return;
    }

    setStudent(studentData);
    calculateWeakTopics(studentData);
  }, [navigate]);

  const calculateWeakTopics = (studentData) => {
    if (!studentData.tests || studentData.tests.length === 0) {
      setWeakTopics([]);
      return;
    }

    const topicStats = {};

    studentData.tests.forEach(test => {
      if (test.topicBreakdown) {
        Object.entries(test.topicBreakdown).forEach(([topic, stats]) => {
          if (!topicStats[topic]) {
            topicStats[topic] = { correct: 0, total: 0 };
          }
          topicStats[topic].correct += stats.correct;
          topicStats[topic].total += stats.total;
        });
      }
    });

    const topics = Object.entries(topicStats)
      .map(([topic, stats]) => ({
        topic,
        percentage: (stats.correct / stats.total) * 100,
        correct: stats.correct,
        total: stats.total
      }))
      .sort((a, b) => a.percentage - b.percentage)
      .filter(t => t.percentage < 70);

    setWeakTopics(topics);
  };

  const handleStartTest = (type, topic = null) => {
    navigate('/test', { state: { type, topic } });
  };

  const handleLogout = () => {
    clearCurrentSession();
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      if (clearStudentProgress(student.id)) {
        alert('Progress reset successfully!');
        window.location.reload();
      }
    }
  };

  if (!student) {
    return <div className="p-8">Loading...</div>;
  }

  const fullTests = student.tests.filter(t => t.type === 'full');
  const focusUnlocked = fullTests.length >= 3;
  const avgScore = student.tests.length > 0
    ? student.tests.reduce((sum, t) => sum + t.percentage, 0) / student.tests.length
    : 0;
  const currentBand = avgScore > 0 ? calculateBandScore(avgScore, student.yearLevel) : null;
  const recentTests = [...student.tests].reverse().slice(0, 3);

  // Calculate improvement
  let improvement = 0;
  if (student.tests.length >= 2) {
    const latestScore = student.tests[student.tests.length - 1].percentage;
    const previousScore = student.tests[student.tests.length - 2].percentage;
    improvement = latestScore - previousScore;
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Home"
            >
              🏠
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
                Welcome, {student.name}
              </h1>
              <p className="text-gray-600">Year {student.yearLevel}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="btn-outline">
              Reset Progress
            </button>
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card mb-8">
          <h2 className="text-xl font-medium mb-6">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tests Completed</p>
              <p className="text-3xl font-medium text-primary">{student.tests.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-medium text-secondary">
                {avgScore > 0 ? `${avgScore.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Band</p>
              <p className="text-3xl font-medium text-gray-900">
                {currentBand ? `Band ${currentBand}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Improvement</p>
              <p className={`text-3xl font-medium ${
                improvement > 0 ? 'text-green-600' : improvement < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {improvement !== 0 ? `${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Topic Performance */}
        {student.tests.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-medium mb-6">📊 Topic Performance</h2>
            {(() => {
              const topicStats = {};
              student.tests.forEach(test => {
                if (test.topicBreakdown) {
                  Object.entries(test.topicBreakdown).forEach(([topic, stats]) => {
                    if (!topicStats[topic]) {
                      topicStats[topic] = { correct: 0, total: 0 };
                    }
                    topicStats[topic].correct += stats.correct;
                    topicStats[topic].total += stats.total;
                  });
                }
              });

              return (
                <div className="space-y-3">
                  {Object.entries(topicStats).map(([topic, stats]) => {
                    const percentage = (stats.correct / stats.total) * 100;
                    return (
                      <div key={topic}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{topic}</span>
                          <span className={`text-sm font-medium ${
                            percentage >= 80 ? 'text-green-600' :
                            percentage >= 60 ? 'text-yellow-600' :
                            percentage >= 40 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {percentage.toFixed(0)}% {percentage < 70 && '⚠️'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 80 ? 'bg-green-600' :
                              percentage >= 60 ? 'bg-yellow-600' :
                              percentage >= 40 ? 'bg-orange-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Start New Test */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Start New Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Mock Test */}
            <div className="card hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => handleStartTest('full')}>
              <div className="text-center">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-xl font-medium mb-2">Full Mock Test</h3>
                <p className="text-gray-600 mb-4">
                  {student.yearLevel === 3 ? '35 questions, 45 minutes' :
                   student.yearLevel === 5 ? '40 questions, 50 minutes' :
                   '48 questions, 60 minutes'}
                </p>
                <button className="btn-primary w-full">
                  Start Test
                </button>
              </div>
            </div>

            {/* Focus Mode */}
            <div className={`card ${focusUnlocked ? 'hover:shadow-xl cursor-pointer' : 'opacity-60'}`}>
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-medium mb-2">Focus Mode</h3>
                {focusUnlocked ? (
                  <>
                    <p className="text-green-600 font-medium mb-2">✓ Unlocked!</p>
                    {weakTopics.length > 0 ? (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-3">Practice your weak topics:</p>
                        <div className="space-y-2">
                          {weakTopics.slice(0, 3).map(topic => (
                            <button
                              key={topic.topic}
                              onClick={() => handleStartTest('focus', topic.topic)}
                              className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 px-3 rounded text-sm transition-colors"
                            >
                              {topic.topic} ({topic.percentage.toFixed(0)}%)
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-4">
                        Great job! No weak topics yet.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-2">🔒 Locked</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Complete {3 - fullTests.length} more full test{3 - fullTests.length !== 1 ? 's' : ''} to unlock
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tests */}
        {recentTests.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-medium mb-4">Recent Tests</h2>
            <div className="space-y-2">
              {recentTests.map((test, index) => (
                <div
                  key={test.testId}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => navigate(`/results/${test.testId}`)}
                >
                  <div>
                    <p className="font-medium">
                      Test #{student.tests.length - index} - {test.type === 'full' ? 'Full Mock' : 'Focus Mode'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(test.date).toLocaleDateString()} • {test.questionsCorrect}/{test.questionsTotal} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-medium ${getPerformanceColor(test.percentage)}`}>
                      {test.percentage.toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-600">Band {test.bandScore}</p>
                  </div>
                </div>
              ))}
            </div>
            {student.tests.length > 3 && (
              <button className="mt-4 text-primary hover:text-blue-700 text-sm font-medium">
                View All Tests →
              </button>
            )}
          </div>
        )}

        {/* First time message */}
        {student.tests.length === 0 && (
          <div className="card bg-blue-50 border-2 border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Welcome! 👋</h3>
            <p className="text-blue-800">
              Ready to start your first practice test? Click on "Full Mock Test" above to begin.
              After completing 3 full tests, you'll unlock Focus Mode to practice specific topics!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
