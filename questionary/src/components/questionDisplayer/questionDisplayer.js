import React from 'react';
import './questionDisplayer.css';

function QuestionDisplayer({ question, options }) {
  return (
    <div className="question-container">
      <div className="question">{question}</div>
      <div className="options">
        {Array.isArray(options) ? options.map((option, index) => (
          <div key={index} className="option">
            {option}
          </div>
        )) : null}
      </div>
    </div>
  );
}

export default QuestionDisplayer;
