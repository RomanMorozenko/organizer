import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/lab/Autocomplete";
import { useEffect, useState } from "react";

export const CityInput = () => {
  return (
    <FormControl>
      <TextField label="City" color="primary" focused placeholder="Type the city name" />
    </FormControl>
  );
};
