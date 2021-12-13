import React, { useEffect } from "react";
import dataManager from "../components/DataManager";

export const AppStateContext = React.createContext({
  userData: { id: null, name: null, teamName: null },
  setUserData: ({}) => {},
});

export const AppStateProvider = (props) => {
  const [userData, setUserData] = React.useState({
    id: null,
    name: null,
    teamName: null,
  });

  useEffect(() => {
    dataManager
      .getUserId()
      .then((id) => {
        console.log("UserId: " + id);
        dataManager.getUserData(id).then((data) => {
          if (data.error) {
            setUserData({ id: id, name: null, teamName: null });
          } else {
            setUserData(data);
          }
          console.log("User data:", userData);
        });
      })
      .catch((e) => console.log("Error:", e));
  }, []);

  return (
    <AppStateContext.Provider value={{ userData, setUserData }}>
      {props.children}
    </AppStateContext.Provider>
  );
};
