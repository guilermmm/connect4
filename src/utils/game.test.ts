import { BOARD_HEIGHT, BOARD_WIDTH, createGame, dropToken } from "./game";

const test = () => {
  let game = createGame(BOARD_WIDTH, BOARD_HEIGHT);

  console.log(game);

  let dropResult = dropToken(game, 0);

  if ("err" in dropResult) {
    console.log(0, dropResult.err);
  } else {
    game = dropResult.ok;
  }

  dropResult = dropToken(game, 2);

  if ("err" in dropResult) {
    console.log(2, dropResult.err);
  } else {
    game = dropResult.ok;
  }

  dropResult = dropToken(game, 9);

  if ("err" in dropResult) {
    console.log(9, dropResult.err);
  } else {
    game = dropResult.ok;
  }

  console.log(game);
};

test();
