import React from "react";
import { SiLichess } from "react-icons/si";

export const Navbar = ({ fixed }) => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex items-center justify-between px-2 py-3 bg-blue-500 mb-3">
        <div className="container px-4 mx-auto flex items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a className="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white">
              Chessguessr
            </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          {/*<ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="nav-item">
              <a
                href="https://lichess.org/Assios"
                target="_blank"
                className="px-3 py-2 text-xl flex items-center font-bold text-white"
              >
                <SiLichess /> <span className="ml-2">Assios</span>
              </a>
            </li>
        </ul>*/}
        </div>
      </nav>
    </>
  );
};
