
import React from 'react';

interface AccessControlProps {
  role: string; 
  allow: string[]; 
  children: React.ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({ role, allow, children }) => {
  if (!allow.includes(role)) return null;

  return <>{children}</>;
};

export default AccessControl;
