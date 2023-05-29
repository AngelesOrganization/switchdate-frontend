"use client";

import { useSession } from "next-auth/react";
import useSWR from 'swr';
import GroupList from "./GroupList";
import { apiGroups, fetcher } from "@/requests/requests";

export default function ProtectedPage() {
  const { data: session, status } = useSession();


  let { data: groups, error } = useSWR(
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

  if(groups == undefined || groups == null) {
    groups = [];
  }

  return (
    <div>
      <GroupList groups={groups}/>
    </div>
  );
}
