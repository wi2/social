import { MouseEventHandler, ReactNode } from 'react';

export default function Swap({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick?: MouseEventHandler<HTMLLabelElement>;
}) {
  return (
    <label
      onClick={onClick}
      className={`swap swap-rotate ${active ? 'swap-active' : ''}`}
    >
      {/* this hidden checkbox controls the state */}
      <input type="checkbox" />
      {children}
    </label>
  );
}
