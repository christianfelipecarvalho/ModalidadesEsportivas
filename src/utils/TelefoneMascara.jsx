import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';

const TelefoneField = ({ defaultValue, ...props }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <InputMask mask="(99) 99999-9999" value={value} onChange={(e) => setValue(e.target.value)}>
      {(inputProps) => <TextField {...props} {...inputProps} value={value} />}
    </InputMask>
  );
};

export default TelefoneField;