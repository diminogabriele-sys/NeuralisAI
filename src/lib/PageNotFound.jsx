import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-obsidian">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-7xl font-display uppercase text-steel">404</h1>
                        <div className="h-0.5 w-16 bg-steel mx-auto"></div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-titanium">
                            Pagina non trovata
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            La pagina <span className="font-medium text-titanium">"{pageName}"</span> non esiste.
                        </p>
                    </div>

                    <div className="pt-6">
                        <a
                            href="/"
                            className="inline-flex items-center px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-titanium border border-steel hover:border-brabus hover:text-brabus transition-colors"
                        >
                            Torna alla home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
