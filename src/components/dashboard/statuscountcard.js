//statuscountcard.js
import { Card, CardContent, Typography } from "@mui/material";
import { AppTheme } from "../../utils/theme";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/app-context";
import { useCallback } from "react";

export default function StatusCountCard(props) {
  const { tmp, fieldname, count } = props;
  const { setDashboardLoading, setStatus } = useContext(AppContext);
  const navigate = useNavigate();
  const handleTicketClick = () => {
    console.log("Navigating to data page with status:", tmp);
    navigate(`/data?status=${tmp}`);
  };

  return (
    <Card
      sx={{
        borderRadius: "12px",
        cursor: "pointer",
        backgroundColor: `${AppTheme.secondary}`,
      }}
      onClick={handleTicketClick}
    >
      <CardContent
        sx={{
          padding: "3px",
          "&:last-child": { paddingBottom: "3px" },
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            fontSize: 18,
            fontWeight: "bold",
            color: "#3f3f3f",
            textAlign: "center",
            mb: "4px",
          }}
        >
          {fieldname}
        </Typography>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            color: AppTheme.primary,
            textAlign: "center",
          }}
        >
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
}
