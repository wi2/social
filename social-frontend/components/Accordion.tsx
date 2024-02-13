import { ReactNode } from 'react';

export default function ({
  children,
  name,
  title,
  checked,
}: {
  children: ReactNode;
  name: string;
  title: string;
  checked?: boolean;
}) {
  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input
        type="radio"
        name={name}
        onChange={(e) => e.preventDefault()} /* to prevent warning */
        checked={checked}
      />
      <div className="collapse-title text-xl font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
