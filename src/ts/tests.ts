import { Letter, Word } from "../models/word";
import { Wordset, wordsets } from "../models/wordset";

const DEFAULT_LIMIT = 100;

export const getWpm = (start: number, left: number, totalCorrect: number) => {
  const totalTime = start - left;
  return (totalCorrect * (60 / totalTime)) / 5;
};

export const getAccuracy = (correct: number, errors: number) => {
  return (correct / (correct + errors)) * 100;
};

export const getTotalLettersByState = (words: Word[], state: number) => {
  return words.flatMap((word) =>
    word.letters.filter((letter) => letter.state === state)
  ).length;
};

export const generateTestWords = async (
  languageIndex: number
): Promise<Word[]> => {
  // Get a set of words for the current test
  const currentLanguage = wordsets[languageIndex];
  const wordset = (await import(
    `../static/languages/${currentLanguage}.json`
  )) as Wordset;

  // Shuffle the array of words
  const shuffledWords: string[] = shuffle(wordset.words);

  // Return a set of random words for the current test
  return shuffledWords.slice(0, DEFAULT_LIMIT).map((word) => {
    const letters: Letter[] = word
      .toLowerCase()
      .split("")
      .map((char) => ({
        char,
        state: undefined,
      }));
    return { letters } as Word;
  });
};

// Function to shuffle an array
const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
