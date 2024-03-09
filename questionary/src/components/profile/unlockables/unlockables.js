import React, { useEffect, useState } from 'react';
import { GET_UNLOCKS, UNLOCK_TROPHY } from '../../../enpoints';
import axios from "axios";
import getArchi from '../../../achiv';
import "./unlockables.css";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { getCookieValue } from '../../../authSlide';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#616161",
  color: "#000000",
  padding: "20px"
}));

function Unlockables() {
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  const getUnlocks = () => {
    axios
      .get(GET_UNLOCKS)
      .then((response) => {      
        setData(response.data);
        console.log(response.data)
      });

  }

  if (!dataLoaded) {
    getUnlocks();
    setDataLoaded(true);
  }

  return (
    <div className='container_unlocks'>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell align="left">Imagen</CustomTableCell>
              <CustomTableCell align="left">Nombre</CustomTableCell>
              <CustomTableCell align="left">Descripción</CustomTableCell>
              <CustomTableCell align="left">Rango</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([key, value]) => (
              <React.Fragment key={key}>
                <TableRow>
                  <TableCell colSpan={5}>{key}</TableCell>
                </TableRow>
                {Array.isArray(value) && value.map((achievement, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {/* Puedes necesitar ajustar el manejo de la imagen aquí */}
                      <div
                        style={{ backgroundImage: `url(${getArchi(achievement.image)})` }}
                        className="profile_container"
                      ></div>
                    </TableCell>
                    <TableCell align="left">{achievement.name}</TableCell>
                    <TableCell align="left">{achievement.description}</TableCell>
                    <TableCell align="left">{achievement.rank}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Unlockables;
