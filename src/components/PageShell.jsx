import '../styles/page.css'

// Базовая обёртка любой страницы книги: фон, текстура, виньетка
export function PageShell({ children, className = '' }) {
  return (
    <div className={`page ${className}`}>
      {/* ::before — зерно бумаги, ::after — виньетка (в page.css) */}
      <div className="page__inner">
        {children}
      </div>
    </div>
  )
}
