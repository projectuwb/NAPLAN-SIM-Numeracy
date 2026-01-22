import { useEffect, useState } from 'react';

function Timer({ timeLimit, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColorClass = () => {
    if (timeLeft < 60) return 'text-red-600 animate-pulse bg-red-50';
    if (timeLeft < 300) return 'text-yellow-700 bg-yellow-50';
    return 'text-gray-700 bg-gray-50';
  };

  return (
    <div className={`text-xl md:text-2xl font-mono font-medium px-4 py-2 rounded-lg ${getColorClass()}`}>
      ⏱️ {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default Timer;
