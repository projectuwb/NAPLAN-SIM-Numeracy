import { NAMES } from './constants';

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEvenInt(min, max) {
  // Generate even number in range
  let num = randomInt(min, max);
  if (num % 2 !== 0) {
    num = num < max ? num + 1 : num - 1;
  }
  return num;
}

function randomDecimal(min, max, places = 2) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(places));
}

function randomChoice(options) {
  return options[Math.floor(Math.random() * options.length)];
}

function randomName() {
  return randomChoice(NAMES);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Time formatting functions
function formatTime(hour, minute) {
  return `${hour}:${String(minute).padStart(2, '0')}`;
}

function formatTime12(hour, minute) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
  return `${h12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function addMinutes(hour, minute, additionalMinutes) {
  const totalMinutes = hour * 60 + minute + additionalMinutes;
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMinute = totalMinutes % 60;
  return { hour: newHour, minute: newMinute };
}

// Rounding functions
function roundToNearest(num, nearest) {
  return Math.round(num / nearest) * nearest;
}

// Symmetry helper
function getSymmetryCount(shape) {
  const counts = {
    'square': 4,
    'rectangle': 2,
    'circle': 'infinite',
    'equilateral triangle': 3,
    'triangle': 1,
    'hexagon': 6,
    'pentagon': 5
  };
  return counts[shape] || 0;
}

// Safe expression evaluator
function evaluateExpression(expr, params = {}) {
  try {
    // Replace parameter placeholders
    let evalExpr = expr;
    for (const [key, value] of Object.entries(params)) {
      evalExpr = evalExpr.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }

    // Replace mathematical operators
    evalExpr = evalExpr.replace(/×/g, '*').replace(/÷/g, '/');

    // Remove curly braces if any remain
    evalExpr = evalExpr.replace(/[{}]/g, '');

    // Safe evaluation using Function constructor
    // This is safer than eval() but still use with caution
    const result = Function('"use strict"; return (' + evalExpr + ')')();
    return Math.round(result * 1000) / 1000; // Round to 3 decimal places
  } catch (e) {
    console.error('Expression evaluation error:', e, 'Expression:', expr);
    return null;
  }
}

// Extract digit from number (for place value questions)
function extractDigit(number) {
  const digits = String(number).split('').filter(d => d !== '.');
  return randomChoice(digits);
}

// Calculate place value
function placeValue(number, digit) {
  const numStr = String(number);
  const digitPos = numStr.indexOf(digit);

  if (digitPos === -1) return 0;

  const decimalPos = numStr.indexOf('.');
  let placePosition;

  if (decimalPos === -1) {
    // No decimal point - count from right
    placePosition = numStr.length - digitPos - 1;
  } else if (digitPos < decimalPos) {
    // Before decimal point
    placePosition = decimalPos - digitPos - 1;
  } else {
    // After decimal point
    placePosition = -(digitPos - decimalPos);
  }

  return parseInt(digit) * Math.pow(10, placePosition);
}

// Generate parameter value based on config
function generateParamValue(config, allParams = {}) {
  switch (config.type) {
    case 'integer': {
      // Handle even constraint
      if (config.constraint === 'even') {
        return randomEvenInt(config.min, config.max);
      }

      // Handle other constraints
      let value;
      let attempts = 0;
      do {
        value = randomInt(config.min, config.max);

        if (!config.constraint) break;

        // Evaluate constraint
        try {
          let constraint = config.constraint;
          // Replace param references
          for (const [key, val] of Object.entries(allParams)) {
            constraint = constraint.replace(new RegExp(key, 'g'), val);
          }
          // Replace 'value' reference
          const constraintMet = Function('value', `"use strict"; return ${constraint};`)(value);
          if (constraintMet) break;
        } catch (e) {
          console.warn('Constraint evaluation error:', e);
          break;
        }

        attempts++;
        if (attempts > 100) {
          console.warn('Could not satisfy constraint, using unconstrained value');
          break;
        }
      } while (true);

      return value;
    }

    case 'decimal':
      return randomDecimal(config.min, config.max, config.places || 2);

    case 'choice':
      return randomChoice(config.options);

    case 'name':
      return randomName();

    case 'extractDigit':
      if (config.from && allParams[config.from]) {
        return extractDigit(allParams[config.from]);
      }
      return randomInt(1, 9);

    case 'computed':
      if (config.formula) {
        // Replace placeholders in formula
        let formula = config.formula;
        for (const [key, value] of Object.entries(allParams)) {
          formula = formula.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }

        // Handle special functions
        if (formula.includes('formatTime(')) {
          const match = formula.match(/formatTime\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const hour = parseInt(match[1]);
            const minute = parseInt(match[2]);
            return formatTime(hour, minute);
          }
        }

        if (formula.includes('formatTime12(')) {
          const match = formula.match(/formatTime12\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const hour = parseInt(match[1]);
            const minute = parseInt(match[2]);
            return formatTime12(hour, minute);
          }
        }

        if (formula.includes('addMinutes(')) {
          const match = formula.match(/addMinutes\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
          if (match) {
            const hour = parseInt(match[1]);
            const minute = parseInt(match[2]);
            const additional = parseInt(match[3]);
            const result = addMinutes(hour, minute, additional);
            return formatTime(result.hour, result.minute);
          }
        }

        if (formula.includes('roundToNearest(')) {
          const match = formula.match(/roundToNearest\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const num = parseInt(match[1]);
            const nearest = parseInt(match[2]);
            return roundToNearest(num, nearest);
          }
        }

        if (formula.includes('getSymmetryCount(')) {
          const match = formula.match(/getSymmetryCount\(([^)]+)\)/);
          if (match) {
            const shape = match[1].replace(/['"]/g, '');
            return getSymmetryCount(shape);
          }
        }

        return evaluateExpression(formula, allParams);
      }
      return 0;

    default:
      console.warn('Unknown parameter type:', config.type);
      return 0;
  }
}

// Generate parameters for template
function generateParameters(paramsConfig) {
  const params = {};

  // Generate parameters in order to handle dependencies
  for (const [key, config] of Object.entries(paramsConfig)) {
    params[key] = generateParamValue(config, params);
  }

  return params;
}

// Replace placeholders in string
function replacePlaceholders(template, params) {
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

// Generate distractors for multiple choice
function generateDistractors(correctAnswer, distractorSpecs, params) {
  const distractors = [];
  const correct = parseFloat(correctAnswer);

  if (distractorSpecs && distractorSpecs.length > 0) {
    // Use provided distractor formulas
    for (const spec of distractorSpecs) {
      const distractor = evaluateExpression(spec, params);
      if (distractor !== null && distractor !== correct) {
        distractors.push(distractor);
      }
    }
  }

  // Fill remaining slots with computed distractors
  while (distractors.length < 3) {
    const strategies = [
      correct - 1,
      correct + 1,
      correct + 10,
      correct - 10,
      correct * 2,
      Math.floor(correct / 2),
      correct + 100,
      correct - 100,
      Math.round(correct * 1.1),
      Math.round(correct * 0.9)
    ];

    const candidate = randomChoice(strategies);
    if (candidate !== correct &&
        candidate > 0 &&
        !distractors.includes(candidate) &&
        candidate !== Math.floor(candidate) ? candidate.toFixed(2) !== correct.toFixed(2) : true) {
      distractors.push(candidate);
    }
  }

  return distractors.slice(0, 3).map(d =>
    typeof d === 'number' && d % 1 !== 0 ? d.toFixed(2) : String(d)
  );
}

// Validation function
function validateQuestion(question, template) {
  const errors = [];

  // Check for unreplaced placeholders
  const placeholderRegex = /\{[A-Z_0-9]+\}/g;
  const unreplaced = question.questionText.match(placeholderRegex);
  if (unreplaced) {
    errors.push(`Unreplaced variables: ${unreplaced.join(', ')}`);
  }

  // Check for null/undefined
  if (question.questionText.includes('null') || question.questionText.includes('undefined')) {
    errors.push('Question text contains null/undefined');
  }

  if (question.correctAnswer === null || question.correctAnswer === 'null') {
    errors.push('Correct answer is null');
  }

  if (errors.length > 0) {
    console.error('Question validation failed:', {
      templateId: template.id,
      errors,
      questionText: question.questionText,
      correctAnswer: question.correctAnswer
    });
    // Return a fallback question instead of breaking
    return {
      ...question,
      questionText: `[Error in template ${template.id}] ${question.questionText}`,
      correctAnswer: '0'
    };
  }

  return question;
}

// Main question generation function
export function generateQuestion(template) {
  try {
    // 1. Generate random parameter values
    const params = generateParameters(template.params || {});

    // 2. Replace placeholders in template
    let questionText = replacePlaceholders(template.template, params);

    // 3. Calculate correct answer
    let correctAnswer = null;

    // Handle different correct answer types
    if (typeof template.correctAnswer === 'string') {
      // Check for special functions first
      if (template.correctAnswer.includes('placeValue(')) {
        const match = template.correctAnswer.match(/placeValue\(\{([^}]+)\},\s*\{([^}]+)\}\)/);
        if (match) {
          const num = params[match[1]];
          const digit = params[match[2]];
          correctAnswer = placeValue(num, digit);
        }
      } else if (template.correctAnswer.includes('roundToNearest(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/roundToNearest\(([^,]+),\s*([^)]+)\)/);
        if (match) {
          const num = parseFloat(match[1]);
          const nearest = parseFloat(match[2]);
          correctAnswer = roundToNearest(num, nearest);
        }
      } else if (template.correctAnswer.includes('getSymmetryCount(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/getSymmetryCount\(['"]*([^'"]+)['"]*\)/);
        if (match) {
          correctAnswer = getSymmetryCount(match[1]);
        }
      } else {
        // Regular expression evaluation
        const correctAnswerExpr = replacePlaceholders(template.correctAnswer, params);
        correctAnswer = evaluateExpression(correctAnswerExpr, params);
      }
    } else {
      correctAnswer = template.correctAnswer;
    }

    // Ensure correct answer is properly formatted
    if (correctAnswer === null || correctAnswer === undefined) {
      console.warn(`Null correct answer for template ${template.id}, using 0`);
      correctAnswer = '0';
    } else if (typeof correctAnswer === 'number') {
      if (isNaN(correctAnswer) || !isFinite(correctAnswer)) {
        console.warn(`Invalid correct answer for template ${template.id}:`, correctAnswer);
        correctAnswer = '0';
      } else {
        correctAnswer = correctAnswer % 1 === 0 ? String(correctAnswer) : correctAnswer.toFixed(2);
      }
    } else {
      correctAnswer = String(correctAnswer);
    }

    // 4. Generate options for multiple choice questions
    let options = null;
    if (template.answerType === 'multipleChoice') {
      const distractors = generateDistractors(
        correctAnswer,
        template.distractors || [],
        params
      );
      options = shuffleArray([correctAnswer, ...distractors]);
    }

    // 5. Create question object
    const question = {
      id: `${template.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId: template.id,
      questionText,
      correctAnswer,
      options,
      answerType: template.answerType,
      topic: template.topic,
      difficulty: template.difficulty || 'medium',
      visual: template.visual || null
    };

    // 6. Validate before returning
    return validateQuestion(question, template);

  } catch (error) {
    console.error('Error generating question from template:', template.id, error);
    // Return fallback question
    return {
      id: `error-${Date.now()}`,
      templateId: template.id,
      questionText: `[Error generating question from template ${template.id}]`,
      correctAnswer: '0',
      options: null,
      answerType: 'numeric',
      topic: template.topic || 'Unknown',
      difficulty: 'medium',
      visual: null
    };
  }
}

// Generate full test
export function generateTest(templates, count) {
  // Shuffle templates to get variety
  const shuffled = shuffleArray(templates);
  const selected = shuffled.slice(0, Math.min(count, templates.length));

  // If we need more questions than templates, reuse templates
  while (selected.length < count) {
    selected.push(randomChoice(templates));
  }

  // Generate questions from selected templates
  return selected.map(template => generateQuestion(template));
}

// Generate focus test for specific topic
export function generateFocusTest(templates, topic, count = 10) {
  const topicTemplates = templates.filter(t =>
    t.topic.toLowerCase().includes(topic.toLowerCase())
  );

  if (topicTemplates.length === 0) {
    console.warn('No templates found for topic:', topic);
    return [];
  }

  return generateTest(topicTemplates, count);
}
