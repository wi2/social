import { Address } from 'viem';
import useContract from '../context/Contract';

export default function Avatar({
  name,
  noTooltip,
}: {
  name?: Address | undefined;
  noTooltip?: boolean;
}) {
  const { profiles } = useContract();

  return (
    <div
      className={`avatar placeholder ${
        noTooltip ? '' : 'tooltip tooltip-bottom'
      }`}
      data-tip={profiles?.[`profile-${name}`]}
    >
      <div className="bg-base-100 border-2 border-accent border-opacity-20 rounded-full w-12">
        <span className="text-xl">{name}</span>
      </div>
    </div>
  );
}
