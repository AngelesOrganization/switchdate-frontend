"use client";

import { useSession } from "next-auth/react";
import useSWR from 'swr';
import GroupList from "./GroupList";

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


export default function ProtectedPage() {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  const { data: groups, error } = useSWR(
    session ? [`http://localhost:8000/groups`, session.accessToken] : null, 
    fetcher
  )

  if (!session) {
    return (
      <div>
        <h1>Acceso denegado</h1>
        <p>Debes iniciar sesión para acceder a esta página.</p>
      </div>
    );
  }
  
  if (loading || !groups) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GroupList groups={groups}/>
    </div>
  );
}
