export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/40 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
