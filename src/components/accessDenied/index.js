import { Stack } from "react-bootstrap";
import ResponsiveAppBar from "../appBar";

export default function AccessDenied() {
    return (
        <Stack direction="column" style={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
            <ResponsiveAppBar title='Access Denied' />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>You don't have access to this page. Please contact the administrator.</p>
            </div>
        </Stack>
    )
}  