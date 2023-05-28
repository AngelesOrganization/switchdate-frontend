"use client";
import { Box, List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Button } from '@mui/material';
import { Card } from '@mui/material';

const SwapListComponent = ({ swaps, mode, handleSwap }) => {

    function listItemRenderer() {
        return swaps.map((swap) => (
            <Card variant="outlined">
                <ListItem key={swap.id} sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                    <ListItemText
                        primary={`${new Date(swap.requester_shift.start_time).toLocaleDateString('en-GB')} ↔️ ${new Date(swap.requested_shift.start_time).toLocaleDateString('en-GB')}`}
                        secondary={`${swap.requester.username} ↔️ ${swap.requested.username}`}
                    />
                    {swap.status === "pendiente" && mode === "requester" && (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Button 
                                variant="contained" 
                                color="success"
                                onClick={() => handleSwap(swap.id, "aceptar")}
                            >
                                Accept
                            </Button>
                            <Button 
                                variant="contained"
                                color="error"
                                onClick={() => handleSwap(swap.id, "rechazar")}>
                                Decline
                            </Button>
                        </Box>
                    )}
                    {swap.status === "pendiente" && mode === "requested" && (
                        <Button variant="contained" color="info">
                            Pending
                        </Button>
                    )}
                    {swap.status === "aceptado" && (
                        <Button variant="contained" color="success">
                            Accepted
                        </Button>
                    )}
                    {swap.status === "rechazado" && (
                        <Button variant="contained" color="error">
                            Rejected
                        </Button>
                    )}
                </ListItem>
            </Card>
        ));
    }

    return (
        <Box sx={{padding: '0'}}>
            <List sx={{ width: '100%', maxWidth: 360 }}>
                {listItemRenderer()}
            </List>
        </Box>
    );
};

export default SwapListComponent;
