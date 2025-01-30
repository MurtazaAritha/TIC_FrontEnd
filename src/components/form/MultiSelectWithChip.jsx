import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { CloseCircleOutlined } from '@ant-design/icons';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
  };
}

export default function MultiSelectWithChip(props) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const names =props?.options

  // Handle the changes for both selecting and deselecting items
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    // On autofill we get a stringified value.
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  // Handle chip removal (deselect by clicking the close icon on chip)
  const handleChipClick = (chip) => {
    setPersonName((prevSelected) => prevSelected.filter((item) => item !== chip));
  };

  React.useEffect(() => {
    props.onChange(personName);
  }, [personName, props]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">{props.label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  clickable
                  deleteIcon={<CloseCircleOutlined style={{ fontSize: '14px' }} onMouseDown={(event) => event.stopPropagation()} />}
                  style={{ borderRadius: '20px' }}
                  onDelete={(e) => handleChipClick(value)}
                  onClick={() => console.log('clicked chip')}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
