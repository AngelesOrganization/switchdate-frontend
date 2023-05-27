export async function fetcher({url, accessToken, data, method}) {
  const response = await fetch(url, {
    method: method ?? 'GET',
    headers: {
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error('Error al cargar los datos');
  }

  return response.json();
};


export const apiGroups = `${process.env.NEXT_PUBLIC_HOST}/groups`;
export const apiGroupsJoin = `${process.env.NEXT_PUBLIC_HOST}/groups/join`;
export const apiUsers = `${process.env.NEXT_PUBLIC_HOST}/users`;
export const apiShifts = `${process.env.NEXT_PUBLIC_HOST}/shifts`;
export const apiSwaps = `${process.env.NEXT_PUBLIC_HOST}/swaps`;