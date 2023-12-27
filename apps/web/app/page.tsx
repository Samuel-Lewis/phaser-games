"use client";

import { useEffect } from "react";

import { ExampleGame } from "@samuel-lewis/game-template";

import styles from "./page.module.css";

const TARGET_ID = "phaser-game";

export default function Page(): JSX.Element {
  useEffect(() => {
    const game = ExampleGame.instance(TARGET_ID);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <main className={styles.main}>
      <h1>{ExampleGame.name}</h1>
      <div className={styles.canvas} id={TARGET_ID} />
    </main>
  );
}
