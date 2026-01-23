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
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };
}

// Import all data (restore from backup)
export function importAllData(data) {
  try {
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    if (!data.students || typeof data.students !== 'object') {
      throw new Error('Invalid students data');
    }

    // Validate student objects
    const studentCount = Object.keys(data.students).length;
    if (studentCount === 0) {
      throw new Error('No students found in import data');
    }

    // Backup current data before import
    const backup = exportAllData();
    localStorage.setItem('naplan_backup_before_import', JSON.stringify(backup));

    // Import students
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));

    return {
      success: true,
      studentsImported: studentCount,
      message: `Successfully imported ${studentCount} student(s)`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Restore from last backup
export function restoreFromBackup() {
  const backupData = localStorage.getItem('naplan_backup_before_import');
  if (!backupData) {
    return {
      success: false,
      error: 'No backup found'
    };
  }

  try {
    const backup = JSON.parse(backupData);
    return importAllData(backup);
  } catch (error) {
    return {
      success: false,
      error: 'Failed to restore backup: ' + error.message
    };
  }
}
