"use client";

import CustomCalendar from "@/components/CustomCalendar2";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { fetcher } from "@/requests/requests";
import { apiSwaps } from "@/requests/requests";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ params }) {
  const { data: session, status } = useSession();
  const [requesterSelectedDate, setRequesterSelectedDate] = useState(null);
  const [requestedSelectedDate, setRequestedSelectedDate] = useState(null);
  const [requesterSelectedShift, setRequesterSelectedShift] = useState(null);
  const [requestedSelectedShift, setRequestedSelectedShift] = useState(null);
  const [triggerMutate, setTriggerMutate] = useState(0);
  const router = useRouter();

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
    if (!requesterSelectedShift || !requestedSelectedShift) {
      return;
    }

    await fetcher(
      {
        url: apiSwaps,
        accessToken: session.accessToken,
        data: {
          requester_id: session.user.id,
          requested_id: params.user_id,
          requester_shift_id: requesterSelectedShift.id,
          requested_shift_id: requestedSelectedShift.id
        },
        method: 'POST'
      }
    )
    router.push("/panel");
  }

  return (
    <div>
      <h1>A quien le pides</h1>
      <CustomCalendar
        token={session.accessToken}
        userId={params.user_id}
        selectedDateState={requestedSelectedDate}
        setSelectedDateState={setRequestedSelectedDate}
        setSelectedShiftState={setRequestedSelectedShift}
        triggerMutate={triggerMutate}
      />
      <Button
        variant="contained"
        onClick={handleSwapRequest}
        color="primary"
        sx={{ marginY: '16px' }}
        fullWidth
      >
        Solicitar Turno
      </Button>
      <h1>Tu calendario</h1>
      <CustomCalendar
        token={session.accessToken}
        userId={session.user.id}
        selectedDateState={requesterSelectedDate}
        setSelectedDateState={setRequesterSelectedDate}
        setSelectedShiftState={setRequesterSelectedShift}
        triggerMutate={triggerMutate}
      />
    </div>
  );
}
