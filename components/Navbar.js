import { useContext } from "react";
import style from "../styles/Navbar.module.css";
import { AuthContext } from "../context/authContext";
import { useRouter } from "next/router";
const Navbar = () => {
  const { logout, isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const logoutHandler = () => {
    logout();
    router.push("/");
  };
  return (
    <div className={style.container}>
      <div className={style.brandLogo}>BrainJudge</div>
      <div className={style.menuItem}>
        <div className={style.item}>Home</div>
        {isLoggedIn && (
          <div className={style.item} onClick={logoutHandler}>
            Logout
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
