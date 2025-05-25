
import React, { useState } from 'react';
import { LightbulbIcon } from './Icons';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top', icon }) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex items-center">
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </span>
      {visible && (
        <div
          className={`absolute ${positionClasses[position]} w-max max-w-xs p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 break-words`}
        >
          <div className="flex items-start">
            {icon && <span className="mr-2 text-yellow-400">{icon}</span>}
            <span>{text}</span>
          </div>
           <div className={`absolute ${
            position === 'top' ? 'left-1/2 -translate-x-1/2 top-full' : 
            position === 'bottom' ? 'left-1/2 -translate-x-1/2 bottom-full' :
            position === 'left' ? 'top-1/2 -translate-y-1/2 left-full' :
            'top-1/2 -translate-y-1/2 right-full'
            } w-0 h-0 border-transparent ${
              position === 'top' ? 'border-t-gray-800 border-x-[6px]' :
              position === 'bottom' ? 'border-b-gray-800 border-x-[6px]' :
              position === 'left' ? 'border-l-gray-800 border-y-[6px]' :
              'border-r-gray-800 border-y-[6px]'
            }`}>
          </div>
        </div>
      )}
    </div>
  );
};


interface AiTipProps {
  tip: string;
  className?: string;
}
export const AiTip: React.FC<AiTipProps> = ({ tip, className }) => {
  return (
    <Tooltip text={tip} icon={<LightbulbIcon className="w-4 h-4 text-yellow-400"/>} position="right">
        <span className={`ml-2 text-sm text-gray-500 cursor-help ${className}`}>
            <LightbulbIcon className="w-5 h-5 text-yellow-400 inline-block" /> AI Tip
        </span>
    </Tooltip>
  )
}


export default Tooltip;
    