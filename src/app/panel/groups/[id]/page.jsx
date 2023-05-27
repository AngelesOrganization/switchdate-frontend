"use client";

import { useSession } from "next-auth/react";
import useSWR from 'swr';
import UserListComponent from "./UserList";
import { fetcher } from "@/requests/requests";


export default function Page({ params }) {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  const { data: users, error } = useSWR(
    session && {url: `http://127.0.0.1:8000/users/${params.id}`, accessToken: session.accessToken}, 
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
