import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/quiz', label: 'Quiz', icon: 'quiz' },
    { href: '/flashcards', label: 'Flashcards', icon: 'cards' },
    { href: '/stats', label: 'Stats', icon: 'stats' },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.5 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 6.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 18.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'cards':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            <path d="M7 3v18" strokeWidth={2} />
            <path d="M12 3v18" strokeWidth={2} />
            <path d="M17 3v18" strokeWidth={2} />
          </svg>
        );
      case 'stats':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <svg className="h-8 w-8 text-pink-500" fill="currentColor" viewBox="0 0 48 48">
          <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" />
        </svg>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">LinguaLeap</h1>
      </div>
      <nav className="flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-pink-500 text-white'
                  : 'border border-pink-200 bg-white text-gray-700 hover:bg-pink-50'
              }`}
            >
              {getIcon(item.icon)}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
