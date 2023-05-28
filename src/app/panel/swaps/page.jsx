"use client";

import CustomCalendar from "@/components/CustomCalendar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@mui/material";
import { apiSwaps, fetcher } from "@/requests/requests";
import { apiShifts } from "@/requests/requests";
import SwapListComponent from "./SwapList";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useSWR from 'swr';
import { apiUsers } from "@/requests/requests";

const swaps = [
    {
        "id": "4afeb3d7-925c-496a-ac65-d89ba176ff5a",
        "requester": {
            "id": "55acb001-4436-4ee9-8342-67cecc0ae6b9",
            "email": "string",
            "username": "string",
            "first_name": "string",
            "last_name": "string",
            "is_active": true,
            "role": "string",
            "created_at": "2023-05-16T19:44:04.806087",
            "updated_at": "2023-05-16T19:44:04.806087"
        },
        "requested": {
            "id": "6fe9445b-c69a-4d91-8151-b18bd9535e60",
            "email": "Ana@gmail.com",
            "username": "Ana",
            "first_name": "Ana",
            "last_name": "Fernando",
            "is_active": true,
            "role": "string",
            "created_at": "2023-05-20T18:33:55.003949",
            "updated_at": "2023-05-20T18:33:55.003949"
        },
        "requester_shift": {
            "id": "f5c5c2ab-f26e-4a4c-8f07-1f5340b84707",
            "user_id": "55acb001-4436-4ee9-8342-67cecc0ae6b9",
            "start_time": "2023-05-31T00:00:00",
            "end_time": "2023-05-31T00:00:00",
            "created_at": "2023-05-27T21:26:05.719162",
            "updated_at": "2023-05-27T21:26:05.719162"
        },
        "requested_shift": {
            "id": "22e848e1-d225-4bd1-b4bd-a44b5772b246",
            "user_id": "6fe9445b-c69a-4d91-8151-b18bd9535e60",
            "start_time": "2023-05-18T00:00:00",
            "end_time": "2023-05-18T00:00:00",
            "created_at": "2023-05-25T18:01:16.842995",
            "updated_at": "2023-05-25T18:01:16.842995"
        },
        "status": "pendiente",
        "created_at": "2023-05-27T21:27:05.822002",
        "updated_at": "2023-05-27T21:27:05.822002"
    },
    {
        "id": "6e1c1c8a-9634-49ea-8adc-6132404c6a24",
        "requester": {
            "id": "55acb001-4436-4ee9-8342-67cecc0ae6b9",
            "email": "string",
            "username": "string",
            "first_name": "string",
            "last_name": "string",
            "is_active": true,
            "role": "string",
            "created_at": "2023-05-16T19:44:04.806087",
            "updated_at": "2023-05-16T19:44:04.806087"
        },
        "requested": {
            "id": "6fe9445b-c69a-4d91-8151-b18bd9535e60",
            "email": "Ana@gmail.com",
            "username": "Ana",
            "first_name": "Ana",
            "last_name": "Fernando",
            "is_active": true,
            "role": "string",
            "created_at": "2023-05-20T18:33:55.003949",
            "updated_at": "2023-05-20T18:33:55.003949"
        },
        "requester_shift": {
            "id": "f3bd8a65-9695-4ff1-9f5e-3824b3a2e176",
            "user_id": "55acb001-4436-4ee9-8342-67cecc0ae6b9",
            "start_time": "2023-05-17T00:00:00",
            "end_time": "2023-05-17T00:00:00",
            "created_at": "2023-05-27T21:26:04.464867",
            "updated_at": "2023-05-27T21:26:04.464867"
        },
        "requested_shift": {
            "id": "0625fede-ea3b-4d51-b4be-3cc37aa2f677",
            "user_id": "6fe9445b-c69a-4d91-8151-b18bd9535e60",
            "start_time": "2023-05-16T00:00:00",
            "end_time": "2023-05-16T00:00:00",
            "created_at": "2023-05-25T18:01:13.067001",
            "updated_at": "2023-05-25T18:01:13.067001"
        },
        "status": "pendiente",
        "created_at": "2023-05-27T21:30:12.895479",
        "updated_at": "2023-05-27T21:30:12.895479"
    }
]

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            padding="0"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

export default function Page() {
    const [value, setValue] = useState(0);
    const { data: session, status } = useSession();
    const [selectedDateState, setSelectedDateState] = useState(null);
    const [selectedShiftState, setSelectedShiftState] = useState(null);
    const [triggerMutate, setTriggerMutate] = useState(0);

    async function handleChange(event, newValue) {
        setValue(newValue);
    };

    const loading = status === 'loading';

    const { data: requestedSwaps, mutate: mutateRequestedSwaps } = useSWR(
        session ? {url: `${apiUsers}/requested-swaps`, accessToken: session.accessToken} : null, 
        fetcher
    )

    const { data: requesterSwaps, mutate: mutateRequesterSwaps} = useSWR(
        session ? {url: `${apiUsers}/requester-swaps`, accessToken: session.accessToken} : null, 
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

    if (loading || !requesterSwaps || !requestedSwaps) {
        return <div>Loading...</div>;
    }

    async function handleSwap(swapId, status) {
        await fetcher(
            {
                accessToken: session.accessToken,
                url: `${apiSwaps}/status/${swapId}?status=${status}`,
                method: "PUT"
            }
        )
        mutateRequestedSwaps();
        mutateRequesterSwaps();
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Requested Swaps" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
                    <Tab label="Requests" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <SwapListComponent mode="requested" swaps={requestedSwaps.swaps} handleSwap={handleSwap}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SwapListComponent mode="requester" swaps={requesterSwaps.swaps} handleSwap={handleSwap}/>
            </TabPanel>
        </Box>
    );
}
