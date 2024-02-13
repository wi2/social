import { ReactNode } from 'react';

export default function Content({ children }: { children: ReactNode }) {
  return (
    <div className="content min-h-svh w-full z-0 pt-20 pb-20">
      <div>{children}</div>
    </div>
  );
}
