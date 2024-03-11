export interface Word {
  letters: Letter[];
}

export interface Letter {
  char: string;
  state?: number; // 0 - error; 1 - correct; 2 - missed; undefined - unreached letter
}
