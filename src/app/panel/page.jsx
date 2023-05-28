"use client";

import CustomCalendar from "@/components/CustomCalendar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@mui/material";
import { fetcher } from "@/requests/requests";
import { apiShifts } from "@/requests/requests";


export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const [selectedDateState, setSelectedDateState] = useState(null);
  const [selectedShiftState, setSelectedShiftState] = useState(null);
  const [triggerMutate, setTriggerMutate] = useState(0);

  const loading = status === 'loading';

  if (!session) {
    return (
      <div>
        <h1>Acceso denegado</h1>
        <p>Debes iniciar sesión para acceder a esta página.</p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  async function handleCreateShift() {

    if (!selectedDateState) return;

    const dateObject = new Date(selectedDateState.valueOf() + selectedDateState.utcOffset() * 60 * 1000);

    await fetcher(
      {
        url: apiShifts,
        accessToken: session.accessToken,
        data: {
          start_time: dateObject,
          end_time: dateObject
        },
        method: 'POST'
      }
    );
    setTriggerMutate((triggerMutate) => triggerMutate + 1);
    setSelectedDateState(null);
  }


  async function handleDeleteShift() {
    if (selectedShiftState === undefined || selectedShiftState === null) return;

    await fetcher(
      {
        url: `${apiShifts}/${selectedShiftState.id}`,
        accessToken: session.accessToken,
        method: 'DELETE',
      }
    )
    setTriggerMutate((triggerMutate) => triggerMutate + 1);
    setSelectedDateState(null);
  }

  return (
    <div>
      <CustomCalendar
        token={session.accessToken}
        userId={session.user.id}
        selectedDateState={selectedDateState}
        setSelectedDateState={setSelectedDateState}
        setSelectedShiftState={setSelectedShiftState}
        triggerMutate={triggerMutate}
      />
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
    </div>
  );
}
