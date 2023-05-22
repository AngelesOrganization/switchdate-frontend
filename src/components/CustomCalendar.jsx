"use client"

import dayjs from "dayjs"
import Badge from "@mui/material/Badge"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { PickersDay } from "@mui/x-date-pickers/PickersDay"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton"
import { useEffect, useRef, useState } from "react"
import useSWR, { mutate } from 'swr';
import { Container, Button } from '@mui/material';


async function fetcher(url) {
  const response = await fetch(url[0], {
    headers: {
      'Authorization': `Bearer ${url[1]}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al cargar los datos');
  }

  return response.json();
};

const initialValue = dayjs("2022-04-17")

function ServerDay(props) {
  const { highlightedDays, calendarMonth, day, ...other } = props;

  const days = highlightedDays.map((shift) => { 
    return dayjs(shift.start_time).date();
  });

  let isHighlighted = false;

  if (days) {
    const selectedMonth = new Date(day).getMonth();

    if (calendarMonth === selectedMonth) {
      isHighlighted = days.includes(dayjs(day).date());
    }
  }
  
  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isHighlighted ? '🌚' : undefined}
    >
      <PickersDay
        {...other}
        day={day}
      />
    </Badge>
  );
}


export default function DateCalendarServerRequest(props) {
  const [selectedDateState, setSelectedDateState] = useState(null) 
  const [calendarMonthState, setCalendarMonthState] = useState(new Date().getMonth())
  const [calendarYearState, setCalendarYearState] = useState(new Date().getFullYear())
  const [highlightedDaysState, setHighlightedDaysState] = useState([])
  const [isLoadingState, setIsLoadingState] = useState(false)


  let { data, error } = useSWR([`http://127.0.0.1:8000/shifts?month=${calendarMonthState + 1 }&year=${calendarYearState}`, props.token], fetcher);
  

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
    setSelectedDateState(date);
  }

  function clickIntercambio() {
      console.log(JSON.stringify(selectedDateState));
  }

  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDateState}
          onChange={handleSelectedDate}
          loading={isLoadingState}
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
      onClick={clickIntercambio}
      sx={{ marginY: '16px' }}
      fullWidth
      >
        Registrarse
      </Button>
    </Container>
  )
}
