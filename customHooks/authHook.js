import { useState, useCallback, useEffect } from "react";
import useStorage from "./storageHook";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({});
  const { getItem, setItem, removeItem } = useStorage();

  //Local-login saving-token-to-localStorage
  const login = useCallback((uid, perInfo, accessToken, expirationDate) => {
    setToken(accessToken);
    setUserId(uid);
    setPersonalInfo(perInfo);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    const storageVal = {
      userId: uid,
      personalInfo: perInfo,
      token: accessToken,
      expiration: tokenExpirationDate.toISOString(),
    };
    setItem("userData", JSON.stringify(storageVal), "local");
  }, []);

  //logout
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    removeItem("userData", "local");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    let storedData = null;
    if (!!localStorage.getItem("userData")) {
      storedData = JSON.parse(getItem("userData", "local"));
    }
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.personalInfo,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login, token]);

  return {
    token,
    userId,
    personalInfo,
    login,
    logout,
  };
};
