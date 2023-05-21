"use client";

import { useSession } from "next-auth/react";
import InviteGroupFormComponent from "./InviteGroupForm";


export default function ProtectedPage({ params }) {
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
      <InviteGroupFormComponent token={session.accessToken} group_id={params.id}/>
    </div>
  );
}
