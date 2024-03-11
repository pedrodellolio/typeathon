import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/Tooltip";
const words = [
  "Amor",
  "Feliz",
  "Sonho",
  "Beleza",
  "Fúria",
  "Sorrir",
  "Coragem",
  "Brilho",
  "Alegria",
  "Tristeza",
  "Dançar",
  "Criança",
  "Cantar",
  "Sorriso",
  "Estrela",
  "Doce",
  "Amigo",
  "Paz",
  "Coração",
  "Medo",
  "Flores",
  "Verde",
  "Gritar",
  "Anjo",
  "Sabor",
  "Quente",
  "Livro",
  "Amante",
  "Azul",
  "Chuva",
];

interface Word {
  letters: Letter[];
}

interface Letter {
  char: string;
  state?: number; // 0 - error; 1 - correct; 2 - missed; undefined - unreached letter
}

function App() {
  const [input, setInput] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTestWords, setCurrentTestWords] = useState<Word[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [timerStart, setTimerStart] = useState(30);
  const [timer, setTimer] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [wpm, setWpm] = useState(0.0);
  const [accuracy, setAccuracy] = useState(0.0);
  const [showTestResults, setShowTestResults] = useState(false);
  const [countErrors, setCountErrors] = useState(0);
  const [countCorrect, setCountCorrect] = useState(0); //count the same letter multiple times
  const [totalCorrectLetters, setTotalCorrectLetters] = useState(0); //count only the first time the player hit the letter correctly
  const [totalIncorrectLetters, setTotalIncorrectLetters] = useState(0); //count only the first time the player hit the letter correctly
  const [totalMissedLetters, setTotalMissedLetters] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const words = generateTestWords(30);
    setCurrentTestWords(words);
  }, []);

  useEffect(() => {
    restartTest();
  }, [timerStart]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        if (isTyping) {
          setTimer((prevTimer) => prevTimer - 1);
        }
      } else {
        // Timer reached 0, finish test
        clearInterval(interval);
        const wordsCompleted = currentTestWords.filter((word) =>
          word.letters.every((letter) => letter.state === 1)
        );
        const totalCorrectLetters = wordsCompleted.reduce(
          (acc, word) => acc + word.letters.length,
          0
        );
        const totalIncorrectLetters = currentTestWords.flatMap((word) =>
          word.letters.filter((letter) => letter.state === 0)
        ).length;
        const totalMissedLetters = currentTestWords.flatMap((word) =>
          word.letters.filter((letter) => letter.state === 2)
        ).length;
        setTotalCorrectLetters(totalCorrectLetters);
        setTotalIncorrectLetters(totalIncorrectLetters);
        setTotalMissedLetters(totalMissedLetters);
        setWpm(getWpm(totalCorrectLetters));
        setAccuracy(getAccuracy());
        setShowTestResults(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTyping]); // Added timer as a dependency

  const getWpm = (totalCorrect: number) => {
    const totalTime = timerStart - timer;
    return (totalCorrect * (60 / totalTime)) / 5;
  };

  const getAccuracy = () => {
    return (countCorrect / (countCorrect + countErrors)) * 100;
  };

  const restartTest = () => {
    const words = generateTestWords(30);
    setCurrentTestWords(words);
    setInput("");
    setCurrentLetterIndex(0);
    setCurrentWordIndex(0);
    setIsTyping(false);
    setTimerStart(timerStart);
    setTimer(timerStart);
    setWpm(0.0);
    setAccuracy(0.0);
    setCountCorrect(0);
    setCountErrors(0);
    setShowTestResults(false);
    inputRef.current?.focus();
  };

  const generateTestWords = (limit: number): Word[] => {
    // Get a set of words for current test
    return words.slice(0, limit).map((word) => {
      const letters: Letter[] = word
        .toLowerCase()
        .split("")
        .map((char) => ({
          char,
          state: undefined,
        }));
      return { letters };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    const typedValue = e.target.value;
    const segments = typedValue.split(" ");

    // Prevent the deletion of previous correctly typed words
    if (segments.length > currentWordIndex) setInput(typedValue);

    setCurrentLetterIndex(
      segments[currentWordIndex] ? segments[currentWordIndex].length : 0
    );

    const currentWord = currentTestWords[currentWordIndex];
    const typedWord = segments[currentWordIndex]
      ? segments[currentWordIndex].toLowerCase().trim()
      : "";

    // Updates letter state based on typed input: 0 - error; 1 - correct; 2 - missed; undefined - unreached letter
    const updatedLetters = currentWord.letters.map((letter, index) => {
      if (typedWord[index] === undefined) {
        return { ...letter, state: undefined };
      } else if (letter.char === typedWord[index]) {
        setCountCorrect(countCorrect + 1);
        return { ...letter, state: 1 };
      } else {
        setCountErrors(countErrors + 1);
        return { ...letter, state: 0 };
      }
    });
    const updatedWord = { ...currentWord, letters: updatedLetters };
    setCurrentTestWords((prevState) =>
      prevState.map((word, index) =>
        index === currentWordIndex ? updatedWord : word
      )
    );

    // Pressing space jumps to next word
    const event = e.nativeEvent as any;
    if (
      typedValue.endsWith(" ") &&
      event.inputType !== "deleteContentBackward"
    ) {
      //set all unreached words as error if player jumps to next word
      setCurrentTestWords((prevState) =>
        prevState.map((word, index) => {
          if (index === currentWordIndex) {
            return {
              ...word,
              letters: word.letters.map((letter) => ({
                ...letter,
                state: letter.state === undefined ? 2 : letter.state,
              })),
            };
          }
          return word;
        })
      );

      //redefining indexes
      setCurrentLetterIndex(0);
      setCurrentWordIndex(currentWordIndex + 1);

      // Scroll to make hidden words visible
      const lastVisibleIndex = Math.min(
        currentWordIndex - 4,
        currentTestWords.length - 1
      );

      wordRefs.current[lastVisibleIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  //handles return to previous incorrectly typed word
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (currentWordIndex > 0 && currentLetterIndex === 0) {
        const previousWord = currentTestWords[currentWordIndex - 1];
        const lastWrongLetter = previousWord.letters.find(
          (l) => !l.state || l.state === 0
        );
        if (previousWord.letters.some((l) => l.state === 0)) {
          setCurrentWordIndex(currentWordIndex - 1);
          setCurrentLetterIndex(previousWord.letters.indexOf(lastWrongLetter!));
        }
      }
    }
  };

  const progress = timer / timerStart;
  return (
    <div className="flex flex-col items-center justify-center mt-56 mx-auto w-[900px]">
      <div className="flex flex-col mb-10 w-full bg-gray-50 rounded-md text-sm text-gray-500 font-semibold">
        <div className="px-5 py-1 flex flex-row items-center justify-between gap-4">
          <p className="">portuguese</p>
          <ul className="flex flex-row items-center gap-6">
            <li>
              <button
                onClick={() => setTimerStart(15)}
                className={`px-2 py-1 ${
                  timerStart === 15 && "text-blue-500 font-bold"
                }`}
              >
                15s
              </button>
            </li>
            <li>
              <button
                onClick={() => setTimerStart(30)}
                className={`px-2 py-1 ${
                  timerStart === 30 && "text-blue-500 font-bold"
                }`}
              >
                30s
              </button>
            </li>
            <li>
              <button
                onClick={() => setTimerStart(60)}
                className={`px-2 py-1 ${
                  timerStart === 60 && "text-blue-500 font-bold"
                }`}
              >
                60s
              </button>
            </li>
          </ul>
          <button
            onClick={restartTest}
            className="self-start border border-gray-300 px-2 py-1 rounded-md"
          >
            <i className="ri-loop-right-line"></i>
          </button>
        </div>
        <div
          className="h-1 bg-blue-500 transition-all duration-1000"
          style={{
            width: `${progress * 100}%`,
          }}
        />
      </div>

      <div
        className="relative h-120 w-full"
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        {showTestResults ? (
          <>
            <div
              className={`px-3 absolute top-0 left-0 w-full h-full z-10 select-none flex flex-col items-start justify-center bg-white transition-opacity duration-150`}
            >
              <div className="flex flex-row gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="text-left font-mono text-lg border border-gray-200 rounded-md w-36 h-32">
                      <p className="px-4 pt-4 text-gray-500 text-sm">wpm</p>
                      <p className="text-center pt-4 text-3xl">
                        {wpm.toFixed(0)}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="Tooltip font-mono z-20 bg-gray-200 p-1 px-3 rounded-md">
                    {wpm.toFixed(2)} wpm
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger className="text-center font-mono">
                    <div className="text-left font-mono text-lg border border-gray-200 rounded-md w-36 h-32">
                      <p className="px-4 pt-4 text-gray-500 text-sm">acc</p>
                      <p className="text-center pt-4 text-3xl">
                        {accuracy.toFixed(0)}%
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="Tooltip font-mono z-20 bg-gray-200 p-1 px-3 rounded-md">
                    {countCorrect} correct / {countErrors} incorrect
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger className="text-center font-mono">
                    <div className="text-left font-mono text-lg border border-gray-200 rounded-md w-36 h-32">
                      <p className="px-4 pt-4 text-gray-500 text-sm">time</p>
                      <p className="text-center pt-4 text-3xl">{timerStart}s</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="Tooltip font-mono z-20 bg-gray-200 p-1 px-3 rounded-md">
                    {timerStart}s
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger className="text-center font-mono">
                    <div className="text-left font-mono text-lg border border-gray-200 rounded-md w-64 h-32">
                      <p className="px-4 pt-4 text-gray-500 text-sm">ratio</p>
                      <p className="text-center pt-4 text-3xl">
                        {totalCorrectLetters} / {totalIncorrectLetters} /{" "}
                        {totalMissedLetters}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="Tooltip font-mono z-20 bg-gray-200 p-1 px-3 rounded-md">
                    correct / incorrect / missed
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`absolute top-0 left-0 w-full h-full z-50 pointer-events-none select-none flex items-center justify-center backdrop-blur-sm transition-opacity duration-150 ${
              isInputFocused ? "opacity-0" : "opacity-100"
            }`}
          >
            <p className="text-center font-mono">Click here to focus</p>
          </div>
        )}
        <div
          className={`overflow-hidden select-none pointer-events-none flex flex-row flex-wrap w-full h-[120px] gap-3 text-2xl ${
            !isInputFocused && "opacity-45"
          } px-3`}
        >
          {currentTestWords.map((word, wIndex) => {
            const isCurrentWord = wIndex === currentWordIndex;
            return (
              <div
                key={wIndex}
                ref={(el) => {
                  wordRefs.current[wIndex] = el;
                }}
                className={`flex text-gray-400`}
              >
                {word.letters.map((letter, lIndex) => {
                  return (
                    <span
                      key={lIndex}
                      className={`font-mono ${
                        isCurrentWord &&
                        lIndex === currentLetterIndex &&
                        isInputFocused &&
                        "border-l animate-[pulse-border_2s_infinite]"
                      } ${
                        isCurrentWord &&
                        lIndex === currentLetterIndex - 1 &&
                        isInputFocused &&
                        "border-r animate-[pulse-border_2s_infinite]"
                      } ${
                        letter.state === 0
                          ? "text-red-500"
                          : letter.state === 1
                          ? "text-black"
                          : "text-gray-400"
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
      </div>

      <input
        ref={inputRef}
        className="opacity-0 cursor-default"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        autoSave="off"
        type="text"
        value={input}
        contentEditable={false}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsInputFocused(false)}
        onFocus={() => setIsInputFocused(true)}
      />
    </div>
  );
}

export default App;
