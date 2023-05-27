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
import { apiShifts } from "@/requests/requests";
import { fetcher } from "@/requests/requests";

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

  let { data, mutate, error } = useSWR({url: `${apiShifts}?month=${calendarMonthState + 1}&year=${calendarYearState}`, accessToken: props.token}, fetcher);

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

  async function handleCreateShift() {

    if(!selectedDateState) return;

    const dateObject = new Date(selectedDateState.valueOf() + selectedDateState.utcOffset() * 60 * 1000);
    
    await fetcher(
      {
        url: apiShifts,
        accessToken: props.token,
        data: {
          start_time: dateObject,
          end_time: dateObject
        },
        method: 'POST'
      }
    );
    mutate();
    setSelectedDateState(null);
  }


  async function handleDeleteShift() {
    if(selectedShiftState === undefined ||selectedShiftState === null) return;

    await fetcher(
      {
        url: `${apiShifts}/${selectedShiftState.id}`,
        accessToken: props.token,
        method: 'DELETE',
      }
    )

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
