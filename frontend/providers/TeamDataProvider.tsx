import React, { useEffect, useState, useContext } from "react";
import dataManager from "../components/DataManager";
import { UserDataContext } from "./UserDataProvider";
import { UpdateContext } from "./UpdateProvider";

export const TeamDataContext = React.createContext({
  teamName: null,
  mode: null,
  isUserInATeam: false,
  teamMembersAndStepCountOfToday: [],
  teamChallengeData: { progress: 0, totalSteps: 0, teamMembersGoal: 0 },
  isTeamMembersAndStepCountOfTodayLoading: true,
});

export const TeamDataProvider = (props) => {
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const [mode, setMode] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [teamMembersAndStepCountOfToday, setTeamMembersAndStepCountOfToday] =
    useState([]);
  const [
    isTeamMembersAndStepCountOfTodayLoading,
    setIsTeamMembersAndStepCountOfTodayLoading,
  ] = useState(true);
  const [teamChallengeData, setTeamChallengeData] = useState({
    progress: 0,
    totalSteps: 0,
    teamMembersGoal: 0,
  });

  const { userData } = useContext(UserDataContext);
  const { apiReloadIndicator, stepsPushedIndicator, midnightIndicator } =
    useContext(UpdateContext);

  useEffect(() => {
    if (userData.team !== null) {
      setIsUserInATeam(true);
    } else {
      setIsUserInATeam(false);
      setMode(null);
    }
  }, [userData.team]);

  useEffect(() => {
    let mounted = true;
    if (isUserInATeam && mounted) {
      dataManager.getTeamData(userData.team).then((data) => {
        if (mounted && data) {
          setTeamName(data.name);
          setMode(data.progressCalculationMode);
        }
      });
    }
  }, [isUserInATeam]);

  useEffect(() => {
    let mounted = true;
    if (isUserInATeam && mode) {
      dataManager
        .getTeamMembersAndStepCountOfToday(userData.team, mode)
        .then((data) => {
          if (mounted && data) setTeamMembersAndStepCountOfToday(data);
        })
        .finally(() => setIsTeamMembersAndStepCountOfTodayLoading(false));

      dataManager
        .getTeamChallengeData(userData.team)
        .then((data) => {
          if (mounted && data) {
            if (!data.progress || isNaN(data.progress) || data.progress < 0)
              data.progress = 0;

            if (
              !data.total_steps ||
              isNaN(data.total_steps) ||
              data.total_steps < 0
            )
              data.totalSteps = 0;
            else data.totalSteps = data.total_steps;

            delete data.total_steps;

            setTeamChallengeData(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return () => {
        mounted = false;
      };
    }
    return () => {
      mounted = false;
    };
  }, [
    mode,
    apiReloadIndicator,
    stepsPushedIndicator,
    midnightIndicator,
    isUserInATeam,
  ]);

  return (
    <TeamDataContext.Provider
      value={{
        mode,
        teamName,
        isUserInATeam,
        teamMembersAndStepCountOfToday,
        teamChallengeData,
        isTeamMembersAndStepCountOfTodayLoading,
      }}
    >
      {props.children}
    </TeamDataContext.Provider>
  );
};
