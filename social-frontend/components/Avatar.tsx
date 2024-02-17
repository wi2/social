import { Address } from 'viem';

export default function Avatar({ name }: { name?: Address | undefined }) {
  return (
    <div className="avatar placeholder">
      <div className="bg-base-100 border-2 border-accent border-opacity-20 rounded-full w-12">
        <span className="text-xl">{name}</span>
      </div>
    </div>
  );
}
