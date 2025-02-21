import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full p-4 bg-gray-900 text-white flex justify-center gap-6">
      <Link href="/" className="hover:underline">Início</Link>
      <Link href="/about" className="hover:underline">Sobre</Link>
    </nav>
  );
}
