import React, { useEffect, useState } from 'react';
import './tinkers.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TINKERS_URL } from '../../enpoints'
import TinkersDisplayer from './tinkersDisplayer';

function Tinkers() {
  const [questions, setQuestions] = useState([]);
  const [start, setStart] = useState(false);

  const handleButtonClick = () => {
    setStart(true);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = () => {
    axios
      .get(TINKERS_URL)
      .then((response) => {
        setQuestions(response.data.questions);
        console.log(response.data.questions);
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
      {start && <TinkersDisplayer questions_prop={questions} />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default Tinkers;
