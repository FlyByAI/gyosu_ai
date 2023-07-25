import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const MathInput: React.FC = () => {
    const [input, setInput] = useState('c = \\pm\\sqrt{a^2 + b^2}');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  return (
    <div>
      <textarea value={input} onChange={handleInputChange} />
      <div className="bg-white p-2 mt-2 rounded shadow">
        <InlineMath>{input}</InlineMath>
      </div>
    </div>
  );
};

export default MathInput;
