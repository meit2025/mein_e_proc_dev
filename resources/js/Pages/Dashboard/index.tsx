export default function Index({ title }: {
  title: string
}) {
  const koplak = 'anajy';
  return (
    <>
      <h1>My Super Blog</h1>
      <h1>{title}</h1>
      <>{koplak}</>
      <hr />
    </>
  );
}
