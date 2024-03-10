import { useEffect, useState } from "react";
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

function App() {
  const [input, setInput] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTestWords, setCurrentTestWords] = useState<Word[]>([]);

  useEffect(() => {
    // Get a set of words for current test
    const list: Word[] = words.slice(0, 30).map((word) => {
      const letters: Letter[] = word
        .toLowerCase()
        .split("")
        .map((char) => ({
          char,
          state: undefined,
        }));
      return { letters };
    });
    setCurrentTestWords(list);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        return { ...letter, state: 1 };
      } else {
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
    <div className="flex flex-col items-center justify-center mt-56 mx-auto max-w-[800px]">
      <button className="self-start mb-6 border border-gray-300 px-2 py-1 rounded-md">
        Restart
      </button>
      <div className="overflow-hidden flex flex-row flex-wrap w-full h-[110px] gap-3 text-xl">
        {currentTestWords.map((word, wIndex) => {
          const isCurrentWord = wIndex === currentWordIndex;
          return (
            <div key={wIndex} className={`flex text-gray-400`}>
              {word.letters.map((letter, lIndex) => {
                return (
                  <span
                    key={lIndex}
                    className={`font-mono ${
                      isCurrentWord &&
                      lIndex === currentLetterIndex &&
                      "border-l animate-[pulse-border_2s_infinite]"
                    } ${
                      isCurrentWord &&
                      lIndex === currentLetterIndex - 1 &&
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
      <input
        className="opacity-0"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        autoSave="off"
        type="text"
        value={input}
        contentEditable={false}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
}

export default App;
