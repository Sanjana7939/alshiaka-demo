import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Stack, Typography } from "@mui/material";
import { AppTheme } from '../../utils/theme';
import useBreakpoints from '../useBreakPoints';

export default function PieArcLabel({ data, totalContainers }) {
  console.log('PieArcLabel=====', data);
  let count = 0;
  data.map(item => {
    count = count + item.value;
  });

  const colors = [AppTheme['FCL_COLOR'], AppTheme['LCL_COLOR']];
  const { isXs, isSm, isMd, isLg, isXl, isSidebarCollapseBreakPoint } = useBreakpoints();
  const pieData = data.map(item => ({
    value: item.value,
    label: item.display_status,
  }));

  return (
    <Stack
      backgroundColor={AppTheme.secondary}
      border={`1px solid ${AppTheme.border}`}
      borderRadius='10px'
      justifyContent='center'
      alignItems='center'
      flex={1}
      width="100%"
      rowGap='1vh'
      pt="2vh"
    >
      <Typography sx={{ fontSize: 20, fontWeight: 'bold', color: '#3f3f3f', textAlign: 'center', mb: 1 }} >
        Total containers: {totalContainers}
      </Typography>
      <PieChart
        position="center"
        margin={{ bottom: 40, top: 0, left: 10, right: 10 }}
        colors={colors}
        series={[
          {
            data: pieData,
            arcLabel: (item) => `${(item.value * 100 / count).toFixed(1)}%`,
            arcLabelMinAngle: Number(40),
            innerRadius: Number(0),
            outerRadius: isXs ? Number(120) : Number(150),
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
          },
        }}
        height={370}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 2,

          },

        }}
      />
    </Stack>
  );
}
