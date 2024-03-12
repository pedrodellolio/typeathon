import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { getAccuracy, getWpm } from "../ts/tests";

type Props = {
  start: number;
  left: number;
  totalCorrectWords: number;
  uniqueCorrectLetters: number;
  uniqueMistypedLetters: number;
  uniqueMissedLetters: number;
  totalCorrect: number;
  totalErrors: number;
};

function Results(props: Props) {
  const wpm = useMemo(() => {
    return getWpm(props.start, props.left, props.uniqueCorrectLetters);
  }, [props.start, props.left, props.totalCorrectWords]);

  const accuracy = useMemo(() => {
    return getAccuracy(props.totalCorrect, props.totalErrors);
  }, [props.start, props.left, props.uniqueCorrectLetters]);

  return (
    <>
      <div
        className={`px-3 absolute top-0 w-full h-full z-10 select-none flex flex-col justify-center items-start bg-white transition-opacity duration-150 dark:bg-gray-900`}
      >
        <div className="flex flex-row m-auto gap-2 mt-4">
          <Tooltip>
            <TooltipTrigger>
              <div className="select-none flex-1 text-left font-mono text-lg border border-gray-200 rounded-md min-w-32 h-32 dark:border-gray-700">
                <p className="px-4 pt-4 text-gray-500 text-sm">wpm</p>
                <p className="text-center pt-4 text-4xl text-gray-900 dark:text-gray-100">
                  {wpm.toFixed(0)}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="Tooltip font-mono z-20 bg-gray-100 p-1 px-3 rounded-md dark:bg-gray-800 dark:text-gray-200">
              {wpm.toFixed(2)} wpm
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="text-center font-mono">
              <div className="select-none flex-1 text-left font-mono text-lg border border-gray-200 rounded-md min-w-32 h-32 dark:border-gray-700">
                <p className="px-4 pt-4 text-gray-500 text-sm">acc</p>
                <p className="text-center pt-4 text-4xl text-gray-900 dark:text-gray-100">
                  {accuracy.toFixed(0)}%
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="Tooltip font-mono z-20 bg-gray-100 p-1 px-3 rounded-md dark:bg-gray-800 dark:text-gray-200">
              {props.totalCorrect} correct / {props.totalErrors} incorrect
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="text-center font-mono">
              <div className="select-none flex-1 text-left font-mono text-lg border border-gray-200 rounded-md min-w-32 h-32 dark:border-gray-700">
                <p className="px-4 pt-4 text-gray-500 text-sm">time</p>
                <p className="text-center pt-4 text-4xl text-gray-900 dark:text-gray-100">
                  {props.start}s
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="Tooltip font-mono z-20 bg-gray-100 p-1 px-3 rounded-md dark:bg-gray-800 dark:text-gray-200">
              {props.start}s
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="text-center font-mono">
              <div className="select-none flex-1 text-left font-mono text-lg border border-gray-200 rounded-md w-[350px] h-32 dark:border-gray-700">
                <p className="px-4 pt-4 text-gray-500 text-sm">ratio</p>
                <p className="text-center pt-4 text-4xl text-gray-900 dark:text-gray-100">
                  {props.uniqueCorrectLetters} / {props.uniqueMistypedLetters} /{" "}
                  {props.uniqueMissedLetters}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="Tooltip font-mono z-20 bg-gray-100 p-1 px-3 rounded-md dark:bg-gray-800 dark:text-gray-200">
              correct / incorrect / missed
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default Results;
