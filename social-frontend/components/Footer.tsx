import { ConnectButton } from '@rainbow-me/rainbowkit';
import Icons from './Icons';

export default function Footer() {
  return (
    <footer className="footer items-center fixed bottom-0 w-full p-4 bg-neutral text-neutral-content">
      <aside className="items-center grid-flow-col">
        <Icons icon="diese" />
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <ConnectButton />
      </nav>
    </footer>
  );

  return (
    <footer className="footer footer-center fixed bottom-0 w-full p-4 bg-base-300 text-neutral-content z-10">
      <aside className="grid-flow-col justify-self-start">
        <Icons icon="diese" />
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <ConnectButton />
      </nav>
    </footer>
  );
}
