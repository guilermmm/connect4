import Result from "../types/Result";

export const GameError = {
  GameOver: "GameOver",
  InvalidCol: "InvalidCol",
  FullCol: "FullCol",
  NotYourTurn: "NotYourTurn",
} as const;

export type GameError = typeof GameError[keyof typeof GameError];

export const Token = {
  Empty: "Empty",
  Red: "Red",
  Green: "Green",
} as const;

export type Token = typeof Token[keyof typeof Token];

export type Board = Token[][];

export type TokenQueue = Token[];

export type GameState =
  | { status: "Playing"; turnQueue: TokenQueue }
  | { status: "Draw" }
  | { status: "Won"; winner: Token };

export type Game = {
  board: Board;
  state: GameState;
};

export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 6;

export const createQueue = (firstToken: Token): TokenQueue => {
  const queue: TokenQueue = [];

  queue.push(firstToken);
  queue.push(firstToken === Token.Red ? Token.Green : Token.Red);

  return queue;
};

export const createGame = (
  width: number = BOARD_WIDTH,
  height: number = BOARD_HEIGHT,
  firstTurn: Token = Token.Red
): Game => {
  const board: Board = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Token.Empty)
  );

  const turnQueue = createQueue(firstTurn);

  const state = getGameState(board, turnQueue);

  return {
    board,
    state,
  };
};

export const getGameState = (
  board: Board,
  turnQueue: TokenQueue
): GameState => {
  const winner = getWinner(board);

  if (winner !== Token.Empty) {
    return { status: "Won", winner };
  }

  if (isBoardFull(board)) {
    return { status: "Draw" };
  }

  return { status: "Playing", turnQueue };
};

// Copilot generated this function, I have no idea if it works
export const getWinner = (board: Board): Token => {
  const height = board.length;
  const width = (board[0] as Token[]).length;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const token = (board[row] as Token[])[col] as Token;

      if (token === Token.Empty) {
        continue;
      }

      const right = col + 3 < width;
      const down = row + 3 < height;

      if (right) {
        if (
          (board[row] as Token[])[col + 1] === token &&
          (board[row] as Token[])[col + 2] === token &&
          (board[row] as Token[])[col + 3] === token
        ) {
          return token;
        }
      }

      if (down) {
        if (
          (board[row + 1] as Token[])[col] === token &&
          (board[row + 2] as Token[])[col] === token &&
          (board[row + 3] as Token[])[col] === token
        ) {
          return token;
        }
      }

      if (right && down) {
        if (
          (board[row + 1] as Token[])[col + 1] === token &&
          (board[row + 2] as Token[])[col + 2] === token &&
          (board[row + 3] as Token[])[col + 3] === token
        ) {
          return token;
        }
      }

      if (right && row >= 3) {
        if (
          (board[row - 1] as Token[])[col + 1] === token &&
          (board[row - 2] as Token[])[col + 2] === token &&
          (board[row - 3] as Token[])[col + 3] === token
        ) {
          return token;
        }
      }
    }
  }

  return Token.Empty;
};

export const isBoardFull = (board: Board): boolean => {
  return board.every((row) => row.every((token) => token !== Token.Empty));
};

export const dropToken = (game: Game, col: number): Result<Game, GameError> => {
  const { board, state } = game;

  if (state.status !== "Playing") {
    return Result.err<Game, GameError>(GameError.GameOver);
  }

  if (col < 0 || col >= (board[0] as Token[]).length) {
    return Result.err<Game, GameError>(GameError.InvalidCol);
  }

  const turnQueue = state.turnQueue;

  const [droppedToken, newTurnQueue] = cycleTurnQueue(turnQueue);

  const rowIndex = board.findIndex((row) => row[col] === Token.Empty);

  if (rowIndex === -1) {
    return Result.err<Game, GameError>(GameError.FullCol);
  }

  const newBoard = board.map((row, i) => {
    if (i !== rowIndex) {
      return row;
    }

    return row.map((token, j) => {
      if (j !== col) {
        return token;
      }

      return droppedToken;
    });
  });

  const newState = getGameState(newBoard, newTurnQueue);

  return Result.ok({ board: newBoard, state: newState });
};

export const playTurn = (
  game: Game,
  col: number,
  token: Token
): Result<Game, GameError> => {
  const { state } = game;

  if (state.status !== "Playing") {
    return Result.err<Game, GameError>(GameError.GameOver);
  }

  if (state.turnQueue[0] !== token) {
    return Result.err<Game, GameError>(GameError.NotYourTurn);
  }

  return dropToken(game, col);
};

export const cycleTurnQueue = (turnQueue: TokenQueue): [Token, TokenQueue] => {
  const [first, ...rest] = turnQueue;
  return [first, [...rest, first]] as [Token, TokenQueue];
};
