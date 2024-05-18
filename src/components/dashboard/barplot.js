import { BarChart } from '@mui/x-charts/BarChart';
import { Stack, Typography } from "@mui/material";
import { AppTheme } from '../../utils/theme';
import useBreakpoints from '../useBreakPoints';

const palette = [AppTheme['NEW'], AppTheme['PLACEMENT_PROVIDED'], AppTheme['READY_FOR_UNLOADING'], AppTheme['UNLOADING_START'], AppTheme['CONTAINER_EMPTY'], AppTheme['CONTAINER_LEFT_DC']];
function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

const CustomLegend = ({ legendData }) =>{
  const { isXs, isSm, isMd, isLg, isXl, isSidebarCollapseBreakPoint } = useBreakpoints();
   return(
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', paddingBottom: '5px' }}>
    {legendData.map((status, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight:isXs?'5px': '20px' }}>
        <div style={{ width:isXs?'15px': '20px', height:isXs?'15px': '20px', backgroundColor: palette[index % palette.length], marginRight: '5px' }}></div>
        <span>{status}</span>
      </div>
    ))}
  </div>
)};

export default function BasicBars({ data }) {
  console.log("bar data======", data);

  const xLabel = data.map(item => item.type);

  let seriesData = []
  seriesData = data && data.map(item => ({
    type: 'bar',
    data: item.stats.map(stat => stat.value),
    status: item.stats.map(stat => stat.display_status),
  }));

  console.log('seriesData=======', seriesData)

  // const flattenedSeriesData = transpose(seriesData.map(series => series.data)).map((dataPoints, index) => ({
  //   type: 'bar',
  //   data: dataPoints,
  //   status: seriesData[index].status,
  // }));

  let flattenedSeriesData = []
  if (seriesData.length > 0) {
    for(let i = 0; i < seriesData[0].data.length; i++) {
      let data = [];
      let status = [];
      let type = [];
      for(let j = 0; j < seriesData.length; j++) {
        data.push(seriesData[j].data[i])
        status.push(seriesData[j].status[i])
        type.push(seriesData[j].type)
      }
      flattenedSeriesData.push({ data, status })
    }
  }

  console.log('flattenedSeriesData========', flattenedSeriesData)

  const legendData = [...new Set(seriesData.flatMap(series => series.status))];
  console.log('legendData', legendData)

  return (
    <Stack
      backgroundColor={AppTheme.secondary}
      border={`1px solid ${AppTheme.border}`}
      alignItems='center'
      justifyContent='center'
      borderRadius= '10px'
      width="100%"
      rowGap='1vh'
      pt="2vh"
    >
      <Typography sx={{ fontSize: 20, fontWeight: 'bold', color: '#3f3f3f', textAlign: 'center', mb: 1}}>
        Stores per STATUS
      </Typography>

      <BarChart
        margin={{ bottom: 40, top: 6 }}
        colors={palette}
        dataset={data}
        xAxis={[{
          scaleType: 'band', data: xLabel,
        }]}
        yAxis={[{ label: 'Containers Count' }]}
        series={flattenedSeriesData}
        height={320}
      />

      <CustomLegend legendData={legendData} />
    </Stack>
  );
}
