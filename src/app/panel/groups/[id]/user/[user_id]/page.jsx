"use client";

import DateCalendarServerRequest2 from "@/components/CustomCalendar2";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProtectedPage({params}) {
  const { data: session, status } = useSession();
  const [ requesterSelectedDate, setRequesterSelectedDate ] = useState();
  const [ requestedSelectedDate, setRequestedSelectedDate ] = useState();

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

  async function handleSwapRequest() {
    console.log("requesterSelectedDate: " + JSON.stringify(requesterSelectedDate,null, 4));
    console.log("requestedSelectedDate: " + JSON.stringify(requestedSelectedDate,null, 4));
  }

  function wrapper(shift) {
    setRequestedSelectedDate(shift);
  }

  return (
    <div>
      <DateCalendarServerRequest2 token={session.accessToken} userId={params.user_id} setDate={setRequestedSelectedDate}/>
      <Button
        variant="contained"
        onClick={handleSwapRequest}
        color="primary"
        sx={{ marginY: '16px' }}
        fullWidth
      >
        Solicitar Turno
      </Button>
      <DateCalendarServerRequest2 token={session.accessToken} userId={session.user.id} setDate={setRequesterSelectedDate}/>
    </div>
  );
}
