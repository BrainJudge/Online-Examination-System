import "../styles/globals.css";
import { AuthContext } from "../context/authContext";
import { useAuth } from "../customHooks/authHook";

function MyApp({ Component, pageProps }) {
  const auth = useAuth();
  const authContextValue = {
    isLoggedIn: !!auth.token,
    userId: auth.userId,
    personalInfo: auth.personalInfo,
    token: auth.token,
    login: auth.login,
    logout: auth.logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;
