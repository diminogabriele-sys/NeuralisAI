/** Testi in italiano (lingua principale). */
export default {
  code: 'it',
  htmlLang: 'it',
  ogLocale: 'it_IT',
  label: 'Italiano',

  meta: {
    home: {
      title: 'Orion | Componenti e Carene Moto su Misura',
      description:
        'Carene, appendici aerodinamiche e componenti moto su misura. Moto in edizione limitata con design esclusivo. Dai alla tua moto una nuova identità.',
    },
    thanks: {
      title: 'Richiesta ricevuta | Orion',
      description: 'Grazie per averci contattato. Ti risponderemo entro 24 ore lavorative.',
    },
    privacy: {
      title: 'Privacy e cookie | Orion',
      description: 'Informativa sul trattamento dei dati personali e sull’uso dei cookie del sito Orion.',
    },
    area: {
      title: 'Area clienti | Orion',
      description: 'Segui lo stato del tuo ordine, consulta i documenti e scrivi al nostro team.',
    },
    notFound: {
      title: 'Pagina non trovata | Orion',
      description: 'La pagina che cerchi non esiste o è stata spostata.',
    },
  },

  nav: {
    services: 'Servizi',
    projects: 'Progetti',
    process: 'Metodo',
    about: 'Chi siamo',
    testimonials: 'Recensioni',
    faq: 'FAQ',
    contact: 'Contatti',
    area: 'Area clienti',
    menu: 'Menu',
    close: 'Chiudi menu',
    skip: 'Vai al contenuto',
    language: 'Lingua',
    home: 'Orion, home',
  },

  cta: 'Prenota una consulenza',

  hero: {
    eyebrow: 'Bespoke motorcycle design',
    title: 'We don’t follow the standard.<br/><em>We redefine it.</em>',
    lead:
      'Moto one-off, carene e componenti aerodinamici progettati da zero e realizzati a mano. Ogni progetto nasce dalle tue esigenze e diventa un pezzo unico, irripetibile.',
    secondary: 'Scopri i servizi',
    scroll: 'Scorri',
    specs: ['Moto one-off', 'Edizioni limitate', 'Prototipazione per aziende'],
    canvasLabel: 'Modello 3D interattivo di un’ala aerodinamica in fibra di carbonio con finiture oro',
  },

  services: {
    kicker: 'Servizi',
    title: 'Tre modi per andare <em>oltre la fabbrica</em>',
    lead:
      'Non vendiamo prodotti a catalogo. Progettiamo e costruiamo pezzi unici, per chi guida e per chi produce.',
    items: [
      {
        title: 'Realizzazione moto one-off',
        text:
          'Reinterpretiamo la tua moto da cima a fondo: linee, carene, sovrastrutture e dettagli disegnati da zero. Il risultato è un esemplare unico, con un’identità che appartiene solo a te.',
        spec: 'Progetto completo · Pezzo unico',
        image: 'servizio-carene',
        alt: 'Moto one-off con carene su misura in fibra di carbonio',
      },
      {
        title: 'Componenti estetici e aerodinamici',
        text:
          'Carene personalizzate, winglet, cupolini, codini e appendici aerodinamiche. Ogni componente è progettato sulle quote reali della moto per migliorare stabilità, carico e carattere estetico.',
        spec: 'Carene · Winglet · Appendici',
        image: 'servizio-aero',
        alt: 'Coppia di winglet aerodinamiche montate sul cupolino di una moto',
      },
      {
        title: 'Progettazione prototipale per aziende',
        text:
          'Supportiamo case motociclistiche, preparatori e brand nello sviluppo di prototipi: dal concept alla modellazione 3D, fino a stampi e pezzi funzionali pronti per i test.',
        spec: 'Concept · CAD · Prototipi',
        image: 'servizio-finiture',
        alt: 'Prototipo di componente moto in fase di sviluppo',
      },
    ],
  },

  projects: {
    kicker: 'Progetti',
    title: 'Pezzi <em>unici</em>, storie diverse',
    lead: 'Una selezione dei lavori realizzati. Scegli un progetto dall’elenco per leggerne la storia.',
    indexLabel: 'Elenco progetti',
    prev: 'Progetto precedente',
    next: 'Progetto successivo',
    items: [
      {
        id: 'v4-one-off',
        title: 'Panigale V4 “Nero Oro”',
        category: 'Moto one-off',
        year: '2025',
        text: 'Carenatura completa ridisegnata da zero, codino monoposto e winglet integrate nel cupolino. Carbonio a vista con filetti in foglia oro.',
        image: 'progetto-1',
        alt: 'Ducati Panigale V4 one-off nera e oro',
      },
      {
        id: 'limited-01',
        title: 'Limited Edition 01',
        category: 'Edizione limitata · 25 esemplari',
        year: '2025',
        text: 'La nostra prima serie numerata: un modello naked reinterpretato con serbatoio, fianchetti e cover in composito, ogni esemplare con targhetta numerata.',
        image: 'progetto-2',
        alt: 'Moto naked della Limited Edition 01',
      },
      {
        id: 'r1m-aero',
        title: 'Kit aero R1M',
        category: 'Componenti aerodinamici',
        year: '2024',
        text: 'Winglet a doppio profilo e deviatori laterali progettati per l’uso in pista: più carico all’anteriore e meno impennata in uscita di curva.',
        image: 'progetto-3',
        alt: 'Kit di winglet in carbonio per Yamaha R1M',
      },
      {
        id: 'proto-oem',
        title: 'Prototipo per azienda',
        category: 'Progettazione prototipale',
        year: '2024',
        text: 'Sviluppo di un cupolino sperimentale per un costruttore: modellazione CAD, prototipi in stampa 3D e stampi per i test in galleria del vento. Dettagli coperti da NDA.',
        image: 'progetto-4',
        alt: 'Prototipo di cupolino in fase di test',
      },
      {
        id: 'cafe-racer',
        title: 'Café racer “Officina”',
        category: 'Moto one-off',
        year: '2023',
        text: 'Una classica trasformata in café racer: semicarena, sella e codino su misura, verniciatura in tinta e dettagli in alluminio spazzolato.',
        image: 'progetto-5',
        alt: 'Café racer one-off con semicarena su misura',
      },
    ],
  },

  process: {
    kicker: 'Metodo',
    title: 'Un metodo, <em>tre strade</em>',
    lead: 'Ogni progetto parte dalle stesse tre fasi. Poi prende la strada giusta per il risultato che vuoi ottenere.',
    steps: [
      { title: 'Consulenza', text: 'Ascoltiamo idee, esigenze e utilizzo: strada, pista, collezione o produzione.' },
      { title: 'Progettazione', text: 'Rilievo 3D, modellazione CAD, studio delle forme e scelta dei materiali.' },
      { title: 'Confronto con il cliente', text: 'Render e disegni da approvare insieme. Correggiamo finché il progetto è esattamente come lo volevi.' },
    ],
    branchesLabel: 'Da qui, tre strade',
    branches: [
      {
        title: 'Moto one-off',
        text: 'Smontaggio, realizzazione di stampi e componenti, verniciatura, assemblaggio e collaudo della moto completa.',
      },
      {
        title: 'Componenti estetici e aerodinamici',
        text: 'Produzione dei pezzi nel materiale scelto, finiture, verifica del montaggio e spedizione o installazione.',
      },
      {
        title: 'Prototipazione per aziende',
        text: 'Prototipi funzionali, iterazioni di test, documentazione tecnica e supporto fino alla pre-serie.',
      },
    ],
  },

  about: {
    kicker: 'Chi siamo',
    title: 'Orion: <em>design e componenti su misura</em> per la tua moto',
    claim: 'We don’t follow the standard. We redefine it.',
    paragraphs: [
      'Orion nasce per superare i limiti del design motociclistico tradizionale. Progettiamo componenti moto personalizzati e soluzioni su misura che trasformano ogni moto in un pezzo unico, distintivo e irripetibile.',
      'Uniamo progettazione, ricerca estetica e innovazione tecnica per ridefinire le forme e il carattere delle due ruote.',
    ],
    blocks: [
      {
        title: 'Bespoke Creations – Carene e componenti moto su misura',
        text: 'Progettiamo e realizziamo carene personalizzate, appendici aerodinamiche (winglet) ed elementi sviluppati interamente da zero. Ogni creazione nasce dalle esigenze del cliente e diventa un progetto unico, pensato per distinguersi da qualsiasi altra moto.',
      },
      {
        title: 'Limited Editions – Moto in edizione limitata',
        text: 'Selezioniamo modelli da reinterpretare con la nostra visione progettuale e creiamo moto in edizione limitata: versioni esclusive, con un’identità estetica precisa e una produzione rigorosamente numerata, dove design, esclusività e ricerca tecnica convivono.',
      },
    ],
    closing: 'Orion. Beyond the Ordinary.',
    imageAlt: 'Il laboratorio Orion durante la laminazione di una carena in carbonio',
  },

  testimonials: {
    kicker: 'Recensioni',
    title: 'La parola a <em>chi guida</em>',
    items: [
      {
        quote:
          'Le winglet hanno cambiato l’uscita di curva: la moto resta a terra e posso aprire il gas prima. Lavoro impeccabile, anche nei dettagli che non si vedono.',
        name: 'Nome Cognome',
        bike: 'Ducati Panigale V4 R · Pista',
      },
      {
        quote:
          'Volevo una moto che non somigliasse a nessun’altra. Hanno disegnato una carena da zero partendo da un mio schizzo: il risultato è un pezzo da museo.',
        name: 'Nome Cognome',
        bike: 'BMW R nineT · One-off',
      },
      {
        quote:
          'Abbiamo affidato a loro lo sviluppo di un prototipo: metodo serio, tempi rispettati e una cura del dettaglio che raramente si trova.',
        name: 'Nome Cognome',
        bike: 'Azienda · Prototipazione',
      },
    ],
    prev: 'Recensione precedente',
    next: 'Recensione successiva',
  },

  faq: {
    kicker: 'FAQ',
    title: 'Domande <em>frequenti</em>',
    items: [
      {
        q: 'Quanto costa un progetto su misura?',
        a: 'Non abbiamo un listino perché ogni pezzo è unico: il prezzo dipende da moto, materiali, complessità e finiture. Dopo la consulenza ricevi un preventivo dettagliato e senza impegno.',
      },
      {
        q: 'Quali sono i tempi di realizzazione?',
        a: 'Per componenti e appendici aerodinamiche servono indicativamente da 3 a 8 settimane; una moto one-off richiede di più. Ti comunichiamo una data certa insieme al preventivo.',
      },
      {
        q: 'Come funzionano le edizioni limitate?',
        a: 'Ogni edizione ha un numero di esemplari prestabilito e numerato. Pubblichiamo le nuove serie sui nostri canali social: scrivici per essere avvisato in anticipo.',
      },
      {
        q: 'Lavorate anche per aziende?',
        a: 'Sì. Sviluppiamo prototipi per costruttori, preparatori e brand, anche sotto accordo di riservatezza (NDA).',
      },
      {
        q: 'Le appendici aerodinamiche sono omologate per la strada?',
        a: 'Dipende dal componente e dal Paese. Ti indichiamo in fase di consulenza cosa è utilizzabile su strada e cosa è destinato all’uso esclusivo in pista.',
      },
      {
        q: 'Posso seguire l’avanzamento del mio ordine?',
        a: 'Sì. Con l’area clienti vedi lo stato del tuo ordine, consulti i documenti e scrivi direttamente al team. Ricevi una email a ogni nuovo messaggio.',
      },
    ],
  },

  contact: {
    kicker: 'Contatti',
    title: 'Prenota una <em>consulenza</em>',
    lead:
      'Raccontaci la tua idea o il tuo progetto. Ti rispondiamo entro 24 ore lavorative per fissare la consulenza.',
    form: {
      name: 'Nome e cognome',
      email: 'Email',
      phone: 'Telefono',
      bike: 'Moto o progetto',
      bikePlaceholder: 'Es. Ducati Panigale V4 S 2023',
      service: 'Servizio',
      serviceOptions: ['Moto one-off', 'Componenti estetici e aerodinamici', 'Progettazione prototipale per aziende', 'Edizione limitata', 'Altro'],
      use: 'Utilizzo',
      useOptions: ['Strada', 'Pista', 'Strada e pista', 'Collezione', 'Produzione aziendale'],
      message: 'Descrivi il tuo progetto',
      privacy: 'Ho letto l’<a href="{privacy}">informativa privacy</a> e acconsento al trattamento dei dati per ricevere una risposta.',
      submit: 'Invia la richiesta',
      sending: 'Invio in corso…',
      success: 'Grazie! La tua richiesta è stata inviata. Ti ricontatteremo entro 24 ore lavorative.',
      error: 'Si è verificato un errore. Riprova oppure scrivici direttamente via email.',
      required: 'Campo obbligatorio',
      invalidEmail: 'Inserisci un indirizzo email valido',
      select: 'Seleziona…',
    },
    info: {
      email: 'Email',
      emailNote: 'Rispondiamo entro 24 ore lavorative.',
      social: 'Seguici',
    },
  },

  footer: {
    tagline: 'Orion. Beyond the Ordinary.',
    rights: 'Tutti i diritti riservati.',
    privacy: 'Privacy e cookie',
    team: 'Accesso team',
  },

  thanks: {
    title: 'Richiesta <em>ricevuta</em>',
    text: 'Grazie per averci scritto. Analizzeremo la tua richiesta e ti ricontatteremo entro 24 ore lavorative.',
    back: 'Torna alla home',
  },

  privacy: {
    title: 'Privacy e <em>cookie</em>',
    note: 'Testo segnaposto: sostituire con l’informativa redatta dal proprio consulente legale.',
    sections: [
      {
        h: 'Titolare del trattamento',
        p: 'Il titolare del trattamento è {legal}. Email: {email}.',
      },
      {
        h: 'Dati raccolti e finalità',
        p: 'I dati inviati tramite il modulo di contatto sono utilizzati esclusivamente per rispondere alla richiesta e formulare un preventivo. I dati inseriti nell’area clienti (anagrafica e indirizzo di spedizione) sono utilizzati per gestire e spedire l’ordine.',
      },
      {
        h: 'Cookie e archiviazione locale',
        p: 'Il sito non usa cookie di profilazione né strumenti di terze parti. L’area clienti salva nel browser solo le informazioni tecniche necessarie a mantenere l’accesso.',
      },
      {
        h: 'Diritti dell’interessato',
        p: 'Puoi chiedere in qualsiasi momento l’accesso, la rettifica o la cancellazione dei tuoi dati scrivendo a {email}.',
      },
    ],
  },

  notFound: {
    title: 'Pagina <em>non trovata</em>',
    text: 'La pagina che cerchi non esiste o è stata spostata.',
    back: 'Torna alla home',
  },

  area: {
    kicker: 'Area clienti',
    title: 'Il tuo <em>progetto</em>, passo dopo passo',
    demoNotice: 'Modalità dimostrativa: l’area clienti non è ancora collegata al server. Inserisci un’email qualsiasi per entrare: i dati di esempio restano solo su questo dispositivo e nessuna email viene inviata.',
    notConfigured: 'L’area clienti non è ancora attiva. Torna a trovarci presto.',
    loading: 'Caricamento…',
    error: 'Si è verificato un errore. Riprova tra poco.',
    login: {
      title: 'Accedi',
      text: 'Inserisci l’email che hai usato per il tuo ordine: ti inviamo un link di accesso, senza password.',
      email: 'Email',
      submit: 'Inviami il link',
      sent: 'Fatto. Controlla la posta (anche nello spam) e apri il link che ti abbiamo inviato.',
    },
    logout: 'Esci',
    signedInAs: 'Accesso come',
    profile: {
      title: 'Dati per la spedizione',
      text: 'Prima di continuare completa i tuoi dati: ci servono per la fatturazione e la spedizione dell’ordine.',
      edit: 'Modifica dati di spedizione',
      firstName: 'Nome',
      lastName: 'Cognome',
      company: 'Azienda (facoltativo)',
      taxCode: 'Codice fiscale o P.IVA',
      phone: 'Telefono',
      address: 'Indirizzo e numero civico',
      postalCode: 'CAP',
      city: 'Città',
      province: 'Provincia / Stato',
      country: 'Paese',
      notes: 'Note per il corriere (facoltativo)',
      save: 'Salva i dati',
      saved: 'Dati salvati.',
      cancel: 'Annulla',
    },
    orders: {
      title: 'I tuoi ordini',
      empty: 'Non ci sono ancora ordini associati alla tua email. Appena il team apre il tuo progetto lo troverai qui.',
      code: 'Ordine',
      updated: 'Aggiornato il',
      status: 'Stato',
      tracking: 'Spedizione',
      history: 'Cronologia',
    },
    statuses: {
      consultation: 'Consulenza',
      design: 'Progettazione',
      review: 'Confronto con il cliente',
      production: 'Produzione',
      finishing: 'Finiture e controllo qualità',
      shipping: 'Spedito',
      delivered: 'Consegnato',
    },
    docs: {
      title: 'Documenti',
      empty: 'Nessun documento caricato.',
      upload: 'Carica un file',
      uploading: 'Caricamento…',
      download: 'Scarica',
    },
    chat: {
      title: 'Messaggi',
      empty: 'Nessun messaggio. Scrivi al team per qualsiasi domanda sul tuo progetto.',
      placeholder: 'Scrivi un messaggio…',
      send: 'Invia',
      you: 'Tu',
      team: 'Orion',
      notice: 'Riceverai una email quando il team ti risponde.',
    },
  },
};
