import { NAMES } from './constants';

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEvenInt(min, max) {
  let num = randomInt(min, max);
  if (num % 2 !== 0) {
    num = num < max ? num + 1 : num - 1;
  }
  return num;
}

function randomDecimal(min, max, step = 0.01) {
  const steps = Math.floor((max - min) / step);
  return min + (Math.floor(Math.random() * (steps + 1)) * step);
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

// Rounding functions
function roundToNearest(num, nearest) {
  return Math.round(num / nearest) * nearest;
}

// Domain-specific functions
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
  return counts[shape.toLowerCase()] || 0;
}

function daysInMonth(month) {
  const days = {
    'january': 31, 'february': 28, 'march': 31, 'april': 30,
    'may': 31, 'june': 30, 'july': 31, 'august': 31,
    'september': 30, 'october': 31, 'november': 30, 'december': 31
  };
  return days[month.toLowerCase()] || 30;
}

function shapeSides(shape) {
  const sides = {
    'triangle': 3, 'square': 4, 'rectangle': 4,
    'pentagon': 5, 'hexagon': 6, 'octagon': 8
  };
  return sides[shape.toLowerCase()] || 0;
}

function evenOdd(num) {
  return num % 2 === 0 ? 'even' : 'odd';
}

// Fraction helpers
function randomEquivalentFraction(num, denom) {
  const multipliers = [2, 3, 4, 5];
  const mult = randomChoice(multipliers);
  return `${num * mult}/${denom * mult}`;
}

function sortNumbers(numbers) {
  return numbers.sort((a, b) => a - b).join(', ');
}

// Safe expression evaluator
function evaluateExpression(expr, params = {}) {
  try {
    let evalExpr = String(expr);

    // Replace parameter placeholders
    for (const [key, value] of Object.entries(params)) {
      evalExpr = evalExpr.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }

    // Replace mathematical operators
    evalExpr = evalExpr.replace(/×/g, '*').replace(/÷/g, '/');

    // Remove remaining braces
    evalExpr = evalExpr.replace(/[{}]/g, '');

    // Safe evaluation
    const result = Function('"use strict"; return (' + evalExpr + ')')();
    return Math.round(result * 1000) / 1000;
  } catch (e) {
    console.error('Expression evaluation error:', expr, e);
    return 0;
  }
}

// Extract digit from number
function extractDigit(number) {
  const digits = String(number).split('').filter(d => d !== '.' && d !== '-');
  // Ensure unique digits when possible
  const uniqueDigits = [...new Set(digits)];
  return randomChoice(uniqueDigits.length > 1 ? uniqueDigits : digits);
}

// Calculate place value
function placeValue(number, digit) {
  const numStr = String(number);
  const digitStr = String(digit);

  // Find FIRST occurrence of the digit
  const digitPos = numStr.indexOf(digitStr);
  if (digitPos === -1) return 0;

  const decimalPos = numStr.indexOf('.');
  let placePosition;

  if (decimalPos === -1) {
    placePosition = numStr.length - digitPos - 1;
  } else if (digitPos < decimalPos) {
    placePosition = decimalPos - digitPos - 1;
  } else {
    placePosition = -(digitPos - decimalPos);
  }

  return parseInt(digit) * Math.pow(10, placePosition);
}

// Generate parameter value based on config
function generateParamValue(config, allParams = {}) {
  if (!config || !config.type) return 0;

  switch (config.type) {
    case 'integer': {
      if (config.constraint === 'even') {
        return randomEvenInt(config.min, config.max);
      }

      let value;
      let attempts = 0;
      do {
        value = randomInt(config.min, config.max);
        if (!config.constraint) break;

        try {
          let constraint = String(config.constraint);
          for (const [key, val] of Object.entries(allParams)) {
            constraint = constraint.replace(new RegExp(key, 'g'), val);
          }
          const constraintMet = Function('value', `"use strict"; return ${constraint};`)(value);
          if (constraintMet) break;
        } catch (e) {
          break;
        }

        attempts++;
        if (attempts > 100) break;
      } while (true);

      return value;
    }

    case 'decimal':
      return randomDecimal(config.min, config.max, config.step || 0.01);

    case 'choice':
      return randomChoice(config.options || [0]);

    case 'name':
      return randomName();

    case 'extractDigit':
      if (config.from && allParams[config.from]) {
        return extractDigit(allParams[config.from]);
      }
      return randomInt(1, 9);

    case 'computed':
      if (config.formula) {
        return evaluateExpression(config.formula, allParams);
      }
      return 0;

    default:
      return 0;
  }
}

// Generate parameters for template
function generateParameters(paramsConfig) {
  const params = {};

  if (!paramsConfig) return params;

  for (const [key, config] of Object.entries(paramsConfig)) {
    params[key] = generateParamValue(config, params);
  }

  return params;
}

// Replace placeholders in string
function replacePlaceholders(template, params) {
  if (!template) return '';
  let result = String(template);

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return result;
}

// Replace placeholders in visual object
function processVisual(visual, params) {
  if (!visual) return null;

  const processed = JSON.parse(JSON.stringify(visual));

  // Process all string values in the visual object recursively
  function processValue(obj) {
    if (typeof obj === 'string') {
      return replacePlaceholders(obj, params);
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = processValue(obj[key]);
      }
    }
    return obj;
  }

  return processValue(processed);
}

// Generate distractors for multiple choice
function generateDistractors(correctAnswer, distractorSpecs, params, answerType = 'numeric') {
  const distractors = new Set();

  // Handle text-based distractors
  if (Array.isArray(distractorSpecs) && distractorSpecs.length > 0) {
    if (typeof distractorSpecs[0] === 'string' && isNaN(parseFloat(distractorSpecs[0]))) {
      // Text distractors - use as-is
      distractorSpecs.forEach(d => {
        if (d !== correctAnswer) {
          distractors.add(replacePlaceholders(d, params));
        }
      });

      // Return if we have enough
      if (distractors.size >= 3) {
        return Array.from(distractors).slice(0, 3);
      }
    } else {
      // Numeric or expression distractors
      distractorSpecs.forEach(spec => {
        const value = evaluateExpression(String(spec), params);
        if (value !== null && value !== parseFloat(correctAnswer)) {
          distractors.add(String(value));
        }
      });
    }
  }

  // Fill remaining with numeric strategies if needed
  if (distractors.size < 3 && !isNaN(parseFloat(correctAnswer))) {
    const correct = parseFloat(correctAnswer);
    const strategies = [
      correct - 1,
      correct + 1,
      correct - 10,
      correct + 10,
      correct * 2,
      Math.floor(correct / 2),
      correct + 100,
      correct - 100,
      Math.round(correct * 1.1),
      Math.round(correct * 0.9),
      correct - 5,
      correct + 5
    ];

    for (const candidate of shuffleArray(strategies)) {
      if (candidate > 0 &&
          candidate !== correct &&
          !distractors.has(String(candidate))) {
        distractors.add(String(candidate));
        if (distractors.size >= 3) break;
      }
    }
  }

  return Array.from(distractors).slice(0, 3);
}

// Calculate correct answer
function calculateCorrectAnswer(answerExpr, params, template) {
  if (!answerExpr) return '0';

  const exprStr = String(answerExpr);

  // Handle special function calls
  if (exprStr.includes('placeValue(')) {
    const match = exprStr.match(/placeValue\(\{([^}]+)\},\s*\{([^}]+)\}\)/);
    if (match) {
      return String(placeValue(params[match[1]], params[match[2]]));
    }
  }

  if (exprStr.includes('symmetryLines(') || exprStr.includes('getSymmetryCount(')) {
    const match = exprStr.match(/(?:symmetryLines|getSymmetryCount)\(\{?([^}]+)\}?\)/);
    if (match) {
      const shape = params[match[1]] || match[1].replace(/['"]/g, '');
      return String(getSymmetryCount(shape));
    }
  }

  if (exprStr.includes('daysInMonth(')) {
    const match = exprStr.match(/daysInMonth\(\{?([^}]+)\}?\)/);
    if (match) {
      const month = params[match[1]] || match[1].replace(/['"]/g, '');
      return String(daysInMonth(month));
    }
  }

  if (exprStr.includes('shapeSides(')) {
    const match = exprStr.match(/shapeSides\(\{?([^}]+)\}?\)/);
    if (match) {
      const shape = params[match[1]] || match[1].replace(/['"]/g, '');
      return String(shapeSides(shape));
    }
  }

  if (exprStr.includes('evenOdd(')) {
    const match = exprStr.match(/evenOdd\(\{?([^}]+)\}?\)/);
    if (match) {
      const num = params[match[1]] || parseInt(match[1]);
      return evenOdd(num);
    }
  }

  if (exprStr.includes('roundToNearest(') || exprStr.includes('round(')) {
    const match = exprStr.match(/round(?:ToNearest)?\(([^,]+),\s*([^)]+)\)/);
    if (match) {
      const num = parseFloat(replacePlaceholders(match[1], params));
      const nearest = parseFloat(replacePlaceholders(match[2], params));
      return String(roundToNearest(num, nearest));
    }
  }

  if (exprStr.includes('randomEquivalent(')) {
    const match = exprStr.match(/randomEquivalent\((\d+),\s*(\d+)\)/);
    if (match) {
      return randomEquivalentFraction(parseInt(match[1]), parseInt(match[2]));
    }
  }

  if (exprStr.includes('sortNumbers(')) {
    const match = exprStr.match(/sortNumbers\(\[([^\]]+)\]\)/);
    if (match) {
      const numbers = match[1].split(',').map(n => {
        const replaced = replacePlaceholders(n.trim(), params);
        return parseFloat(replaced.replace(/[{}]/g, ''));
      });
      return sortNumbers(numbers);
    }
  }

  // Check if it's a direct value (no placeholders or expressions)
  if (!exprStr.includes('{') && !exprStr.match(/[+\-*/]/)) {
    return exprStr;
  }

  // Evaluate as expression
  const result = evaluateExpression(exprStr, params);

  if (result === null || isNaN(result) || !isFinite(result)) {
    console.warn(`Invalid answer for template ${template.id}:`, exprStr, '→', result);
    return '0';
  }

  return result % 1 === 0 ? String(result) : result.toFixed(2);
}

// Main question generation function
export function generateQuestion(template) {
  try {
    // 1. Generate parameters
    const params = generateParameters(template.params || {});

    // 2. Replace placeholders in question text
    const questionText = replacePlaceholders(template.template, params);

    // 3. Calculate correct answer
    const correctAnswer = calculateCorrectAnswer(template.correctAnswer, params, template);

    // 4. Generate options for multiple choice
    let options = null;
    if (template.answerType === 'multipleChoice') {
      const distractors = generateDistractors(
        correctAnswer,
        template.distractors || [],
        params,
        template.answerType
      );
      options = shuffleArray([correctAnswer, ...distractors]);
    }

    // 5. Process visual (replace placeholders in visual object)
    const visual = processVisual(template.visual, params);

    // 6. Create question object
    return {
      id: `${template.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId: template.id,
      questionText,
      correctAnswer,
      options,
      answerType: template.answerType,
      topic: template.topic,
      difficulty: template.difficulty || 'medium',
      visual
    };

  } catch (error) {
    console.error('Error generating question from template:', template.id, error);
    return {
      id: `error-${Date.now()}`,
      templateId: template.id,
      questionText: `Error: Unable to generate question from template ${template.id}`,
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
  const shuffled = shuffleArray(templates);
  const selected = shuffled.slice(0, Math.min(count, templates.length));

  while (selected.length < count) {
    selected.push(randomChoice(templates));
  }

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
