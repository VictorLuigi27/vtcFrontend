import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="bg-zinc-800 text-white flex flex-col items-center py-4 space-y-3 mt-auto lg:text-lg">
      <Link to="/mentionslegales">Mentions légales</Link>
      <p>Conditions générales</p>
      <p>Contact</p>
    </div>
  );
}
