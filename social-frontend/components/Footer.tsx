import { ConnectButton } from '@rainbow-me/rainbowkit';
import Icons from './Icons';

export default function Footer() {
  return (
    <footer className="footer items-center fixed bottom-0 w-full p-4 bg-opacity-90 bg-neutral text-neutral-content">
      <aside className="items-center grid-flow-col">
        <Icons icon="diese" />
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <ConnectButton />
      </nav>
    </footer>
  );
}
