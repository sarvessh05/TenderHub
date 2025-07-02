import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};