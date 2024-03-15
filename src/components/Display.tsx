import React from "react";
import { Word } from "../models/word";

type Props = {
  words: Word[];
  wordRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  currentWordIndex: number;
  currentLetterIndex: number;
  isInputFocused: boolean;
};

function Display(props: Props) {
  return (
    <div
      className={`overflow-y-hidden select-none pointer-events-none flex flex-row flex-wrap w-auto h-[120px] gap-3 text-2xl ${
        !props.isInputFocused && "opacity-45"
      } px-3`}
    >
      {props.words.map((word, wIndex) => {
        const isCurrentWord = wIndex === props.currentWordIndex;
        return (
          <div
            key={wIndex}
            ref={(el) => {
              props.wordRefs.current[wIndex] = el;
            }}
            className={`flex text-gray-400`}
          >
            {word.letters.map((letter, lIndex) => {
              return (
                <span
                  key={lIndex}
                  className={`font-mono ${
                    isCurrentWord &&
                    lIndex === props.currentLetterIndex &&
                    props.isInputFocused &&
                    "border-l animate-[pulse-border_2s_infinite]"
                  } ${
                    isCurrentWord &&
                    lIndex === props.currentLetterIndex - 1 &&
                    props.isInputFocused &&
                    "border-r animate-[pulse-border_2s_infinite]"
                  } ${
                    letter.state === 0
                      ? "text-red-500"
                      : letter.state === 1
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  } ${
                    letter.state === 2 &&
                    "underline underline-offset-4 decoration-2 decoration-red-500"
                  }`}
                >
                  {letter.char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Display;
