import React from "react";

export default function TextContainer(props) {
  return (
    <div className="w-[80%] h-[55%] mx-auto bg-gray-100 rounded-3xl flex flex-col md:w-[30%] md:h-[55%]">
      <div className="text-[#65b037] text-[150px] bg-[#65b037]/30 w-[230px] h-[230px] rounded-full flex justify-center items-center mx-auto mt-[10%]">
        {props.number}
      </div>
      <p className="text-black text-center font-light text-[25px] px-5 flex justify-center items-center">
        {props.text}
      </p>
      <div className="flex justify-center items-center">{props.elements}</div>
    </div>
  );
}