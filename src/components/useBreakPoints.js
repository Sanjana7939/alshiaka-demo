import { useTheme, useMediaQuery } from '@mui/material';

export default function useBreakpoints() {
  const breakpoints = {
    isXs: useMediaQuery("(max-width: 450px)"),
    isSm: useMediaQuery("(min-width: 450px) and (max-width: 600px)"),
    isMd: useMediaQuery("(min-width: 600px) and (max-width: 900px)"),
    isLg: useMediaQuery("(min-width: 900px) and (max-width: 1250px)"),
    isXl: useMediaQuery("(min-width: 1250px)"),
    isSidebarCollapseBreakPoint: useMediaQuery("(max-width: 750px)"),
    active: "lg"
  };
  // if (breakpoints.isXs) breakpoints.active = "xs";
  // if (breakpoints.isSm) breakpoints.active = "sm";
  // if (breakpoints.isMd) breakpoints.active = "md";
  // if (breakpoints.isLg) breakpoints.active = "lg";
  return breakpoints;
}
