import React, { useState } from 'react';

const Question = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-question">
      <div className="question-header" onClick={() => setIsOpen(!isOpen)}>
        <h4>{question}</h4>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <p>{answer}</p>}
    </div>
  );
};

export default Question;
