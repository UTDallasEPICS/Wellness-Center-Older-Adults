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
    <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-white">
      <div className="flex relative border-b border-gray-300">
        {childArray.map((item) => (
          <div
            key={item.props.aKey}
            className={`min-w-[80px] px-5 py-4 text-gray-600 opacity-60 bg-white text-xl text-center font-light cursor-pointer transition-all duration-500 ease-in-out ${
              key === item.props.aKey
                ? 'opacity-100 bg-gray-100 border-b-4 border-black'
                : 'hover:opacity-100 hover:bg-gray-50'
            }`}
            onClick={() => handleTabClick(item.props.aKey)}
          >
            {item.props.title}
          </div>
        ))}
      </div>
      <div className="p-2.5 border-none">
        {childArray.map((item) => (
          <div
            key={item.props.aKey}
            className={`${key === item.props.aKey ? 'block' : 'hidden'} text-gray-800 font-light`}
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