import { Card } from '@aws-amplify/ui-react';
import {
  Box, Divider, IconButton, Stack, Typography,
} from '@mui/material';
export default function ListBox({ children, ...attributes }) {
  return <Box {...attributes}>{children}</Box>;
}

ListBox.Header = ({ children, ...attributes }) => (
  <Box {...attributes}>{children}</Box>
);

ListBox.Header = ({ children, ...attributes }) => (
  <Box {...attributes}>{children}</Box>
);

ListBox.List = ({
  list, children, ...attributes
}) => (
  <Stack {...attributes}>
    {Array.isArray(list) && list.map((item, key) => children({ item, key }))}
  </Stack>
);

ListBox.ListItem = ({ children, ...attributes }) => () => (
  <Card {...attributes}>{children}</Card>
);

ListBox.HeaderWithIconAndSearchBar = ({
  children, Icon, title, onIconClick, type = 1, iconColor, ...searchbar
}) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    pt: 1,
  }}
  >
    {type === 2 && <Typography sx={{ px: 2, py: 1 }} variant="h6">{title}</Typography>}
    {type === 2 && <Divider />}
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 2,
      py: type === 1 ? 1 : 0,
    }}
    >
      {type === 1 && <Typography variant="h6">{title}</Typography> }
      {Icon &&(
      <IconButton onClick={onIconClick}
        sx={{
          backgroundColor: iconColor || '#356ffb',
          color: 'white',
          minWidth: 0,
          minHeight: 0,
          p: 0.5,
          ':hover': { backgroundColor: iconColor || '#356ffb' },
        }}
      >
        <Icon />
      </IconButton>
      )}
    </Box>
    <Divider />
  </Box>
);
