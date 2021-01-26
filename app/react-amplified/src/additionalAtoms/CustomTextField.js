import React, {useCallback, useState} from 'react';
import {TextField} from '@shopify/polaris';

export default function CustomTextField({label, placeholder, initialValue}) {
  const [value, setValue] = useState({initialValue});

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  return <TextField label={label} placeholder={placeholder} value={value} onChange={handleChange} />;
}
