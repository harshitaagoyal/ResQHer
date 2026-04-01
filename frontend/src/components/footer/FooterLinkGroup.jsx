import Link from 'next/link';

export default function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">
        {title}
      </h4>
      <ul className="space-y-4">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link href={link.href} className="text-slate-500 font-bold hover:text-[#ed0b70] transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}