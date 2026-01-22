import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getCurrentSession,
  getStudent,
  saveTestResult,
  saveActiveTest,
  getActiveTest,
  clearActiveTest
} from '../utils/storageManager';
import { generateTest, generateFocusTest } from '../utils/questionGenerator';
import { calculateBandScore } from '../utils/bandCalculator';
import { TEST_CONFIG } from '../utils/constants';
import Timer from '../components/Timer';
import Calculator from '../components/Calculator';
import questionBank from '../data/numeracyQuestionBank.json';

function TestInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [testType, setTestType] = useState('full');
  const [testTopic, setTestTopic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Check for active test or create new one
    const activeTest = getActiveTest();
    if (activeTest && activeTest.studentId === studentData.id) {
      // Resume existing test
      setQuestions(activeTest.questions);
      setAnswers(activeTest.answers);
      setCurrentQuestionIndex(activeTest.currentQuestionIndex || 0);
      setStartTime(activeTest.startTime);
      setTestType(activeTest.testType);
      setTestTopic(activeTest.testTopic);
    } else {
      // Create new test
      const type = location.state?.type || 'full';
      const topic = location.state?.topic || null;
      setTestType(type);
      setTestTopic(topic);

      const templates = questionBank[`year${studentData.yearLevel}`];
      let generatedQuestions;

      if (type === 'focus' && topic) {
        generatedQuestions = generateFocusTest(templates, topic, 10);
      } else {
        const config = TEST_CONFIG[studentData.yearLevel];
        generatedQuestions = generateTest(templates, config.questionCount);
      }

      setQuestions(generatedQuestions);
      setStartTime(Date.now());

      // Save as active test
      saveActiveTest({
        studentId: studentData.id,
        questions: generatedQuestions,
        answers: {},
        currentQuestionIndex: 0,
        startTime: Date.now(),
        testType: type,
        testTopic: topic
      });
    }
  }, [navigate, location]);

  // Auto-save on answer change
  useEffect(() => {
    if (student && questions.length > 0) {
      saveActiveTest({
        studentId: student.id,
        questions,
        answers,
        currentQuestionIndex,
        startTime,
        testType,
        testTopic
      });
    }
  }, [answers, currentQuestionIndex, student, questions, startTime, testType, testTopic]);

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;

    if (unansweredCount > 0) {
      if (!window.confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`)) {
        return;
      }
    }

    processTestSubmission();
  };

  const handleTimerExpire = () => {
    if (!isSubmitting) {
      alert('Time is up! Your test will be submitted automatically.');
      processTestSubmission();
    }
  };

  const processTestSubmission = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // seconds

    // Calculate results
    let correctCount = 0;
    const topicBreakdown = {};
    const questionsWithAnswers = questions.map((q, index) => {
      const studentAnswer = answers[index] || '';
      const isCorrect = String(studentAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

      if (isCorrect) correctCount++;

      // Track topic performance
      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[q.topic].total++;
      if (isCorrect) topicBreakdown[q.topic].correct++;

      return {
        templateId: q.templateId,
        questionText: q.questionText,
        studentAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        topic: q.topic,
        options: q.options
      };
    });

    const percentage = (correctCount / questions.length) * 100;
    const bandScore = calculateBandScore(percentage, student.yearLevel);

    const testResult = {
      testId: `test-${Date.now()}`,
      type: testType,
      focusTopic: testTopic,
      date: new Date().toISOString(),
      questionsTotal: questions.length,
      questionsCorrect: correctCount,
      percentage: Math.round(percentage * 10) / 10,
      bandScore,
      timeSpent,
      topicBreakdown,
      questions: questionsWithAnswers
    };

    // Save test result
    saveTestResult(student.id, testResult);

    // Clear active test
    clearActiveTest();

    // Navigate to results
    navigate(`/results/${testResult.testId}`);
  };

  if (!student || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const config = TEST_CONFIG[student.yearLevel];
  const timeLimit = testType === 'focus' ? 15 : config.timeLimit;
  const showCalcButton = student.yearLevel === 7 && currentQuestionIndex >= 8;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
                  navigate('/dashboard');
                }
              }}
              className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Home"
            >
              🏠
            </button>
            <div className="text-sm text-gray-600">
              {testType === 'full' ? 'Full Mock Test' : `Focus: ${testTopic}`}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Timer timeLimit={timeLimit} onExpire={handleTimerExpire} />
            <div className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1}/{questions.length}
            </div>
          </div>
        </div>

        {/* Calculator Button for Year 7 */}
        {showCalcButton && (
          <div className="mb-4">
            <button
              onClick={() => setShowCalculator(true)}
              className="btn-secondary"
            >
              🔢 Calculator
            </button>
          </div>
        )}

        {/* Question Display */}
        <div className="card mb-6">
          <div className="mb-6">
            <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
              {currentQuestion.questionText}
            </p>
          </div>

          {/* Answer Input */}
          {currentQuestion.answerType === 'numeric' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer:
              </label>
              <input
                type="text"
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="input-field w-full text-lg"
                placeholder="Enter your answer"
                autoFocus
              />
            </div>
          ) : (
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestionIndex] === option
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answers[currentQuestionIndex] === option}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">
                    {String.fromCharCode(65 + idx)}. {option}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Question Navigator */}
        <div className="card mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigator:</h3>
          <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJumpToQuestion(index)}
                className={`p-2 rounded text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-white'
                    : answers[index] !== undefined
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
                {answers[index] !== undefined && index !== currentQuestionIndex && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="btn-primary text-lg px-8 py-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
}

export default TestInterface;
