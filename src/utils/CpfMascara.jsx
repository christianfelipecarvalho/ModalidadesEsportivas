import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';

const CPFField = ({ defaultValue, ...props }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <InputMask mask="999.999.999-99" value={value} onChange={(e) => setValue(e.target.value)}>
      {(inputProps) => <TextField {...props} {...inputProps} value={value} />}
    </InputMask>
  );
};

export default CPFField;