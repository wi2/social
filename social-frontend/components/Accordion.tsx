import { ReactNode, useState } from 'react';

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
  const [check, setChecked] = useState(checked);

  return (
    <div className="collapse collapse-arrow bg-base-200 bg-opacity-80 mb-4 rounded">
      <input
        type="radio"
        name={name}
        onChange={(e) => {
          e.preventDefault();
          setChecked(!check);
        }}
        defaultChecked={check}
      />
      <div className="collapse-title text-xl font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
