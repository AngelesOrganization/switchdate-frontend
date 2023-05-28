"use client";

import { fetcher } from "@/requests/requests";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { useEffect, useState } from "react";
import useSWR from 'swr';
import { Container } from '@mui/material';
import { apiShifts } from "@/requests/requests";

export default function CustomCalendar({ userId, token, selectedDateState, setSelectedDateState, setSelectedShiftState, triggerMutate }) {
  const [calendarMonthState, setCalendarMonthState] = useState(new Date().getMonth());
  const [calendarYearState, setCalendarYearState] = useState(new Date().getFullYear());
  const [highlightedDaysState, setHighlightedDaysState] = useState([]);

  function ServerDay(propss) {
    const { highlightedDays, calendarMonth, day, ...other } = propss;

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

  let { data, mutate } = useSWR({ url: `${apiShifts}/${userId}?month=${calendarMonthState + 1}&year=${calendarYearState}`, accessToken: token }, fetcher);

  useEffect(() => {
    if (data) {
      setHighlightedDaysState(data);
    }
  }, [data])

  useEffect(() => {
    if (triggerMutate) {
      mutate();
    }
  }, [triggerMutate])

  function handleCalendarChange(date) {
    const dt = new Date(date);
    setCalendarMonthState(dt.getMonth());
    setCalendarYearState(dt.getFullYear());
  }

  function handleSelectedDate(date) {
    setSelectedDateState(date);
  }

  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDateState}
          onChange={handleSelectedDate}
          onMonthChange={handleCalendarChange}
          onYearChange={handleCalendarChange}
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
    </Container>
  )
}
