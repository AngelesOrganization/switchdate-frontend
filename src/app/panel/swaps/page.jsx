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
