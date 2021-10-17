import style from "../styles/Navbar.module.css";
const Navbar = () => {
  return (
    <div className={style.container}>
      <div className={style.brandLogo}>BrainJudge</div>
      <div className={style.menuItem}>
        <div className={style.item}>Home</div>
        <div className={style.item}>Tests</div>
        <div className={style.item}>Profile</div>
      </div>
    </div>
  );
};

export default Navbar;
