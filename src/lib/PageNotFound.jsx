import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 carbon-weave">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    <h1 className="text-7xl font-display text-steel">404</h1>

                    <div className="space-y-3">
                        <h2 className="font-display uppercase text-lg font-medium tracking-[0.01em] text-titanium">
                            Pagina non trovata
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            La pagina <span className="font-medium text-titanium">"{pageName}"</span> non esiste.
                        </p>
                    </div>

                    <div className="pt-6">
                        <a
                            href="/"
                            className="inline-flex items-center px-6 py-3 border border-steel text-titanium font-body text-[12px] uppercase tracking-[0.083em] hover:border-brabus hover:text-brabus transition-colors"
                        >
                            Torna alla home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
