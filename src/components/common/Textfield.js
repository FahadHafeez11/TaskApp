import TextField from '@mui/material/TextField'
import React from 'react'
export default function Textfield({
  label,
  placeholder,
  value,
  onChange,
  required,
  onBlur,
  helperText,
  multiline,
  OutlinedInput,
}) {
  return (
    <TextField
      size="small"
      fullWidth
      onBlur={onBlur}
      required={required}
      helperText={helperText}
      onChange={onChange}
      multiline={multiline}
      placeholder={placeholder}
      value={value}
      label={label}
      sx={{
        '& .MuiInputBase-input.MuiOutlinedInput-input': {
          ...OutlinedInput,
        },
        '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-disabled': {
          backgroundColor: '#F5F5F5',
        },
        '& .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: '#212121',
        },
        '& .MuiInputLabel-root.Mui-disabled': {
          color: '#212121',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#212121',
        },
      }}
      
    />
  )
}
