import React, { useEffect, useState } from "react";

export const UpdateDataContext = React.createContext({
  xupdated: false,
  setXupdated: ({}) => {},
  alternateBoolOnStepsPushed: false,
  setAlternateBoolOnStepsPushed: ({}) => {},

  alternateBoolOnApiReload: false,
  setAlternateBoolOnApiReload: ({}) => {},

  alternateBooleAtMidnight: false,
  setAlternateBoolAtMidnight: ({}) => {},
});

export const UserDataProvider = (props) => {
  const [alternateBoolOnStepsPushed, setAlternateBoolOnStepsPushed] =
    useState(false);
  const [alternateBoolOnApiReload, setAlternateBoolOnApiReload] =
    useState(false);
  const [alternateBooleAtMidnight, setAlternateBoolAtMidnight] =
    useState(false);

  const [xupdated, setXupdated] = useState(false);
  useEffect(() => {}, []);

  return (
    <UpdateDataContext.Provider
      value={{
        xupdated,
        setXupdated,
        alternateBoolOnStepsPushed,
        setAlternateBoolOnStepsPushed,
        alternateBoolOnApiReload,
        setAlternateBoolOnApiReload,
        alternateBooleAtMidnight,
        setAlternateBoolAtMidnight,
      }}
    >
      {props.children}
    </UpdateDataContext.Provider>
  );
};
