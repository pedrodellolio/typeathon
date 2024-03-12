import { Link } from "react-router-dom";

type Props = {};

function Navbar({}: Props) {
  return (
    <nav className="text-gray-900 flex flex-row items-center justify-between py-6 px-8 dark:bg-gray-900 dark:text-white">
      <Link
        to="/"
        className="font-bold text-gray-800 text-lg uppercase dark:text-white"
      >
        Type-a-thon
      </Link>
      <a
        className="flex flex-row items-center gap-4 group hover:bg-gray-50 p-3 rounded-md relative"
        href="https://github.com/pedrodellolio/typeathon"
        target="_blank"
      >
        <span className="invisible font-medium text-sm text-gray-400 w-32 absolute right-full ease-out duration-300 transform translate-x-5 group-hover:translate-x-3 group-hover:visible">
          /pedrodellolio
        </span>
        <i className="ri-github-line ri-xl"></i>
      </a>
    </nav>
  );
}

export default Navbar;
