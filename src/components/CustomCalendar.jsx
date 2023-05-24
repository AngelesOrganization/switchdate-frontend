"use client";

import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { useEffect, useState } from "react";
import useSWR from 'swr';
import { Container, Button } from '@mui/material';


async function fetcher(url) {
  console.log(url[2]);
  const requestOptions = {
    method: url[2],
    headers: {
      'Authorization': `Bearer ${url[1]}`,
    },
  };

  const response = await fetch(url[0], requestOptions);

  if (!response.ok) {
    throw new Error('Error al cargar los datos');
  }

  return response.json();
};

export default function DateCalendarServerRequest(props) {
  const [selectedDateState, setSelectedDateState] = useState(null);
  const [calendarMonthState, setCalendarMonthState] = useState(new Date().getMonth());
  const [calendarYearState, setCalendarYearState] = useState(new Date().getFullYear());
  const [highlightedDaysState, setHighlightedDaysState] = useState([]);
  const [selectedShiftState, setSelectedShiftState] = useState(null);

  function ServerDay(props) {
    const { highlightedDays, calendarMonth, day, ...other } = props;

    const currentRenderingDay = new Date(day).getDate();
    const currentRenderingMonth = new Date(day).getMonth();
    const currentRenderingYear = new Date(day).getFullYear();

    const matchingShift = highlightedDays.find((shift) => {
      const shiftDay = new Date(shift.start_time).getDate();
      const shiftMonth = new Date(shift.start_time).getMonth();
      const shiftYear = new Date(shift.start_time).getFullYear();

      return shiftDay === currentRenderingDay && shiftMonth === currentRenderingMonth && shiftYear === currentRenderingYear;
    });

    let isHighlighted = matchingShift !== undefined;

    return (
      <Badge
        key={day.toString()}
        onClick={() => {
          setSelectedShiftState(matchingShift);
        }}
        overlap="circular"
        badgeContent={isHighlighted ? '🌚' : undefined}
      >
        <PickersDay {...other} day={day} />
      </Badge>
    );
  }

  let { data, mutate, error } = useSWR([`http://127.0.0.1:8000/shifts?month=${calendarMonthState + 1}&year=${calendarYearState}`, props.token, 'GET'], fetcher);

  useEffect(() => {
    if (data) {
      setHighlightedDaysState(data);
    }
  }, [data])

  function handleMonthChange(date) {
    setCalendarMonthState(new Date(date).getMonth());
    setCalendarYearState(new Date(date).getFullYear());
  }

  function handleYearChange(date) {
    setCalendarMonthState(new Date(date).getMonth());
    setCalendarYearState(new Date(date).getFullYear());
  }

  function handleSelectedDate(date) {
    console.log(date);
    console.log(date.toDate());
    setSelectedDateState(date);
  }

  async function handleCreateShift() {

    if(!selectedDateState) return;

    const url = "http://127.0.0.1:8000/shifts";

    const dateObject = new Date(selectedDateState.valueOf() + selectedDateState.utcOffset() * 60 * 1000);

    const data = {
      start_time: dateObject,
      end_time: dateObject
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error:', response.status);
      }

      const responseData = await response.json();
      console.log('Success:', responseData);
      // Handle the response data here

    } catch (error) {
      console.error('Error:', error);
      // Handle errors here
    }
    mutate();
    setSelectedDateState(null);
  }


  async function handleDeleteShift() {
    console.log(selectedShiftState);
    if(selectedShiftState === undefined ||selectedShiftState === null) return;

    const deleteUrl = `http://127.0.0.1:8000/shifts/${selectedShiftState.id}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${props.token}`,
      },
    };

    const response = await fetch(deleteUrl, requestOptions);

    mutate();
    setSelectedDateState(null);
  }

  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDateState}
          onChange={handleSelectedDate}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay
          }}
          slotProps={{
            day: {
              highlightedDays: highlightedDaysState,
              calendarMonth: calendarMonthState
            }
          }}
        />
      </LocalizationProvider>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDeleteShift}
        sx={{ marginY: '16px' }}
        fullWidth
      >
        Borrar Turno
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateShift}
        sx={{ marginY: '16px' }}
        fullWidth
      >
        Añadir Turno
      </Button>
    </Container>
  )
}
