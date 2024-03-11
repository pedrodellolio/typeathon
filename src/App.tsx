import { useEffect, useRef, useState } from "react";
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
  state?: number;
}

const TIMER_VALUE = 10;
const BASE_POINTS = 6;
function App() {
  const [input, setInput] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTestWords, setCurrentTestWords] = useState<Word[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState(TIMER_VALUE);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [wpm, setWpm] = useState(0.0);
  const [accuracy, setAccuracy] = useState(0.0);
  const [showTestResults, setShowTestResults] = useState(false);
  const [countErrors, setCountErrors] = useState(0);
  const [countCorrect, setCountCorrect] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const words = generateTestWords(30);
    setCurrentTestWords(words);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        if (isTyping) setTimer((prevTimer) => prevTimer - 1);
      } else {
        // Timer reached 0, reset test
        clearInterval(interval);
        const wordsCompleted = currentTestWords.filter((word) =>
          word.letters.every((letter) => letter.state === 1)
        );
        // setWpm(getWpm(wordsCompleted));
        setAccuracy(getAccuracy());
        setShowTestResults(true);
        // restartTest();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTyping]); // Added timer as a dependency

  const getWpm = (completed: Word[]) => {
    // const totalTime = TIMER_VALUE - timer;
    // const totalLetters = completed.reduce(
    //   (acc, word) => acc + word.letters.length,
    //   0
    // );
    // const letterPoints = {
    //   1: BASE_POINTS * 0.33,
    //   2: BASE_POINTS * 0.66,
    //   3: BASE_POINTS * 0.99,
    //   4: BASE_POINTS * 1,
    //   5: BASE_POINTS * 1.65,
    //   6: BASE_POINTS * 1.98,
    //   7: BASE_POINTS * 2.31,
    //   8: BASE_POINTS * 2.64,
    //   9: BASE_POINTS * 2.97,
    // };
    // let totalPoints = 0;
    // completed.forEach((word) => {
    //   word.letters.forEach((letter) => {
    //     if (letter.state === 1) {
    //       totalPoints += letterPoints[letter.char.length];
    //     }
    //   });
    // });
    // return (totalLetters * 60) / (totalTime * totalPoints);
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
    setTimer(TIMER_VALUE);
    setWpm(0.0);
    setAccuracy(0.0);
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

    // Updates letter state based on typed input: 0 - error; 1 - correct; undefined - unreached letter
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
                state: letter.state === undefined ? 0 : letter.state,
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

  return (
    <div className="flex flex-col items-center justify-center mt-56 mx-auto max-w-[900px]">
      <div className="px-3 flex flex-row items-center justify-start gap-4 w-full mb-6">
        <button
          onClick={restartTest}
          className="self-start border border-gray-300 px-2 py-1 rounded-md"
        >
          Restart
        </button>
        <span className="text-lg font-semibold text-gray-500">{timer}s</span>
      </div>

      <div
        className="relative h-120 w-full"
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        {showTestResults ? (
          <div
            className={`absolute top-0 left-0 w-full h-full z-50 pointer-events-none select-none flex flex-col items-start justify-center bg-white transition-opacity duration-150`}
          >
            <p className="text-center font-mono">WPM: {wpm}</p>
            <div className="flex flex-row gap-4">
              <p className="text-center font-mono">
                Accuracy: {accuracy.toFixed(0)}%
              </p>
              <p className="text-center font-mono">
                {countCorrect} / {countErrors}
              </p>
            </div>
          </div>
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
