import { STORAGE_KEYS } from './constants';

// Admin functions
export function setAdminPassword(password) {
  // Simple hash function (in production, use bcrypt or similar)
  const hash = btoa(password);
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, hash);
}

export function checkAdminPassword(password) {
  const storedHash = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
  if (!storedHash) return false;
  return btoa(password) === storedHash;
}

export function hasAdminPassword() {
  return !!localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
}

// Student functions
export function getAllStudents() {
  const studentsJson = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return studentsJson ? JSON.parse(studentsJson) : {};
}

export function getStudent(studentId) {
  const students = getAllStudents();
  return students[studentId] || null;
}

export function saveStudent(student) {
  const students = getAllStudents();
  students[student.id] = student;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function deleteStudent(studentId) {
  const students = getAllStudents();
  delete students[studentId];
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function generateStudentId(yearLevel) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `STU-Y${yearLevel}-${code}`;
}

export function isStudentIdUnique(studentId) {
  const students = getAllStudents();
  return !students[studentId];
}

export function createStudent(name, yearLevel) {
  let studentId;
  do {
    studentId = generateStudentId(yearLevel);
  } while (!isStudentIdUnique(studentId));

  const student = {
    id: studentId,
    name,
    yearLevel,
    status: 'active',
    createdAt: new Date().toISOString(),
    tests: []
  };

  saveStudent(student);
  return student;
}

// Session functions
export function setCurrentSession(studentId) {
  const session = {
    studentId,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
}

export function getCurrentSession() {
  const sessionJson = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  return sessionJson ? JSON.parse(sessionJson) : null;
}

export function clearCurrentSession() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
}

// Active test functions
export function saveActiveTest(testData) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TEST, JSON.stringify(testData));
}

export function getActiveTest() {
  const testJson = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEST);
  return testJson ? JSON.parse(testJson) : null;
}

export function clearActiveTest() {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEST);
}

// Test functions
export function saveTestResult(studentId, testResult) {
  const student = getStudent(studentId);
  if (!student) return false;

  student.tests.push(testResult);
  saveStudent(student);
  return true;
}

export function getStudentTests(studentId) {
  const student = getStudent(studentId);
  return student ? student.tests : [];
}

export function clearStudentProgress(studentId) {
  const student = getStudent(studentId);
  if (!student) return false;

  student.tests = [];
  saveStudent(student);
  return true;
}

// Export all data
export function exportAllData() {
  return {
    students: getAllStudents(),
    exportDate: new Date().toISOString()
  };
}
