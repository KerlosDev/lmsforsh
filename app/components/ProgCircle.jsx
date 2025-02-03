'use client'
import React from 'react'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress, {
    circularProgressClasses,
} from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';




const ProgCircle = ({nsaba,hight = 30}) => {

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: hight,
        borderRadius: 20,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 10,
            backgroundColor: '#22c55e',
            ...theme.applyStyles('dark', {
                backgroundColor: '#308fe8',
            }),
        },
    }));



    return (

        <div>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>

                <BorderLinearProgress variant="determinate" value={nsaba} />
            </Stack>
        </div>

    )
}

export default ProgCircle