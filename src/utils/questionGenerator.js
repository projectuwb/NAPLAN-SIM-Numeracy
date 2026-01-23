import { NAMES } from './constants';

// ============= BASIC HELPER FUNCTIONS =============
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

// ============= TIME FUNCTIONS =============
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

// ============= SHAPE FUNCTIONS =============
function shapeSides(shape) {
  const sides = {
    'triangle': 3, 'square': 4, 'rectangle': 4,
    'pentagon': 5, 'hexagon': 6, 'heptagon': 7, 'octagon': 8
  };
  return sides[shape.toLowerCase()] || 0;
}

function shape3DProperty(shape, property) {
  const properties = {
    'cube': { faces: 6, edges: 12, vertices: 8 },
    'rectangular prism': { faces: 6, edges: 12, vertices: 8 },
    'cylinder': { faces: 3, edges: 2, vertices: 0 },
    'sphere': { faces: 1, edges: 0, vertices: 0 },
    'cone': { faces: 2, edges: 1, vertices: 1 },
    'pyramid': { faces: 5, edges: 8, vertices: 5 }
  };
  return properties[shape.toLowerCase()]?.[property.toLowerCase()] || 0;
}

function symmetryLines(shape) {
  const lines = {
    'square': 4, 'rectangle': 2, 'circle': 'infinite',
    'equilateral triangle': 3, 'isosceles triangle': 1,
    'triangle': 0, 'hexagon': 6, 'pentagon': 5
  };
  const result = lines[shape.toLowerCase()];
  return result === 'infinite' ? 'infinite' : (result || 0);
}

function getSymmetryCount(shape) {
  return symmetryLines(shape);
}

// ============= COMPARISON FUNCTIONS =============
function compareSymbol(num1, num2) {
  if (num1 < num2) return '<';
  if (num1 > num2) return '>';
  return '=';
}

function evenOdd(number) {
  return number % 2 === 0 ? 'even' : 'odd';
}

// ============= ROUNDING FUNCTIONS =============
function roundToNearest(num, nearest) {
  return Math.round(num / nearest) * nearest;
}

function round(number, nearest) {
  return roundToNearest(number, nearest);
}

// ============= FRACTION FUNCTIONS =============
function fractionOf(fraction, total) {
  const [num, den] = fraction.split('/').map(Number);
  return Math.floor((total * num) / den);
}

function simplifyFraction(numerator, denominator) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return `${numerator / divisor}/${denominator / divisor}`;
}

function generateEquivalent(num, den) {
  const multiplier = randomInt(2, 4);
  return `${num * multiplier}/${den * multiplier}`;
}

function randomEquivalent(num, den) {
  return generateEquivalent(num, den);
}

function nonEquivalentFractions(num, den, count) {
  const fractions = [];
  const correctValue = num / den;
  
  while (fractions.length < count) {
    const wrongNum = randomInt(1, 10);
    const wrongDen = randomInt(2, 10);
    const wrongValue = wrongNum / wrongDen;
    const frac = `${wrongNum}/${wrongDen}`;
    
    if (Math.abs(wrongValue - correctValue) > 0.01 && !fractions.includes(frac)) {
      fractions.push(frac);
    }
  }
  return fractions;
}

// ============= CALENDAR FUNCTIONS =============
function daysInMonth(month) {
  const days = {
    'January': 31, 'February': 28, 'March': 31, 'April': 30,
    'May': 31, 'June': 30, 'July': 31, 'August': 31,
    'September': 30, 'October': 31, 'November': 30, 'December': 31
  };
  return days[month] || 30;
}

// ============= SORTING FUNCTIONS =============
function sortNumbers(numbers) {
  return numbers.sort((a, b) => a - b).join(', ');
}

function orderingDistractors(numbers, count) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const distractors = [];
  
  distractors.push([...numbers].sort((a, b) => b - a).join(', ')); // Reverse
  distractors.push(numbers.join(', ')); // Original order
  
  while (distractors.length < count) {
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    const str = shuffled.join(', ');
    if (!distractors.includes(str) && str !== sorted.join(', ')) {
      distractors.push(str);
    }
  }
  
  return distractors.slice(0, count);
}

// ============= STATISTICS FUNCTIONS =============
function median(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

function findMode(numbers) {
  const counts = {};
  let maxCount = 0;
  let mode = numbers[0];
  
  numbers.forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
    if (counts[num] > maxCount) {
      maxCount = counts[num];
      mode = num;
    }
  });
  
  return mode;
}

// ============= CONVERSION FUNCTIONS =============
function convert(value, fromUnit, toUnit) {
  const conversions = {
    'km': { 'm': 1000 },
    'm': { 'cm': 100, 'km': 1/1000 },
    'cm': { 'mm': 10, 'm': 1/100 },
    'kg': { 'g': 1000 },
    'g': { 'kg': 1/1000 },
    'L': { 'mL': 1000 },
    'mL': { 'L': 1/1000 }
  };
  
  if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
    return value * conversions[fromUnit][toUnit];
  }
  
  return value;
}

function lcm(a, b) {
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  return (a * b) / gcd(a, b);
}

function hcf(a, b) {
  return b === 0 ? a : hcf(b, a % b);
}

// ============= FACTOR/MULTIPLE FUNCTIONS =============
function randomFactor(number) {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) factors.push(i);
  }
  return randomChoice(factors.filter(f => f > 1 && f < number) || [1]);
}

function nonFactors(number, count) {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) factors.push(i);
  }
  
  const nonFactors = [];
  for (let i = 2; i <= number + 20; i++) {
    if (!factors.includes(i)) nonFactors.push(i);
  }
  
  return shuffleArray(nonFactors).slice(0, count);
}

function randomMultiple(base) {
  return base * randomInt(2, 12);
}

function nonMultiples(base, count) {
  const nonMults = [];
  for (let i = 1; i < 100; i++) {
    if (i % base !== 0) nonMults.push(i);
  }
  return shuffleArray(nonMults).slice(0, count);
}

function randomPrime(min, max) {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const inRange = primes.filter(p => p >= min && p <= max);
  return randomChoice(inRange);
}

function compositesNear(prime, count) {
  const composites = [];
  for (let i = prime - 10; i <= prime + 10; i++) {
    if (i > 1 && i !== prime) {
      let isComposite = false;
      for (let j = 2; j < i; j++) {
        if (i % j === 0) {
          isComposite = true;
          break;
        }
      }
      if (isComposite) composites.push(i);
    }
  }
  return shuffleArray(composites).slice(0, count);
}

// ============= ANGLE FUNCTIONS =============
function classifyAngle(degrees) {
  if (degrees < 90) return 'acute';
  if (degrees === 90) return 'right';
  if (degrees < 180) return 'obtuse';
  return 'straight';
}

// ============= DISTRACTOR GENERATORS =============
function fractionDistractors(numerator, denominator, count) {
  const distractors = [];
  const target = numerator / denominator;
  
  // Common wrong fractions near the target
  const candidates = [
    `${numerator + 1}/${denominator}`,
    `${numerator - 1}/${denominator}`,
    `${numerator}/${denominator + 1}`,
    `${numerator}/${denominator - 1}`,
    `${numerator * 2}/${denominator}`,
    `${numerator}/${denominator * 2}`
  ];
  
  for (const frac of candidates) {
    if (distractors.length >= count) break;
    const [n, d] = frac.split('/').map(Number);
    if (n > 0 && d > 0 && n/d !== target && !distractors.includes(frac)) {
      distractors.push(frac);
    }
  }
  
  return distractors.slice(0, count);
}

function timeDistractors(hour, minute, count) {
  const distractors = [];
  distractors.push(formatTime((hour + 1) % 24, minute));
  distractors.push(formatTime(hour, (minute + 15) % 60));
  distractors.push(formatTime((hour - 1 + 24) % 24, minute));
  return distractors.slice(0, count);
}

function probabilityDistractors(r, b, g, count) {
  const total = r + b + g;
  const distractors = [];
  if (b > 0) distractors.push(`${b}/${total}`);
  if (g > 0) distractors.push(`${g}/${total}`);
  distractors.push(`${r + b}/${total}`);
  return distractors.slice(0, count);
}

function coordinateDistractors(x, y, count) {
  const distractors = [];
  distractors.push(`(${y}, ${x})`); // Swapped
  distractors.push(`(${-x}, ${y})`); // Negated x
  distractors.push(`(${x}, ${-y})`); // Negated y
  return distractors.slice(0, count);
}

function algebraDistractors(coef, count) {
  const distractors = [];
  distractors.push(`${coef + 1}x`);
  distractors.push(`${coef - 1}x`);
  distractors.push(`${coef * 2}x`);
  return distractors.slice(0, count);
}

// ============= PLACEHOLDER FUNCTIONS FOR COMPLEX TYPES =============
// These generate simple placeholders for data visualization types
function maxCategory(data) {
  return 'Category A'; // Placeholder
}

function otherCategories(data, count) {
  return ['Category B', 'Category C', 'Category D'].slice(0, count);
}

function dataValue(data, category) {
  return randomInt(10, 50);
}

function maxDataPoint(data) {
  return 'January'; // Placeholder
}

function otherDataPoints(data, count) {
  return ['February', 'March', 'April'].slice(0, count);
}

function tableValue(table, name, subject) {
  return randomInt(60, 100);
}

function gridValue(grid, x, y) {
  return randomChoice(['star', 'circle', 'square']);
}

function otherGridValues(grid, count) {
  return ['triangle', 'diamond', 'heart'].slice(0, count);
}

function countValues(data) {
  return randomInt(8, 15);
}

// ============= PLACE VALUE FUNCTIONS =============
function extractDigit(number) {
  const digits = String(number).split('').filter(d => d !== '.');
  return randomChoice(digits);
}

function placeValue(number, digit) {
  const numStr = String(number);
  const digitPos = numStr.indexOf(digit);

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

function wrongPlaceValue(number, digit, count) {
  const correct = placeValue(number, digit);
  const distractors = [];
  distractors.push(correct * 10);
  distractors.push(correct / 10);
  distractors.push(parseInt(digit));
  return distractors.slice(0, count);
}

// ============= EXPRESSION EVALUATOR (FIXED) =============
function evaluateExpression(expr, params = {}) {
  try {
    if (!expr || typeof expr !== 'string') {
      console.error('Invalid expression:', expr);
      return null;
    }

    let evalExpr = expr;
    
    // Replace parameter placeholders - check for null/undefined
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        evalExpr = evalExpr.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
      }
    }

    // Replace mathematical operators
    evalExpr = evalExpr.replace(/×/g, '*').replace(/÷/g, '/');
    evalExpr = evalExpr.replace(/[{}]/g, '');

    // Check if there are still unreplaced placeholders
    if (evalExpr.includes('{') || evalExpr.includes('}')) {
      console.warn('Unreplaced placeholders in expression:', evalExpr);
      return null;
    }

    // CRITICAL FIX: Make helper functions available in evaluation
    const helperFunctions = { 
      randomInt, randomChoice, randomDecimal, Math,
      formatTime, addMinutes, roundToNearest,
      abs: Math.abs, sqrt: Math.sqrt, max: Math.max, min: Math.min
    };
    
    const functionNames = Object.keys(helperFunctions);
    const functionValues = Object.values(helperFunctions);
    
    const result = Function(...functionNames, `"use strict"; return (${evalExpr});`)(...functionValues);
    
    // Check if result is valid
    if (typeof result === 'number') {
      if (isNaN(result) || !isFinite(result)) {
        console.warn('Expression resulted in NaN or Infinity:', evalExpr);
        return null;
      }
      return Math.round(result * 1000) / 1000;
    }
    
    return result;
  } catch (e) {
    console.error('Expression evaluation error:', e, 'Expression:', expr);
    return null;
  }
}

// ============= PARAMETER GENERATION (FIXED) =============
function generateParamValue(config, allParams = {}) {
  switch (config.type) {
    case 'integer': {
      if (config.constraint === 'even') {
        return randomEvenInt(config.min, config.max);
      }

      // Simple case: no constraint
      if (!config.constraint) {
        return randomInt(config.min, config.max);
      }

      // Constraint exists - try to satisfy it
      let value;
      const maxAttempts = 50; // Reduced from 100
      
      for (let attempts = 0; attempts < maxAttempts; attempts++) {
        value = randomInt(config.min, config.max);

        try {
          let constraint = config.constraint;
          // Replace param references with actual values
          for (const [key, val] of Object.entries(allParams)) {
            if (val !== null && val !== undefined) {
              constraint = constraint.replace(new RegExp(key, 'g'), val);
            }
          }
          
          const constraintMet = Function('value', `"use strict"; return ${constraint};`)(value);
          if (constraintMet) {
            return value;
          }
        } catch (e) {
          // Constraint failed - just return the value
          console.warn('Constraint evaluation error:', e);
          return value;
        }
      }
      
      // Failed to satisfy constraint after maxAttempts
      console.warn(`Could not satisfy constraint after ${maxAttempts} attempts, using last value`);
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

    case 'time':
      const hour = randomInt(config.min || 8, config.max || 17);
      const minute = randomChoice([0, 15, 30, 45]);
      return formatTime(hour, minute);

    case 'time12':
      const h = randomInt(1, 12);
      const m = randomChoice([0, 15, 30, 45]);
      const ampm = randomChoice(['AM', 'PM']);
      return `${h}:${String(m).padStart(2, '0')} ${ampm}`;

    case 'letter':
      return randomChoice(['x', 'y', 'z', 'a', 'b']);

    case 'busStop':
      return randomChoice(['Central Station', 'Park Avenue', 'Main Street', 'Shopping Center']);

    case 'computed':
      if (config.formula) {
        let formula = config.formula;
        
        // Replace params with values - check for null/undefined
        for (const [key, value] of Object.entries(allParams)) {
          if (value !== null && value !== undefined) {
            formula = formula.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
          } else {
            console.warn(`Param ${key} is null/undefined in formula:`, formula);
            return 0; // Early return instead of trying to evaluate bad formula
          }
        }

        // Handle special functions
        if (formula.includes('formatTime(')) {
          const match = formula.match(/formatTime\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const hour = parseInt(match[1]);
            const minute = parseInt(match[2]);
            if (!isNaN(hour) && !isNaN(minute)) {
              return formatTime(hour, minute);
            }
          }
        }

        if (formula.includes('formatTime12(')) {
          const match = formula.match(/formatTime12\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const hour = parseInt(match[1]);
            const minute = parseInt(match[2]);
            if (!isNaN(hour) && !isNaN(minute)) {
              return formatTime12(hour, minute);
            }
          }
        }

        if (formula.includes('addMinutes(')) {
          const match = formula.match(/addMinutes\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
          if (match) {
            const hour = parseInt(match[1]);
            const minute = parseInt(match[2]);
            const additional = parseInt(match[3]);
            if (!isNaN(hour) && !isNaN(minute) && !isNaN(additional)) {
              const result = addMinutes(hour, minute, additional);
              return formatTime(result.hour, result.minute);
            }
          }
        }

        if (formula.includes('roundToNearest(')) {
          const match = formula.match(/roundToNearest\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const num = parseInt(match[1]);
            const nearest = parseInt(match[2]);
            if (!isNaN(num) && !isNaN(nearest) && nearest !== 0) {
              return roundToNearest(num, nearest);
            }
          }
        }

        if (formula.includes('getSymmetryCount(')) {
          const match = formula.match(/getSymmetryCount\(([^)]+)\)/);
          if (match) {
            const shape = match[1].replace(/['"]/g, '');
            return getSymmetryCount(shape);
          }
        }

        // Fallback to expression evaluation
        const result = evaluateExpression(formula, allParams);
        return result !== null ? result : 0;
      }
      return 0;

    // Complex data types - return placeholders for now
    case 'barGraph':
    case 'lineGraph':
    case 'dataTable':
    case 'numberSet':
    case 'stemLeafData':
    case 'gridWithObjects':
    case 'pictograph':
    case 'relatedUnit':
    case 'extractCategory':
    case 'extractFromTable':
      console.warn(`Complex type '${config.type}' not fully implemented yet`);
      return {};

    default:
      console.warn('Unknown parameter type:', config.type);
      return 0;
  }
}

function generateParameters(paramsConfig) {
  const params = {};

  for (const [key, config] of Object.entries(paramsConfig)) {
    params[key] = generateParamValue(config, params);
  }

  return params;
}

function replacePlaceholders(template, params) {
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

// ============= DISTRACTOR GENERATION (FIXED) =============
function generateDistractors(correctAnswer, distractorSpecs, params) {
  const distractors = [];
  const correct = parseFloat(correctAnswer);

  if (distractorSpecs && distractorSpecs.length > 0) {
    for (const spec of distractorSpecs) {
      if (distractors.length >= 3) break; // Safety: don't generate more than needed
      
      // Check if it's a function call
      if (typeof spec === 'string' && spec.includes('(')) {
        try {
          // Replace params first
          let funcCall = spec;
          for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
              funcCall = funcCall.replace(new RegExp(`\\{${key}\\}`, 'g'), 
                typeof value === 'string' ? `'${value}'` : value);
            }
          }
          
          // Create evaluation context with all helper functions
          const helperContext = {
            fractionDistractors, timeDistractors, probabilityDistractors,
            coordinateDistractors, algebraDistractors, wrongPlaceValue,
            nonEquivalentFractions, nonFactors, nonMultiples, compositesNear,
            otherCategories, otherDataPoints, otherGridValues,
            orderingDistractors
          };
          
          // Try to evaluate the function call
          const funcName = funcCall.split('(')[0];
          if (helperContext[funcName]) {
            // Extract arguments
            const argsMatch = funcCall.match(/\((.*)\)/);
            if (argsMatch) {
              const argsStr = argsMatch[1];
              const args = argsStr.split(',').map(arg => {
                arg = arg.trim();
                if (arg.startsWith("'") || arg.startsWith('"')) {
                  return arg.slice(1, -1);
                }
                return parseFloat(arg) || arg;
              });
              
              const result = helperContext[funcName](...args);
              
              if (Array.isArray(result)) {
                distractors.push(...result);
              } else if (result !== null && result !== correct) {
                distractors.push(result);
              }
            }
          }
        } catch (e) {
          console.warn('Distractor function failed:', spec, e);
          const distractor = evaluateExpression(spec, params);
          if (distractor !== null && distractor !== correct) {
            distractors.push(distractor);
          }
        }
      } else {
        const distractor = evaluateExpression(spec, params);
        if (distractor !== null && distractor !== correct) {
          distractors.push(distractor);
        }
      }
    }
  }

  // Fill remaining slots with computed distractors - WITH SAFETY LIMIT
  const strategies = [
    correct + 1, correct - 1, correct + 10, correct - 10,
    correct * 2, Math.floor(correct / 2),
    correct + 100, correct - 100,
    Math.round(correct * 1.1), Math.round(correct * 0.9)
  ];
  
  let attempts = 0;
  const maxAttempts = 20; // Safety limit
  
  while (distractors.length < 3 && attempts < maxAttempts) {
    const candidate = randomChoice(strategies);
    if (candidate !== correct && 
        candidate > 0 && 
        !distractors.includes(candidate) &&
        !distractors.includes(String(candidate))) {
      distractors.push(candidate);
    }
    attempts++;
  }
  
  // If we still don't have enough, just add simple +1, +2, +3
  while (distractors.length < 3) {
    const fallback = correct + distractors.length + 1;
    if (!distractors.includes(fallback)) {
      distractors.push(fallback);
    } else {
      distractors.push(correct - distractors.length - 1);
    }
  }

  return distractors.slice(0, 3).map(d =>
    typeof d === 'number' && d % 1 !== 0 ? d.toFixed(2) : String(d)
  );
}

// ============= VALIDATION =============
function validateQuestion(question, template) {
  const errors = [];

  const placeholderRegex = /\{[A-Z_0-9]+\}/g;
  const unreplaced = question.questionText.match(placeholderRegex);
  if (unreplaced) {
    errors.push(`Unreplaced variables: ${unreplaced.join(', ')}`);
  }

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
    return {
      ...question,
      questionText: `[Error in template ${template.id}] ${question.questionText}`,
      correctAnswer: '0'
    };
  }

  return question;
}

// ============= MAIN QUESTION GENERATION =============
export function generateQuestion(template) {
  try {
    const params = generateParameters(template.params || {});

    let questionText = replacePlaceholders(template.template, params);

    let correctAnswer = null;

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
      } else if (template.correctAnswer.includes('shapeSides(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/shapeSides\(['"]*([^'"]+)['"]*\)/);
        if (match) {
          correctAnswer = shapeSides(match[1]);
        }
      } else if (template.correctAnswer.includes('shape3DProperty(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/shape3DProperty\(['"]*([^'"]+)['"]*,\s*['"]*([^'"]+)['"]*\)/);
        if (match) {
          correctAnswer = shape3DProperty(match[1], match[2]);
        }
      } else if (template.correctAnswer.includes('symmetryLines(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/symmetryLines\(['"]*([^'"]+)['"]*\)/);
        if (match) {
          correctAnswer = symmetryLines(match[1]);
        }
      } else if (template.correctAnswer.includes('compareSymbol(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/compareSymbol\(([^,]+),\s*([^)]+)\)/);
        if (match) {
          correctAnswer = compareSymbol(parseFloat(match[1]), parseFloat(match[2]));
        }
      } else if (template.correctAnswer.includes('evenOdd(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/evenOdd\(([^)]+)\)/);
        if (match) {
          correctAnswer = evenOdd(parseInt(match[1]));
        }
      } else if (template.correctAnswer.includes('daysInMonth(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/daysInMonth\(['"]*([^'"]+)['"]*\)/);
        if (match) {
          correctAnswer = daysInMonth(match[1]);
        }
      } else if (template.correctAnswer.includes('fractionOf(')) {
        const expr = replacePlaceholders(template.correctAnswer, params);
        const match = expr.match(/fractionOf\(['"]*([^'"]+)['"]*,\s*([^)]+)\)/);
        if (match) {
          correctAnswer = fractionOf(match[1], parseFloat(match[2]));
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
        // Keep as integer if whole number, otherwise 2 decimal places
        correctAnswer = correctAnswer % 1 === 0 ? String(Math.round(correctAnswer)) : correctAnswer.toFixed(2);
      }
    } else {
      // It's already a string (like fraction "3/4" or comparison "<")
      correctAnswer = String(correctAnswer);
    }

    let options = null;
    if (template.answerType === 'multipleChoice') {
      const distractors = generateDistractors(
        correctAnswer,
        template.distractors || [],
        params
      );
      options = shuffleArray([correctAnswer, ...distractors]);
    }

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

    return validateQuestion(question, template);

  } catch (error) {
    console.error('Error generating question from template:', template.id, error);
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

export function generateTest(templates, count) {
  const shuffled = shuffleArray(templates);
  const selected = shuffled.slice(0, Math.min(count, templates.length));

  while (selected.length < count) {
    selected.push(randomChoice(templates));
  }

  // Generate questions with error handling
  const questions = [];
  for (const template of selected) {
    try {
      const question = generateQuestion(template);
      questions.push(question);
    } catch (error) {
      console.error('Failed to generate question from template:', template.id, error);
      // Push a fallback question instead of crashing
      questions.push({
        id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        templateId: template.id || 'unknown',
        questionText: 'Sample question: What is 2 + 2?',
        correctAnswer: '4',
        options: ['3', '4', '5', '6'],
        answerType: 'multipleChoice',
        topic: template.topic || 'Unknown',
        difficulty: 'easy',
        visual: null
      });
    }
  }

  return questions;
}

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
