import React from 'react';
import { cn } from '../../utils/cn';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn("w-full text-left border-collapse", className)}>
      {children}
    </table>
  </div>
);

export const THead: React.FC<TableProps> = ({ children, className }) => (
  <thead className={cn("bg-white/5 border-b border-luxury-border", className)}>
    {children}
  </thead>
);

export const TBody: React.FC<TableProps> = ({ children, className }) => (
  <tbody className={cn("divide-y divide-luxury-border/50", className)}>
    {children}
  </tbody>
);

export const TH: React.FC<TableProps> = ({ children, className }) => (
  <th className={cn("px-6 py-4 text-xs font-bold text-luxury-text-secondary uppercase tracking-widest", className)}>
    {children}
  </th>
);

export const TD: React.FC<TableProps> = ({ children, className }) => (
  <td className={cn("px-6 py-4 text-sm text-luxury-text-primary", className)}>
    {children}
  </td>
);

export const TR: React.FC<TableProps & { onClick?: () => void }> = ({ children, className, onClick }) => (
  <tr 
    className={cn(
      "group transition-colors duration-200", 
      onClick && "cursor-pointer hover:bg-white/5",
      className
    )}
    onClick={onClick}
  >
    {children}
  </tr>
);
