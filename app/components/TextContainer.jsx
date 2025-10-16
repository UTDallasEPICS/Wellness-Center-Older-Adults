import React from "react";

export default function TextContainer(props) {
  const percentage = props.percentage ?? 82;

  return (
    <div
      className="w-[80%] h-[80%] mx-auto bg-white rounded-3xl flex flex-col items-center justify-center md:w-[30%] md:h-[30%] p-6"
    >
      {props.showCircle ? (
        <div className="relative flex items-center justify-center w-[180px] h-[180px] mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#d1e7d0"
              strokeWidth="17"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#419902"
              strokeWidth="17"
              fill="none"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - percentage/100)}
              strokeLinecap="round"
            />
          </svg>

          <span className="absolute text-5xl font-light text-[#103713]">
            {percentage}%
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center bg-[#cce3c6] rounded-2xl w-[180px] h-[180px] mb-4">
          <span className="text-[#103713] text-8xl font-light">
            {props.number}
          </span>
        </div>
      )}

      <p className="text-[#103713] text-center font-normal text-2xl mt-2">
        {props.text}
      </p>

      <div className="flex justify-center items-center">{props.elements}</div>
    </div>
  );
}
