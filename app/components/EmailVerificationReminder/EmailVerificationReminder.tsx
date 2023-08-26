import React from "react";

const EmailVerificationReminder = () => {
  return (
    <div className="bg-yellow-500 text-black p-4 flex items-center justify-center flex-col">
      {" "}
      {/* Changed to 'flex-col' */}
      <div className="flex items-center mb-2">
        {" "}
        {/* Enclosed svg and text in a div */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Please check your inbox and verify your email.</span>
      </div>
      <span className="text-xs">Once verified, please refresh this page.</span>
    </div>
  );
};

export default EmailVerificationReminder;
