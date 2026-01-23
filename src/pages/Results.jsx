import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentSession, getStudent } from '../utils/storageManager';
import { getPerformanceColor } from '../utils/bandCalculator';
import { formatAnswer } from '../utils/answerUtils';
import VisualRenderer from '../components/VisualRenderer';

function Results() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [student, setStudent] = useState(null);
  const [test, setTest] = useState(null);
  const [filter, setFilter] = useState('all'); // all, correct, incorrect
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

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

    // Find the test
    const testResult = studentData.tests.find(t => t.testId === testId);
    if (!testResult) {
      navigate('/dashboard');
      return;
    }

    setTest(testResult);

    // Debug logging
    console.log('=== RESULTS PAGE DEBUG ===');
    console.log('Test ID:', testId);
    console.log('Test data:', testResult);
    console.log('Questions count:', testResult.questions?.length);
    if (testResult.questions) {
      const answeredCount = testResult.questions.filter(q => q.studentAnswer && q.studentAnswer !== '').length;
      console.log('Questions with answers:', answeredCount);
      console.log('Sample question:', testResult.questions[0]);
    }

    // Expand first 5 questions by default
    setExpandedQuestions(new Set([0, 1, 2, 3, 4]));
  }, [navigate, testId]);

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedQuestions(new Set(test.questions.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  if (!student || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const filteredQuestions = test.questions.filter(q => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'incorrect') return !q.isCorrect;
    return true;
  });

  // Calculate improvement from previous test
  const testIndex = student.tests.findIndex(t => t.testId === testId);
  let improvement = null;
  if (testIndex > 0) {
    const previousTest = student.tests[testIndex - 1];
    improvement = test.percentage - previousTest.percentage;
  }

  const timeMinutes = Math.floor(test.timeSpent / 60);
  const timeSeconds = test.timeSpent % 60;

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
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900">Test Results</h1>
              <p className="text-gray-600">
                {test.type === 'full' ? 'Full Mock Test' : `Focus: ${test.focusTopic}`} • {new Date(test.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="card mb-8 text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-4">📊 Overall Score</h2>
          <div className="mb-4">
            <div className="text-5xl font-medium text-gray-900 mb-2">
              {test.questionsCorrect}/{test.questionsTotal}
            </div>
            <div className={`text-4xl font-medium mb-2 ${getPerformanceColor(test.percentage)}`}>
              {test.percentage.toFixed(1)}%
            </div>
            <div className="text-2xl font-medium text-gray-700">
              Band {test.bandScore}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {improvement !== null && (
              <div>
                <p className="text-gray-600 mb-1">Improvement</p>
                <p className={`text-lg font-medium ${
                  improvement > 0 ? 'text-green-600' : improvement < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-600 mb-1">Time Taken</p>
              <p className="text-lg font-medium text-gray-900">
                {timeMinutes}m {timeSeconds}s
              </p>
            </div>
          </div>
        </div>

        {/* Topic Breakdown */}
        {test.topicBreakdown && Object.keys(test.topicBreakdown).length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-medium mb-6">📈 Topic Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(test.topicBreakdown)
                .sort((a, b) => {
                  const aPerc = (a[1].correct / a[1].total) * 100;
                  const bPerc = (b[1].correct / b[1].total) * 100;
                  return bPerc - aPerc;
                })
                .map(([topic, stats]) => {
                  const percentage = (stats.correct / stats.total) * 100;
                  return (
                    <div key={topic}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{topic}</span>
                        <span className={`font-medium ${
                          percentage >= 80 ? 'text-green-600' :
                          percentage >= 60 ? 'text-yellow-600' :
                          percentage >= 40 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {stats.correct}/{stats.total} ({percentage.toFixed(0)}%)
                          {percentage < 70 && ' ⚠️'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
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
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({test.questions.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'correct'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Correct ({test.questionsCorrect})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'incorrect'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Incorrect ({test.questionsTotal - test.questionsCorrect})
          </button>
          <div className="flex-1"></div>
          <button
            onClick={expandAll}
            className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
          >
            Collapse All
          </button>
        </div>

        {/* Question-by-Question Review */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-medium">Question-by-Question Review</h2>

          {filteredQuestions.map((question, index) => {
            const originalIndex = test.questions.indexOf(question);
            const isExpanded = expandedQuestions.has(originalIndex);

            return (
              <div
                key={originalIndex}
                className={`card border-2 ${
                  question.isCorrect ? 'border-green-200' : 'border-red-200'
                }`}
              >
                <div
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleQuestion(originalIndex)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-700">Q{originalIndex + 1}</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        question.isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {question.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                      <span className="text-sm text-gray-600">{question.topic}</span>
                    </div>
                    {!isExpanded && (
                      <p className="text-gray-700 truncate">{question.questionText}</p>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 ml-4">
                    {isExpanded ? '▼' : '▶'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="mb-4">
                      <p className="font-medium text-gray-900 mb-3 text-lg">
                        {question.questionText}
                      </p>
                    </div>

                    {/* Visual Component */}
                    {question.visual && (
                      <VisualRenderer visual={question.visual} />
                    )}

                    {question.options && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                        <div className="space-y-1">
                          {question.options.map((option, idx) => {
                            const isStudentAnswer = option === question.studentAnswer;
                            const isCorrectAnswer = option === question.correctAnswer;
                            return (
                              <div
                                key={idx}
                                className={`p-2 rounded ${
                                  isCorrectAnswer
                                    ? 'bg-green-100 text-green-900'
                                    : isStudentAnswer && !question.isCorrect
                                    ? 'bg-red-100 text-red-900'
                                    : 'bg-gray-50'
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}. {option}
                                {isCorrectAnswer && ' ✓'}
                                {isStudentAnswer && !isCorrectAnswer && ' (Your answer)'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Your Answer:</p>
                        <p className={`text-lg font-medium ${
                          question.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {formatAnswer(question.studentAnswer)}
                        </p>
                      </div>
                      {!question.isCorrect && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</p>
                          <p className="text-lg font-medium text-green-700">
                            {formatAnswer(question.correctAnswer)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate('/test', { state: { type: test.type, topic: test.focusTopic } })}
            className="btn-secondary"
          >
            Start New Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
