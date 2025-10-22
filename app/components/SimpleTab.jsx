// app/components/SimpleTab.jsx
"use client";
import React, { useState, useEffect } from 'react';

const SimpleTab = ({ 
    activeKey, 
    children, 
    onChange, // Renamed from onTabClick for better convention
    tabClassName = "",
    activeTabClassName = "",
    inactiveTabClassName = "",
    tabContainerClassName = "",
    contentContainerClassName = ""
}) => {
    // Use an internal state that mirrors the controlled state (activeKey) if onChange is provided, 
    // or manages its own state if not fully controlled.
    const [key, setKey] = useState(activeKey);
    useEffect(() => {
        setKey(activeKey);
    }, [activeKey]);

    const childArray = React.Children.toArray(children).filter(Boolean);

    const handleTabClick = (newKey) => {
        if (onChange) {
            onChange(newKey);
        }
        setKey(newKey);
    };

    return (
        <div className="w-full">
            {/* Tab Headers Container */}
            <div className={`flex relative border-b border-gray-300 ${tabContainerClassName}`}>
                {childArray.map((item) => {
                    const isActive = key === item.props.aKey;
                    const defaultTabStyle = "px-5 py-2 text-xl font-semibold cursor-pointer transition-colors duration-200";
                    
                    return (
                        <div
                            key={item.props.aKey}
                            className={`${defaultTabStyle} ${tabClassName} ${
                                isActive 
                                    ? activeTabClassName 
                                    : inactiveTabClassName
                            }`}
                            onClick={() => handleTabClick(item.props.aKey)}
                        >
                            {item.props.title}
                        </div>
                    );
                })}
            </div>
            
            {/* Tab Content Container */}
            <div className={`p-0 ${contentContainerClassName}`}>
                {childArray.map((item) => (
                    <div
                        key={item.props.aKey}
                        className={`${key === item.props.aKey ? 'block' : 'hidden'} w-full`}
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