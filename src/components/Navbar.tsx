import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {};

function Navbar({}: Props) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  return (
    <nav className="text-gray-900 flex flex-row items-center justify-between py-6 px-8 dark:bg-gray-900 dark:text-white">
      <Link
        to="/"
        className="font-bold text-gray-800 text-lg uppercase dark:text-white"
      >
        Type-a-thon
      </Link>
      <div className="flex flex-row items-center gap-8">
        <a
          className="flex flex-row items-center gap-4 group p-3 py-4 rounded-md relative"
          href="https://github.com/pedrodellolio/typeathon"
          target="_blank"
        >
          <span className="invisible font-medium text-sm text-gray-400 w-32 absolute right-full ease-out duration-300 transform translate-x-5 group-hover:translate-x-3 group-hover:visible">
            /pedrodellolio
          </span>
          <i className="ri-github-line ri-lg"></i>
        </a>
        <button onClick={toggleDarkMode} className="p-3 rounded-md">
          <div className="duration-300 hover:rotate-45">
            <i
              className={`${darkMode ? "ri-moon-line" : "ri-sun-line"} ri-lg`}
            ></i>
          </div>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
