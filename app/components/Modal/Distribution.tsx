import { t } from "i18next";

const Distribution = ({ guessDistribution }) => {
  const distributionArray = [
    guessDistribution[1],
    guessDistribution[2],
    guessDistribution[3],
    guessDistribution[4],
    guessDistribution[5],
  ];

  const maxGuess = Math.max(...distributionArray);

  return (
    <div className="relative pl-6 mt-4 flex-auto">
      <h4 className="text-xl font-semibold">{t("stat.guessDistribution")}</h4>
      <div className="flex flex-col">
        {distributionArray.map((numGuesses, i) => (
          <div key={i}>
            <span className="mr-2 font-semibold">{i + 1}</span>
            <progress
              className="progress progress-success w-56 mt-4"
              value={numGuesses}
              max={maxGuess}
            ></progress>
            <span className="ml-2">{numGuesses}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Distribution;
