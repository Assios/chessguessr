import React from "react";

import { classNames } from "~/utils/utils";

const QuizStep = ({ roundStatus, currentRound }) => {
  return (
    <ol role="list" className="flex items-center justify-center">
      {roundStatus.map((step, stepIdx) => {
        const lineColor = step.correct ? "bg-green-600" : "bg-red-600";
        return (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== roundStatus.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative"
            )}
          >
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div
                className={`h-0.5 w-full transition-all duration-[800ms] ease-in-out ${
                  stepIdx < currentRound
                    ? lineColor
                    : stepIdx === currentRound
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              />
            </div>
            {step.status === "complete" ? (
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-[800ms] ease-in-out ${
                  step.correct ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white">{stepIdx + 1}</span>{" "}
                <span className="sr-only">{step.name}</span>
              </div>
            ) : step.status === "current" ? (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                <span className="text-indigo-600">{stepIdx + 1}</span>
                <span className="sr-only">{step.name}</span>
              </div>
            ) : (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                <span className="text-gray-300">{stepIdx + 1}</span>{" "}
                <span className="sr-only">{step.name}</span>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default QuizStep;
