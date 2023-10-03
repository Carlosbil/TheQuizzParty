import React, { useEffect, useState } from 'react';
import './tinkers.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QUESTIONS_URL, TINKERS_URL } from '../../enpoints'
import QuestionDisplayer from '../questionDisplayer/questionDisplayer';
import TinkersDisplayer from './tinkersDisplayer';

function Tinkers() {
  const [questions, setQuestions] = useState([])
  const [question, setQuestion] = useState([]);
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState("");
  const [start, setStart] = useState(false)

  const handleButtonClick = () => {
    setStart(true)
    setQuestion(questions[0].question)
    setOptions(questions[0].options)
    setAnswer(questions[0].answer)
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = () => {
    axios
      .get(TINKERS_URL)
      .then((response) => {
        setQuestions(response.data.questions);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error al iniciar el juego', error);
        if (error.response === undefined || error.response.data.error === undefined) {
          toast.error('Error al iniciar el juego:' + error.message);
        } else {
          toast.error('Error al iniciar el juego:' + error.response.data.error);
        }
      });
  }
  return (
    <div>
    {!start &&
      <button className='fun_tinker' onClick={handleButtonClick} >The fastest thinker alive</button>
    }
    {start && <TinkersDisplayer options_prop={options} answer_prop={answer} question_prop={question}/>
    }
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default Tinkers;
