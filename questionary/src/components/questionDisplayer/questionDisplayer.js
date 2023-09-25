import React from 'react';
import './questionDisplayer.css';

function QuestionDisplayer({ question, answer, options }) {
  return (
    <div className="question-container">
      <div className="question">{question}</div>
      <div className="options">
        {options.map((option, index) => (
          <div key={index} className="option">
            {option}
          </div>
        ))}
      </div>
      <div className="answer">{answer}</div>
    </div>
  );
}

export default QuestionDisplayer;
