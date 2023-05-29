"use client";

import { useSession } from "next-auth/react";
import useSWR from 'swr';
import GroupList from "./GroupList";
import { apiGroups, fetcher } from "@/requests/requests";

export default function ProtectedPage() {
  const { data: session, status } = useSession();


  const { data: groups, error } = useSWR(
    session ? {url: apiGroups, accessToken: session.accessToken} : null, 
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

  return (
    <div>
      <GroupList groups={groups}/>
    </div>
  );
}
