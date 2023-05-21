'use client'

import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { useEffect } from 'react';

const API_ENDPOINT = 'https://ejemplo-api.com/dias-trabajados'; // Reemplaza con la URL correcta de la API

const MonthCalendar = () => {
  const [loading, setLoading] = React.useState(true);
  const [workDays, setWorkDays] = React.useState([]);
  const [selectedDays, setSelectedDays] = React.useState([]);

  useEffect(() => {
    const fetchWorkDays = async () => {
      try {
        const currentDate = dayjs();
        const year = currentDate.year();
        const month = currentDate.month() + 1;
        const response = await fetch(`${API_ENDPOINT}?year=${year}&month=${month}`);
        const data = await response.json();
        setWorkDays(data.workDays);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los días trabajados:', error);
      }
    };

    fetchWorkDays();
  }, []);

  const handleDayClick = (day: Dayjs) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        return prevSelectedDays.filter((selectedDay) => !selectedDay.isSame(day, 'day'));
      }
      return [...prevSelectedDays, day];
    });
  };

  const handleButtonClick = () => {
    // Aquí puedes realizar la lógica para enviar los días seleccionados al backend
    console.log('Días seleccionados:', selectedDays);
  };

  if (loading) {
    return <DayCalendarSkeleton />;
  }

  const renderDay = (day, _selectedDates, pickersDayProps) => {
    const isWorkDay = workDays.some((workDay) => day.isSame(workDay, 'day'));
    const isSelected = selectedDays.some((selectedDay) => day.isSame(selectedDay, 'day'));

    return (
      <Badge badgeContent="W" color={isWorkDay ? 'primary' : 'default'} overlap="circular">
        <PickersDay
          {...pickersDayProps}
          disableMargin
          onClick={() => handleDayClick(day)}
          selected={isSelected}
        />
      </Badge>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        renderDay={renderDay}
        date={dayjs()}
        onMonthChange={() => {}}
        components={{ Day }}
      />
      <button onClick={handleButtonClick}>Enviar días seleccionados</button>
    </LocalizationProvider>
  );
};

export default MonthCalendar;