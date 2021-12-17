import React, { useEffect, useState } from "react";
import dataManager from "../components/DataManager";

export const UserDataContext = React.createContext({
  userData: { id: null, name: null, teamName: null },
  setUserData: ({}) => {},
  updatedSteps: false,
  setUpdatedSteps: ({}) => {},
});

export const UserDataProvider = (props) => {
  const [userData, setUserData] = useState({
    id: null,
    name: null,
    teamName: null,
  });

  const [updatedSteps, setUpdatedSteps] = useState(false);

  useEffect(() => {
    let mounted = true;
    dataManager
      .getUserId()
      .then((id) => {
        console.log("UserId: " + id);
        dataManager.getUserData(id).then((data) => {
          if (data && data.error) {
            if (mounted) setUserData({ id: id, name: null, teamName: null });
          } else {
            if (mounted) setUserData(data);
          }
        });
      })
      .catch((e) => console.log("Error:", e));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <UserDataContext.Provider
      value={{ userData, setUserData, updatedSteps, setUpdatedSteps }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
};
