import { Link } from '@inertiajs/inertia-react';

export default function Index({ title }) {
  const koplak = 'anajy';
  return (
    <>
      <h1>My Super Role</h1>
      <h1>{title}</h1>
      <>{koplak}</>
      <hr></hr>
      <Link href='/'>Go to Home Page</Link>
      <hr />
    </>
  );
}
