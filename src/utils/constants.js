export const NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona',
  'George', 'Hannah', 'Isaac', 'Julia', 'Kevin', 'Laura',
  'Michael', 'Nina', 'Oliver', 'Penny', 'Quinn', 'Rachel',
  'Sam', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zoe'
];

export const BAND_SCORES = {
  3: [
    { min: 0, max: 20, band: 1 },
    { min: 20, max: 35, band: 2 },
    { min: 35, max: 50, band: 3 },
    { min: 50, max: 65, band: 4 },
    { min: 65, max: 80, band: 5 },
    { min: 80, max: 100, band: 6 }
  ],
  5: [
    { min: 0, max: 20, band: 3 },
    { min: 20, max: 35, band: 4 },
    { min: 35, max: 50, band: 5 },
    { min: 50, max: 65, band: 6 },
    { min: 65, max: 80, band: 7 },
    { min: 80, max: 100, band: 8 }
  ],
  7: [
    { min: 0, max: 20, band: 4 },
    { min: 20, max: 35, band: 5 },
    { min: 35, max: 50, band: 6 },
    { min: 50, max: 65, band: 7 },
    { min: 65, max: 80, band: 8 },
    { min: 80, max: 100, band: 9 }
  ]
};

export const STORAGE_KEYS = {
  ADMIN_PASSWORD: 'naplan_admin_password',
  STUDENTS: 'naplan_students',
  CURRENT_SESSION: 'naplan_current_session',
  ACTIVE_TEST: 'naplan_active_test'
};

export const TEST_CONFIG = {
  3: {
    questionCount: 35,
    timeLimit: 45, // minutes
    calculator: false
  },
  5: {
    questionCount: 40,
    timeLimit: 50,
    calculator: false
  },
  7: {
    questionCount: 48,
    timeLimit: 60,
    calculatorFromQuestion: 9
  }
};
