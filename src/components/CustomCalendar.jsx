"use client"

import dayjs from "dayjs"
import Badge from "@mui/material/Badge"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { PickersDay } from "@mui/x-date-pickers/PickersDay"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton"
import { useEffect, useRef, useState } from "react"
import useSWR from 'swr';
import { Container, Button } from '@mui/material';


/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
async function fetcher(url, accessToken) {
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
  const { highlightedDays, day, ...other } = props;
  
  let isHighlighted = false;

  if(highlightedDays) {
    let s = dayjs(day).date();
    isHighlighted = highlightedDays.includes(s);
  }
  
  if(isHighlighted) {
    let s = dayjs(day).date();
    console.log(
      "ServerDay - s: " + JSON.stringify(s) +
      ", highlightedDays: " + JSON.stringify(highlightedDays) +
      ", day: " + JSON.stringify(day) +
      ", isHighlighted: " + JSON.stringify(isHighlighted)
    );
    
  }

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={(isHighlighted) ? '🌚' : undefined}
    >
      <PickersDay
        {...other}
        day={day}
      />
    </Badge>
  );
}


export default function DateCalendarServerRequest(props) {
  const [selectedDateState, setSelectedDateState] = useState(dayjs("2023-05-17")) 
  const requestAbortController = useRef(null)
  const [isLoadingState, setIsLoadingState] = useState(false)
  const [highlightedDaysState, setHighlightedDaysState] = useState([])

  const { data, error } = useSWR(['http://127.0.0.1:8000/shifts?month=5&year=2023', props.token], fetcher);

  // Cuando se obtenga la respuesta de la API, asignar los datos al estado
  if (data && highlightedDaysState.length == 0) {
    let x = data.map((shift) => { 
      console.log("shift: " + JSON.stringify(shift));
      return dayjs(shift.start_time).date();
    });
    console.log("x: " + JSON.stringify(x));
    setHighlightedDaysState(x);
  }

  const handleMonthChange = date => {
    setIsLoadingState(false)
    setHighlightedDaysState([])
  }


  function handleSelectedDate(date) {
    setSelectedDateState(date);
  }

  useEffect(() => {
    console.log("highlightedDaysState: " + JSON.stringify(highlightedDaysState))
  })

  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDateState}
          onChange={handleSelectedDate}
          loading={isLoadingState}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay
          }}
          slotProps={{
            day: {
              highlightedDays: highlightedDaysState
            }
          }}
        />
      </LocalizationProvider>
      <Button
      variant="contained"
      color="primary"
      sx={{ marginY: '16px' }}
      fullWidth
      >
        Registrarse
      </Button>
    </Container>
  )
}
