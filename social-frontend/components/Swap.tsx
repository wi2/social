import { MouseEventHandler, ReactNode } from 'react';

export default function Swap({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  active: boolean;
  onClick?: MouseEventHandler<HTMLLabelElement>;
  className?: string;
}) {
  return (
    <label
      onClick={onClick}
      className={`swap swap-rotate ${active ? 'swap-active' : ''} ${className}`}
    >
      {/* this hidden checkbox controls the state */}
      <input type="checkbox" />
      {children}
    </label>
  );
}
