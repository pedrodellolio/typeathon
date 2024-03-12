import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Root() {
  return (
    <>
      <Navbar />
      <div className="dark:bg-grey-900">
        <Outlet />
      </div>
    </>
  );
}

export default Root;
