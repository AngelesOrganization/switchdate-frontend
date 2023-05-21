"use client";

import DateCalendarServerRequest from "@/components/CustomCalendar";
import { useSession } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

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

  return (
    <div>
      <DateCalendarServerRequest token={session.accessToken}/>
    </div>
  );
}
