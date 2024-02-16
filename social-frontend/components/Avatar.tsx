import { Address } from 'viem';

export default function Avatar({ name }: { name?: Address | undefined }) {
  return (
    <div className="avatar online placeholder">
      <div className="bg-base-100 rounded-full w-12">
        <span className="text-xl">{name}</span>
      </div>
    </div>
  );
}
