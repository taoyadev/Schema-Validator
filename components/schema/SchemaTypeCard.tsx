import Link from 'next/link';

export interface SchemaTypeCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'text-slate-700 group-hover:text-blue-600',
  green: 'text-slate-700 group-hover:text-emerald-600',
  purple: 'text-slate-700 group-hover:text-purple-600',
  orange: 'text-slate-700 group-hover:text-orange-600',
};

export function SchemaTypeCard({
  title,
  description,
  href,
  icon = '📄',
  color = 'blue',
}: SchemaTypeCardProps) {
  const colorClass = colorClasses[color];

  return (
    <Link
      href={href}
      className="group block p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${colorClass} transition-colors`}>{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
        <svg
          className="w-5 h-5 flex-shrink-0 mt-1 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
