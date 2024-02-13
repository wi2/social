import { ReactNode } from 'react';

export default function Drawer({ children }: { children: ReactNode }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      {children}
    </div>
  );
}

Drawer.Content = ({ children }: { children: ReactNode }) => (
  <div className="drawer-content flex flex-col items-center justify-center">
    {children}
  </div>
);

Drawer.Side = ({ children }: { children: ReactNode }) => (
  <div className="drawer-side">
    <label
      htmlFor="my-drawer-2"
      aria-label="close sidebar"
      className="drawer-overlay"
    ></label>
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content pb-20 pt-20">
      {children}
    </ul>
  </div>
);

Drawer.Toggle = ({ children }: { children: ReactNode }) => (
  <label
    htmlFor="my-drawer-2"
    className="btn btn-primary drawer-button lg:hidden"
  >
    {children}
  </label>
);
