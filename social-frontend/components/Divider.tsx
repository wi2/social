import { ReactNode } from 'react';

export default function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full lg:flex-row pt-4">{children}</div>
  );
}

Divider.Line = () => <div className="divider lg:divider-horizontal" />;

Divider.Left = ({ children }: { children?: ReactNode }) => (
  <div className="grid flex-grow h-full card place-items-start">{children}</div>
);

Divider.Right = ({ children }: { children?: ReactNode }) => (
  <div className="grid flex-grow h-full place-items-end">{children}</div>
);
