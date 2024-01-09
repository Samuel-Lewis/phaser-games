const games = [
  {
    name: 'Simon Says',
    slug: 'simon-says',
  },
  {
    name: 'Waves',
    slug: 'waves',
  },
  {
    name: 'Network',
    slug: 'network',
  },
  {
    name: 'Game Template',
    slug: 'template',
  },
];

export default function Page(): JSX.Element {
  return (
    <>
      <h1 style={{ fontFamily: 'pixel, Comic Sans, Times' }}>Game Index</h1>
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
