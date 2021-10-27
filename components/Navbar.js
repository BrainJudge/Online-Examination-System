import { useContext } from "react";
import style from "../styles/Navbar.module.css";
import { AuthContext } from "../context/authContext";
import { useRouter } from "next/router";
import Link from "next/link";

const Navbar = () => {
  const { logout, isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const logoutHandler = () => {
    logout();
    router.push("/");
  };

  return (
    <div className={style.container}>
      <div className={style.brandLogo}>
        <img src="/Images/BrandLogo2.png" alt="Brand" />
      </div>
      <div className={style.menuItem}>
        <div className={style.item}>
          <Link href="/tests">Home</Link>
        </div>
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
