import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Root() {
  return (
    <>
      <Navbar />
      <div className="dark:bg-grey-900">
        <Outlet />
      </div>
      <footer className="absolute bottom-0 left-0 right-0 w-screen py-4 text-center text-sm text-gray-500">
        Pedro Dell'Olio - 2024
      </footer>
    </>
  );
}

export default Root;
