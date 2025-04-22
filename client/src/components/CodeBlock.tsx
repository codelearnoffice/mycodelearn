import { useState } from "react";

const CodeBlock = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  return (
    <div className="code-block p-5 rounded-lg shadow-inner">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-sm text-gray-400">main.py</span>
      </div>
      <div>
        {[
          { line: 1, code: "def calculate_average(numbers):", highlight: false },
          { line: 2, code: "    \"\"\"Calculate the average of a list of numbers.\"\"\"", highlight: true, isComment: true },
          { line: 3, code: "    total = sum(numbers)", highlight: false },
          { line: 4, code: "    count = len(numbers)", highlight: false },
          { line: 5, code: "    if count == 0:", highlight: false },
          { line: 6, code: "        return 0", highlight: false },
          { line: 7, code: "    return total / count", highlight: false },
          { line: 8, code: "", highlight: false },
          { line: 9, code: "data = [12, 45, 78, 32, 91]", highlight: false },
          { line: 10, code: "average = calculate_average(data)", highlight: false },
          { line: 11, code: "print(f\"The average is: {average}\")", highlight: false }
        ].map((item) => (
          <span 
            key={item.line}
            className={`code-line ${item.highlight ? "code-highlight" : ""} ${isHovered === item.line ? "bg-opacity-10 bg-white" : ""}`}
            onMouseEnter={() => setIsHovered(item.line)}
            onMouseLeave={() => setIsHovered(null)}
          >
            {item.isComment ? (
              <span className="text-success">{item.code}</span>
            ) : (
              item.code
            )}
          </span>
        ))}
      </div>
      
      <div className="mt-4 bg-secondary bg-opacity-10 p-3 rounded">
        <p className="text-sm">
          <span className="font-bold text-secondary">Line-by-line Explanation:</span>
          <span className="block mt-1 text-gray-300">
            Function calculates the average of numbers by summing them, dividing by count, and handling empty lists.
          </span>
        </p>
      </div>
    </div>
  );
};

export default CodeBlock;
