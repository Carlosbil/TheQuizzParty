import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GET_UNLOCKS, UNLOCK_ACHIEVEMENTS } from '../../../enpoints';
import getArchi from '../../../achiv';
import './unlockables.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { getCookieValue } from '../../../authSlide';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#616161',
  color: '#FFFFFF',
  padding: '20px',
}));

function Unlockables() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const getUnlocks = async () => {
      const token = getCookieValue('auth_token');
      const formData = { token: token };
      try {
        const response = await axios.get(GET_UNLOCKS);
        const responseUnlock = await axios.post(UNLOCK_ACHIEVEMENTS, formData);
        const achievements = responseUnlock.data.length > 1 ? responseUnlock.data : response.data;
        sortData(achievements, order);
        setData(achievements); // Store original data
      } catch (error) {
        console.error('Error fetching unlocks:', error);
      }
    };

    getUnlocks();
  }, [order]); // Re-fetch when order changes

  const sortData = (unsortedData, order = 'asc') => {
    // Convert object of arrays into a single array
    const dataEntries = Object.values(unsortedData).flat();
    
    const sorted = dataEntries.sort((a, b) => {
      if (a.unlocked === b.unlocked) return 0;
      return order === 'asc' ? a.unlocked - b.unlocked : b.unlocked - a.unlocked;
    });
    
    setSortedData(sorted);
  };
  

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRequestSort = () => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
  };

  return (
    <div className='mt-20 w-[200%] max-w-4xl mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black'>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-2 text-center">
        Logros Desbloqueados
      </h2>
      <TableContainer component={Paper} className="bg-white dark:bg-black rounded-xl shadow-md">
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell align='center' className="text-neutral-800 dark:text-neutral-200">Completado</CustomTableCell>
              <CustomTableCell align='left' className="text-neutral-800 dark:text-neutral-200">Imagen</CustomTableCell>
              <CustomTableCell align='left' className="text-neutral-800 dark:text-neutral-200">Nombre</CustomTableCell>
              <CustomTableCell align='left' className="text-neutral-800 dark:text-neutral-200">Descripción</CustomTableCell>
              <CustomTableCell align='left' className="text-neutral-800 dark:text-neutral-200">Rango</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
              .map((achievement, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    {achievement.unlocked ? (
                      <label className="btn-lock">
                        <svg width="36" height="40" viewBox="0 0 36 40">
                          <path className="lockb" d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"></path>
                          <path className="lock" d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"></path>
                        </svg>
                      </label>
                    ) : (
                      <label className="btn-unlock">
                        <svg width="36" height="40" viewBox="0 0 36 40">
                          <path className="lockb" d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"></path>
                          <path className="lock" d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"></path>
                        </svg>
                      </label>
                    )}
                  </TableCell>
                  <TableCell>
                    <div
                      style={{ backgroundImage: `url(${getArchi(achievement.image)})` }}
                      className="profile_container w-16 h-16 bg-cover bg-center rounded-full"
                    ></div>
                  </TableCell>
                  <TableCell align='left' className="text-neutral-800 dark:text-neutral-200">{achievement.name}</TableCell>
                  <TableCell align='left' className="text-neutral-800 dark:text-neutral-200">{achievement.description}</TableCell>
                  <TableCell align='left' className="text-neutral-800 dark:text-neutral-200">{achievement.rank}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='pagination flex justify-between mt-4'>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="inline-flex h-12 rounded-lg px-6 py-2 text-sm font-medium text-black dark:text-white bg-slate-100 dark:bg-slate-950 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black transition-all duration-300"
        >
          Anterior
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= Math.ceil(sortedData.length / rowsPerPage) - 1}
          className="inline-flex h-12 rounded-lg px-6 py-2 text-sm font-medium text-black dark:text-white bg-slate-100 dark:bg-slate-950 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black transition-all duration-300"
        >
          Siguiente
        </button>
      </div>
      <div className='sort mt-4 text-center'>
        <button
          onClick={handleRequestSort}
          className="inline-flex h-12 rounded-lg px-6 py-2 text-sm font-medium text-black dark:text-white bg-slate-100 dark:bg-slate-950 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black transition-all duration-300"
        >
          Ordenar {order === 'asc' ? 'Descendente' : 'Ascendente'}
        </button>
      </div>
    </div>  
  );
}

export default Unlockables;
