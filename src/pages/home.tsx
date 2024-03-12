import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { generateTestWords, getTotalLettersByState } from "../ts/tests";
import Backdrop from "../components/Backdrop";
import Results from "../components/Results";
import { Word } from "../models/word";
import Toolbar from "../components/Toolbar";
import Display from "../components/Display";

function Home() {
  const [searchParams, _] = useSearchParams();

  const [input, setInput] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTestWords, setCurrentTestWords] = useState<Word[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  const [countErrors, setCountErrors] = useState(0);
  const [countCorrect, setCountCorrect] = useState(0); //count the same letter multiple times
  const [totalCorrectLetters, setTotalCorrectLetters] = useState(0); //count only the first time the player hit the letter correctly
  const [totalIncorrectLetters, setTotalIncorrectLetters] = useState(0); //count only the first time the player hit the letter correctly
  const [totalMissedLetters, setTotalMissedLetters] = useState(0);
  const [totalCorrectWords, setTotalCorrectWords] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);

  const timerStart = searchParams.get("start") ?? "30";
  const language = searchParams.get("lang") ?? "0";

  useEffect(() => {
    generateTestWords(parseInt(language)).then((wordset) => {
      setCurrentTestWords(wordset);
    });
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
        ).length;
        const totalCorrectLetters = getTotalLettersByState(currentTestWords, 1);
        const totalMissedLetters = getTotalLettersByState(currentTestWords, 2);
        const totalMistypedLetters = getTotalLettersByState(
          currentTestWords,
          0
        );
        setTotalCorrectWords(wordsCompleted);
        setTotalCorrectLetters(totalCorrectLetters);
        setTotalIncorrectLetters(totalMistypedLetters);
        setTotalMissedLetters(totalMissedLetters);
        setShowTestResults(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTyping]);

  const restartTest = () => {
    generateTestWords(parseInt(language)).then((wordset) => {
      setCurrentTestWords(wordset);
    });
    setInput("");
    setCurrentLetterIndex(0);
    setCurrentWordIndex(0);
    setIsTyping(false);
    setTimer(parseInt(timerStart));
    setCountCorrect(0);
    setCountErrors(0);
    setShowTestResults(false);
    inputRef.current?.focus();
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //handles return to previous incorrectly typed word
    if (event.key === "Backspace") {
      if (currentWordIndex > 0 && currentLetterIndex === 0) {
        const previousWord = currentTestWords[currentWordIndex - 1];
        const lastWrongLetter = previousWord.letters.find(
          (l) => !l.state || l.state === 0
        );
        if (previousWord.letters.some((l) => l.state === 0 || l.state === 2)) {
          setCurrentWordIndex(currentWordIndex - 1);
          setCurrentLetterIndex(previousWord.letters.indexOf(lastWrongLetter!));
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-56 mx-auto w-[900px]">
      <Toolbar left={timer} restartTest={restartTest} />
      <div
        className="relative h-120 w-full"
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        {showTestResults ? (
          <Results
            start={parseInt(timerStart)}
            left={timer}
            totalCorrectWords={totalCorrectWords}
            totalCorrect={countCorrect}
            totalErrors={countErrors}
            uniqueCorrectLetters={totalCorrectLetters}
            uniqueMistypedLetters={totalIncorrectLetters}
            uniqueMissedLetters={totalMissedLetters}
          />
        ) : (
          <Backdrop isInputFocused={isInputFocused} />
        )}

        <Display
          wordRefs={wordRefs}
          words={currentTestWords}
          currentWordIndex={currentWordIndex}
          currentLetterIndex={currentLetterIndex}
          isInputFocused={isInputFocused}
        />
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

export default Home;
