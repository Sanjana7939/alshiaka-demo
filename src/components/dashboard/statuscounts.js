//statuscounts.js
import { Grid, Stack } from "@mui/material";
import StatusCountCard from './statuscountcard';

export default function StatusCounts({ statusCount }) {

    const gridItems = statusCount.map(({ status, display_status, value }) => {
        return (
            <Grid key={status} item xs={12} sm={6} md={4} lg={2}>
                <StatusCountCard tmp={status} fieldname={display_status} count={value} />
            </Grid>
        )
    });

    return (
        <Stack alignItems="center" width="100%">
            <Grid
                container
                direction="row"
                justifyContent="center"  
                alignItems="center"   
                rowGap="10px"
                columns={12}
                sx={{ padding: 1, '& > *': { padding: '0px 6px' } }}
            >
                {gridItems}
            </Grid>
        </Stack>
    );
}