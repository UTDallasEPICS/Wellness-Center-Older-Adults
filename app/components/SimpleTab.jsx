import React, { useState } from 'react';

const SimpleTab = ({ activeKey, children, onTabAdd }) => {
  const [key, setKey] = useState(activeKey);
  const childArray = Array.isArray(children) ? children : [children];

  const handleTabClick = (newKey) => {
    setKey(newKey);
  };

  const handleAddButtonClick = () => {
    if (onTabAdd) {
      onTabAdd();
    }
  };

  return (
    <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-[#fffdf5]">
      <div className="flex relative bg-[#fffdf5] border-b border-gray-300">
        {childArray.map((item) => (
          <div
            key={item.props.aKey}
            className={`min-w-[80px] px-5 py-4 text-gray-600 opacity-60 bg-[#fffdf5] text-xl text-center font-light cursor-pointer transition-all ease-in-out ${
              key === item.props.aKey
                ? 'opacity-100 bg-[#fffdf5] text-black border-b-4 border-black'
                : 'hover:opacity-100 hover:[#e2dbd0]/70'
            }`}
            onClick={() => handleTabClick(item.props.aKey)}
          >
            {item.props.title}
          </div>
        ))}
      </div>
      <div className="p-2.5 border-none bg-[#fffdf5]">
        {childArray.map((item) => (
          <div
            key={item.props.aKey}
            className={`${key === item.props.aKey ? 'block' : 'hidden'} bg-[#fffdf5] text-gray-800 font-light`}
          >
            {item.props.children}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Tab = () => {
  return <></>;
};

export default SimpleTab;