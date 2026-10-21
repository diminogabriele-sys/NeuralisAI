/**
 * MODALITÀ DIMOSTRATIVA
 * Si attiva da sola quando Supabase non è configurato (PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY vuoti).
 * Imita le funzioni di Supabase usate dal sito salvando tutto nel browser (localStorage):
 * nessun dato esce dal dispositivo, nessuna email viene inviata.
 * Area clienti e pannello admin aperti in due schede si aggiornano a vicenda.
 */

type Row = Record<string, any>;
type Db = { orders: Row[]; order_events: Row[]; documents: Row[]; messages: Row[]; profiles: Row[]; seq: number };
type Session = { user: { id: string; email: string }; role: 'client' | 'admin' };

const DB_KEY = 'orion-demo-db';
// sessioni separate: il pannello admin e l'area clienti possono restare aperti insieme nello stesso browser
const SESSION_KEY = `orion-demo-session-${typeof location !== 'undefined' && location.pathname.includes('/admin') ? 'admin' : 'client'}`;
const FILES_KEY = 'orion-demo-files';

const now = () => new Date().toISOString();
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const read = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* spazio esaurito o archiviazione bloccata */
  }
};

const emptyDb = (): Db => ({ orders: [], order_events: [], documents: [], messages: [], profiles: [], seq: 0 });
const loadDb = () => read<Db>(DB_KEY, emptyDb());
const saveDb = (db: Db) => write(DB_KEY, db);
const getSession = () => read<Session | null>(SESSION_KEY, null);

function textFile(text: string) {
  return 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
}

/** Crea un ordine di esempio per il cliente, così l'area non è vuota */
function seedOrderFor(db: Db, email: string) {
  db.seq += 1;
  const id = uid();
  const t0 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString();
  const t1 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString();
  db.orders.push({
    id,
    code: `ORN-${new Date().getFullYear()}-${String(db.seq).padStart(3, '0')}`,
    customer_email: email,
    title: 'Progetto di esempio: winglet su misura',
    service: 'Componenti estetici e aerodinamici',
    status: 'design',
    status_note: 'Rilievo 3D completato',
    carrier: null,
    tracking_number: null,
    tracking_url: null,
    created_at: t0,
    updated_at: t1,
  });
  db.order_events.push(
    { id: uid(), order_id: id, status: 'consultation', note: null, created_at: t0 },
    { id: uid(), order_id: id, status: 'design', note: 'Rilievo 3D completato', created_at: t1 }
  );
  const path = `${id}/benvenuto.txt`;
  const files = read<Record<string, string>>(FILES_KEY, {});
  files[path] = textFile('Documento di esempio della modalità dimostrativa di Orion.');
  write(FILES_KEY, files);
  db.documents.push({ id: uid(), order_id: id, name: 'Benvenuto.txt', path, size: 64, from_admin: true, created_at: t0 });
  db.messages.push({
    id: uid(),
    order_id: id,
    from_admin: true,
    body: 'Benvenuto nell’area clienti Orion! Questa è una dimostrazione: prova a scriverci un messaggio o a caricare un file.',
    created_at: t1,
  });
}

/* ---------- query builder (sottoinsieme di quello di Supabase) ---------- */
class Query {
  private filters: [string, unknown][] = [];
  private sort: { col: string; asc: boolean } | null = null;
  private max = Infinity;
  private op: 'select' | 'insert' | 'upsert' | 'update' | 'delete' = 'select';
  private payload: Row | null = null;
  private mode: 'many' | 'single' | 'maybe' = 'many';
  private returning = false;

  constructor(private table: keyof Omit<Db, 'seq'>, private notify: (table: string) => void) {}

  select() { if (this.op !== 'select') this.returning = true; return this; }
  eq(col: string, val: unknown) { this.filters.push([col, val]); return this; }
  order(col: string, opts?: { ascending?: boolean }) { this.sort = { col, asc: opts?.ascending !== false }; return this; }
  limit(n: number) { this.max = n; return this; }
  single() { this.mode = 'single'; return this; }
  maybeSingle() { this.mode = 'maybe'; return this; }
  insert(row: Row) { this.op = 'insert'; this.payload = row; return this; }
  upsert(row: Row) { this.op = 'upsert'; this.payload = row; return this; }
  update(patch: Row) { this.op = 'update'; this.payload = patch; return this; }
  delete() { this.op = 'delete'; return this; }

  /** Regole di visibilità come nel database reale: il cliente vede solo i propri dati */
  private visible(db: Db, s: Session | null): Row[] {
    if (!s) return [];
    const admin = s.role === 'admin';
    const myOrders = new Set(db.orders.filter((o) => admin || o.customer_email === s.user.email).map((o) => o.id));
    switch (this.table) {
      case 'orders': return db.orders.filter((o) => myOrders.has(o.id));
      case 'profiles': return db.profiles.filter((p) => admin || p.id === s.user.id);
      default: return (db[this.table] as Row[]).filter((r) => myOrders.has(r.order_id));
    }
  }

  private run() {
    const db = loadDb();
    const s = getSession();
    const admin = s?.role === 'admin';
    const match = (r: Row) => this.filters.every(([c, v]) => r[c] === v);
    let out: Row[] = [];

    if (this.op === 'select') {
      out = this.visible(db, s).filter(match);
    } else if (this.op === 'insert') {
      const row: Row = { ...this.payload, id: uid(), created_at: now() };
      if (this.table === 'messages' || this.table === 'documents') row.from_admin = admin;
      if (this.table === 'orders') {
        if (!admin) return { data: null, error: { message: 'Solo il team può creare ordini' } };
        db.seq += 1;
        Object.assign(row, {
          code: `ORN-${new Date().getFullYear()}-${String(db.seq).padStart(3, '0')}`,
          status: 'consultation',
          status_note: null,
          updated_at: now(),
        });
        db.order_events.push({ id: uid(), order_id: row.id, status: 'consultation', note: null, created_at: now() });
      }
      (db[this.table] as Row[]).push(row);
      if (this.table === 'messages' || this.table === 'documents') {
        const o = db.orders.find((x) => x.id === row.order_id);
        if (o) o.updated_at = now();
      }
      out = [row];
    } else if (this.op === 'upsert') {
      const list = db[this.table] as Row[];
      const i = list.findIndex((r) => r.id === this.payload!.id);
      const row = { ...(i >= 0 ? list[i] : {}), ...this.payload, email: s?.user.email ?? this.payload!.email };
      if (i >= 0) list[i] = row; else list.push(row);
      out = [row];
    } else if (this.op === 'update') {
      if (this.table === 'orders' && !admin) return { data: null, error: { message: 'Non autorizzato' } };
      for (const r of this.visible(db, s).filter(match)) {
        const before = { status: r.status, note: r.status_note };
        Object.assign(r, this.payload, { updated_at: now() });
        if (this.table === 'orders' && (r.status !== before.status || r.status_note !== before.note)) {
          db.order_events.push({ id: uid(), order_id: r.id, status: r.status, note: r.status_note, created_at: now() });
        }
        out.push(r);
      }
    } else if (this.op === 'delete') {
      if (!admin) return { data: null, error: { message: 'Non autorizzato' } };
      const del = new Set(this.visible(db, s).filter(match).map((r) => r.id));
      (db as any)[this.table] = (db[this.table] as Row[]).filter((r) => !del.has(r.id));
    }

    if (this.op !== 'select') {
      saveDb(db);
      this.notify(this.table);
      if (this.table === 'orders') this.notify('order_events');
    }
    if (this.op !== 'select' && !this.returning && this.mode === 'many') return { data: null, error: null };

    if (this.sort) {
      const { col, asc } = this.sort;
      out = [...out].sort((a, b) => (a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0) * (asc ? 1 : -1));
    }
    out = out.slice(0, this.max);
    if (this.mode === 'single') return out[0] ? { data: out[0], error: null } : { data: null, error: { message: 'Nessun risultato' } };
    if (this.mode === 'maybe') return { data: out[0] ?? null, error: null };
    return { data: out, error: null };
  }

  then<T>(resolve: (v: { data: any; error: any }) => T, reject?: (e: unknown) => T) {
    return new Promise<{ data: any; error: any }>((r) => setTimeout(() => r(this.run()), 120)).then(resolve, reject);
  }
}

/* ---------- client dimostrativo ---------- */
export function createDemoClient() {
  const authListeners = new Set<(event: string, session: Session | null) => void>();
  type Handler = { table: string; fn: () => void };
  const changeHandlers = new Set<Handler>();
  const emitAuth = (event: string) => authListeners.forEach((cb) => cb(event, getSession()));
  /** avvisa chi osserva quella tabella ('*' = tutte, per le modifiche da un'altra scheda) */
  const emitChange = (table = '*') => changeHandlers.forEach((h) => (table === '*' || h.table === table) && h.fn());

  // modifiche fatte in un'altra scheda (es. admin ↔ cliente)
  window.addEventListener('storage', (e) => {
    if (e.key === DB_KEY) emitChange();
    if (e.key === SESSION_KEY) emitAuth(getSession() ? 'SIGNED_IN' : 'SIGNED_OUT');
  });

  return {
    isDemo: true,
    auth: {
      async getSession() { return { data: { session: getSession() }, error: null }; },
      async getUser() { return { data: { user: getSession()?.user ?? null }, error: null }; },
      onAuthStateChange(cb: (event: string, session: Session | null) => void) {
        authListeners.add(cb);
        setTimeout(() => cb('INITIAL_SESSION', getSession()), 0);
        return { data: { subscription: { unsubscribe: () => authListeners.delete(cb) } } };
      },
      async signInWithOtp({ email, options }: { email: string; options?: { emailRedirectTo?: string } }) {
        const role: Session['role'] = options?.emailRedirectTo?.includes('/admin') ? 'admin' : 'client';
        const clean = email.trim().toLowerCase();
        // in demo l'accesso è immediato (nella versione reale arriva un link via email)
        setTimeout(() => {
          const prev = getSession();
          const id = prev?.user.email === clean ? prev.user.id : uid();
          write(SESSION_KEY, { user: { id, email: clean }, role });
          if (role === 'client') {
            const db = loadDb();
            if (!db.orders.some((o) => o.customer_email === clean)) {
              seedOrderFor(db, clean);
              saveDb(db);
            }
          }
          emitAuth('SIGNED_IN');
        }, 1400);
        return { data: {}, error: null };
      },
      async signOut() {
        try { localStorage.removeItem(SESSION_KEY); } catch { /* */ }
        emitAuth('SIGNED_OUT');
        return { error: null };
      },
    },
    from(table: string) {
      return new Query(table as keyof Omit<Db, 'seq'>, emitChange);
    },
    async rpc(name: string) {
      return { data: name === 'is_admin' ? getSession()?.role === 'admin' : null, error: null };
    },
    storage: {
      from() {
        return {
          async upload(path: string, file: File) {
            const dataUrl = await new Promise<string>((res, rej) => {
              const fr = new FileReader();
              fr.onload = () => res(String(fr.result));
              fr.onerror = () => rej(fr.error);
              fr.readAsDataURL(file);
            });
            const files = read<Record<string, string>>(FILES_KEY, {});
            files[path] = dataUrl;
            write(FILES_KEY, files);
            return { data: { path }, error: null };
          },
          async createSignedUrl(path: string) {
            const dataUrl = read<Record<string, string>>(FILES_KEY, {})[path];
            if (!dataUrl) return { data: null, error: { message: 'File non trovato' } };
            const blob = await (await fetch(dataUrl)).blob();
            return { data: { signedUrl: URL.createObjectURL(blob) }, error: null };
          },
          async remove(paths: string[]) {
            const files = read<Record<string, string>>(FILES_KEY, {});
            paths.forEach((p) => delete files[p]);
            write(FILES_KEY, files);
            return { data: null, error: null };
          },
        };
      },
    },
    channel() {
      const mine: Handler[] = [];
      const ch = {
        mine,
        on(_type: string, filter: { table: string }, handler: (p: unknown) => void) {
          const h = { table: filter.table, fn: () => handler({}) };
          mine.push(h);
          changeHandlers.add(h);
          return ch;
        },
        subscribe() { return ch; },
      };
      return ch;
    },
    removeChannel(ch: { mine?: Handler[] }) {
      ch?.mine?.forEach((h) => changeHandlers.delete(h));
    },
  };
}
