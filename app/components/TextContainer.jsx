import React from "react";

export default function TextContainer(props) {
  return (
    <div className="w-[80%] h-[55%] mx-auto bg-[#e2dbd0]/70 rounded-3xl flex flex-col md:w-[30%] md:h-[55%]"
    style={{
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
  }}>
      <div className="text-[#103713] text-[150px] flex justify-center items-center mx-auto mt-[10%]">
        {props.number}
      </div>
      <p className="text-black text-center font-light text-[25px] px-5 flex justify-center items-center">
        {props.text}
      </p>
      <div className="flex justify-center items-center">{props.elements}</div>
    </div>
  );
}