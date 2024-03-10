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
    setInput(typedValue);

    const currentWord = currentTestWords[currentWordIndex];
    const typedWord = typedValue.toLowerCase().trim();

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

    setCurrentLetterIndex(typedValue.length);

    if (typedValue.endsWith(" ")) {
      setInput("");
      setCurrentLetterIndex(0);
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  console.log(currentTestWords[currentWordIndex]);

  return (
    <div className="flex flex-col items-center justify-center mt-56">
      <div className="overflow-hidden flex flex-row flex-wrap w-[800px] h-[110px] gap-3 text-xl">
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
        onChange={handleInputChange}
        autoFocus
      />
    </div>
  );
}

export default App;
