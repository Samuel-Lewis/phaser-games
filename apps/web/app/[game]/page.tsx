'use client';

import { useEffect, useState } from 'react';

import { games } from '../../games';

import styles from './page.module.css';

const TARGET_ID = 'phaser-game';

export default function Page({
  params,
}: {
  params: { game: string };
}): JSX.Element {
  const [gameName, setGameName] = useState<string>();

  useEffect(() => {
    // Find slug in games
    const gameFactory = games.find((game) => game.slug === params.game);
    setGameName(gameFactory?.name);

    if (!gameFactory) {
      return;
    }

    const game = gameFactory.instance(TARGET_ID);
    return () => {
      game.destroy(true);
    };
  }, [params.game]);

  return (
    <>
      <h1>{gameName}</h1>
      <a href="/">Back</a>
      <div className={styles.canvas} id={TARGET_ID} />
    </>
  );
}
