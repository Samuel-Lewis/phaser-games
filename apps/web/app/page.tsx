const games = [
  {
    name: "Waves",
    slug: "waves",
  },
  {
    name: "Network",
    slug: "network",
  },
  {
    name: "Game Template",
    slug: "template",
  },
];

export default function Page(): JSX.Element {
  return (
    <>
      <h1>Game Index</h1>
      <ul>
        {games.map((game) => (
          <li key={game.slug}>
            <a href={`/${game.slug}`}>{game.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
