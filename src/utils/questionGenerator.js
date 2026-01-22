import { NAMES } from './constants';

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
      let value;
      do {
        value = randomInt(config.min, config.max);
        // Check constraint if exists
        if (config.constraint) {
          const constraint = config.constraint.replace(/([A-Z_]+)/g, (match) => {
            return allParams[match] !== undefined ? allParams[match] : match;
          });
          try {
            const constraintMet = Function('value', '"use strict"; return value ' + constraint.substring(constraint.indexOf('<') || constraint.indexOf('>') || constraint.indexOf('=')))(value);
            if (constraintMet) break;
          } catch (e) {
            break;
          }
        } else {
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
        return evaluateExpression(config.formula, allParams);
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

// Main question generation function
export function generateQuestion(template) {
  // 1. Generate random parameter values
  const params = generateParameters(template.params);

  // 2. Replace placeholders in template
  const questionText = replacePlaceholders(template.template, params);

  // 3. Calculate correct answer
  const correctAnswerExpr = replacePlaceholders(template.correctAnswer, params);
  let correctAnswer = evaluateExpression(correctAnswerExpr, params);

  // Handle special functions in correct answer
  if (template.correctAnswer.includes('placeValue')) {
    const match = template.correctAnswer.match(/placeValue\(\{([^}]+)\},\s*\{([^}]+)\}\)/);
    if (match) {
      const num = params[match[1]];
      const digit = params[match[2]];
      correctAnswer = placeValue(num, digit);
    }
  }

  // Ensure correct answer is properly formatted
  if (typeof correctAnswer === 'number') {
    correctAnswer = correctAnswer % 1 === 0 ? String(correctAnswer) : correctAnswer.toFixed(2);
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

  // 5. Return generated question
  return {
    id: `${template.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    templateId: template.id,
    questionText,
    correctAnswer,
    options,
    answerType: template.answerType,
    topic: template.topic,
    difficulty: template.difficulty || 'medium'
  };
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
