import type { GuessDistribution } from '~/utils/types';

const Distribution = ({
  guessDistribution,
  highlight,
}: {
  guessDistribution: GuessDistribution;
  highlight?: number;
}) => {
  const counts = [1, 2, 3, 4, 5].map((n) => guessDistribution[n] ?? 0);
  const max = Math.max(1, ...counts);

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-semibold">Guess distribution</h3>
      <ol className="space-y-1">
        {counts.map((count, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 font-semibold tabular-nums">{i + 1}</span>
            <div className="flex-1">
              <div
                className={`flex justify-end rounded px-2 py-0.5 font-semibold tabular-nums ${
                  highlight === i + 1
                    ? 'text-white'
                    : 'bg-base-300 text-base-content'
                }`}
                style={{
                  width: `max(1.75rem, ${(count / max) * 100}%)`,
                  // Same green as a solved tile (styles/tile-animations.css).
                  ...(highlight === i + 1 && { background: '#12B980' }),
                }}
              >
                {count}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Distribution;
