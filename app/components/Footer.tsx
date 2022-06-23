import React from "react";
import { SiLichess } from "react-icons/si";

export const Footer = () => {
  return (
    <footer className="text-center bg-blue-500 text-white mt-12">
      <div className="container px-6 pt-6">
        <div className="flex mb-6">
          Feedback? Message{" "}
          <a
            href="https://lichess.org/Assios"
            target="_blank"
            className="px-1 text-md flex items-center text-white"
          >
            <span className="mr-1">Assios</span> <SiLichess />
          </a>
        </div>
      </div>

      <div className="text-center p-1"></div>
    </footer>
  );
};
