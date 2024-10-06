import { Chip, FormControl, FormHelperText, InputLabel, Select } from '@mui/material'
import React from 'react'

// import theme from '@/styles/theme/default-theme'

export default function DropDown(props) {
  return (
    <FormControl
      fullWidth
      size="small"
      sx={{
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#212121',
        },
      }}
    >
      {props.label ? (
        <InputLabel
          sx={{
            fontSize: '14px',
            transform: 'unset',
            display: 'flex',
            gap: 8,
            marginBottom: '8px',
            alignItems: 'center',
            position: 'unset',
          }}
        >
         
          {props.label}
        </InputLabel>
      ) : (
        <></>
      )}

      <Select
        id="demo-simple-select"
        MenuProps={{ style: { marginTop: 8} }}
        sx={{
          '& .MuiSelect-select.Mui-disabled': {
            WebkitTextFillColor: '#212121',
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
          },
        }}
        value={props.value}
        onChange={(event) => props.onChange?.(event?.target?.value)}
        disabled={props.disabled}
        displayEmpty
        renderValue={(value) => {
          if (value) {
            return props.chipLabel ? (
              <Chip
                label={props.chipLabel}
                variant="outlined"
                size="small"
                sx={{ fontSize: '16px', borderRadius: '8px', backgroundColor: '#fff' }}
              />
            ) : (
              value
            )
          }
          return <em>Select</em>
        }}
      >
        {props.children}
      </Select>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  )
}
