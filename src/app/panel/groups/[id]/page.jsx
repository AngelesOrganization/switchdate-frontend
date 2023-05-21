"use client";

import { useSession } from "next-auth/react";
import useSWR from 'swr';
import UserListComponent from "./UserList";

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


export default function Page({ params }) {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  const { data: users, error } = useSWR(
    session && [`http://127.0.0.1:8000/users/${params.id}`, session.accessToken], 
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
  
  if (loading || !users) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserListComponent users={users} groupId={params.id}/>
    </div>
  );
}
