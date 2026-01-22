import { useState } from 'react';

function Calculator({ onClose }) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num));
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    const current = parseFloat(display);

    if (previousValue !== null && operation && !newNumber) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }

    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-4 max-w-xs w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Calculator</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="text-right text-2xl font-mono break-all">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg text-xl font-medium transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperation('÷')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-xl font-medium transition-colors"
          >
            ÷
          </button>

          {[4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg text-xl font-medium transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperation('×')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-xl font-medium transition-colors"
          >
            ×
          </button>

          {[1, 2, 3].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg text-xl font-medium transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperation('-')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-xl font-medium transition-colors"
          >
            -
          </button>

          <button
            onClick={() => handleNumber(0)}
            className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg text-xl font-medium transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg text-xl font-medium transition-colors"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-xl font-medium transition-colors"
          >
            =
          </button>
          <button
            onClick={() => handleOperation('+')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-xl font-medium transition-colors"
          >
            +
          </button>

          <button
            onClick={handleClear}
            className="col-span-4 bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-lg font-medium transition-colors uppercase"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
