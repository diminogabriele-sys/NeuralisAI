import type { Dict } from './it';

export const en: Dict = {
  lang: 'en',
  locale: 'en_GB',
  langName: 'English',

  meta: {
    homeTitle: 'M&A Washing | Pressure washing in Padua, Italy',
    homeDescription:
      'Professional cleaning of walls, pavers, courtyards, outdoor stairs and curbs in Padua and nearby towns. Free site visit and a quote within 24 hours.',
    blogTitle: 'Blog | Outdoor surface cleaning tips | M&A Washing',
    blogDescription:
      'Practical guides on cleaning and maintaining outdoor paving, walls and shared condominium areas, written by people who do it every day in Padua.',
    thanksTitle: 'Request sent | M&A Washing',
    thanksDescription: 'We have received your quote request. We will get back to you within 24 working hours.',
    privacyTitle: 'Privacy policy | M&A Washing',
    privacyDescription: 'How M&A Washing processes the personal data collected through this website.',
    cookieTitle: 'Cookie policy | M&A Washing',
    cookieDescription: 'Information about cookies and third-party services used on the M&A Washing website.',
    notFoundTitle: 'Page not found | M&A Washing',
  },

  anchors: {
    services: 'services',
    works: 'work',
    about: 'about',
    area: 'area',
    faq: 'faq',
    contact: 'contact',
  },

  nav: {
    services: 'Services',
    works: 'Our work',
    about: 'About',
    faq: 'FAQ',
    blog: 'Blog',
    contact: 'Contact',
    quote: 'Request a quote',
    quoteShort: 'Quote',
    call: 'Call',
    menu: 'Menu',
    close: 'Close menu',
    skip: 'Skip to content',
    home: 'Home',
    switchTo: 'Versione italiana',
    mainNav: 'Main navigation',
  },

  hero: {
    title: 'Outdoor surfaces, clean as new. In Padua and nearby.',
    lead:
      'We pressure wash garden walls, paver driveways, courtyards, outdoor stairs and curbs. Moss, algae and grime come off, the material stays intact.',
    ctaPrimary: 'Request a quote',
    ctaSecondary: 'Call us',
    trust: ['Free site visit', 'Quote within 24 hours', 'Homes and condominiums'],
    imageAltBefore: 'Paver driveway covered in moss and dirt before washing',
    imageAltAfter: 'The same paving after pressure washing',
    before: 'Before',
    after: 'After',
  },

  services: {
    title: 'What we clean',
    intro:
      'Every surface has its own material and its own kind of dirt. That is why we set pressure, nozzles and detergents case by case.',
    more: 'Service details',
    includesTitle: "What's included",
    suitableTitle: 'Who it is for',
    otherServices: 'Other services',
    ctaTitle: 'Want to know the price?',
    ctaText: 'Tell us about the surface to clean: we reply within 24 hours with a quote or a proposed site visit.',
    items: [
      {
        id: 'muretti',
        slug: 'wall-cleaning',
        image: 'servizio-muretti',
        name: 'Walls and fences',
        short: 'Concrete, stone, exposed brick and render. We remove moss, black streaks and city grime.',
        metaTitle: 'Wall and fence cleaning in Padua | M&A Washing',
        metaDescription:
          'Pressure washing of concrete, stone, brick and rendered walls in Padua and the surrounding area. Moss, algae and streaks removed. Free quote.',
        body: [
          'Garden walls are the first thing people see of a house or a condominium. Rain, soil and plants stain them quickly: moss and algae grow at the bottom, dark streaks run down from the copings.',
          'Before washing we check the material. On concrete and stone we use rotary nozzles that clean rough surfaces in depth; on render and softer brick we work at reduced pressure, with specific detergents left to act as long as needed.',
        ],
        includes: [
          'Material check and test on a hidden spot',
          'Removal of moss, algae, lichen and streaks',
          'Cleaning of copings, plinths and pillars',
          'Protection of gates, plants and nearby surfaces',
          'Water-repellent treatment on request',
        ],
        suitable: 'Houses, condominium fences, retaining walls and garden walls.',
      },
      {
        id: 'autobloccanti',
        slug: 'paver-cleaning',
        image: 'servizio-autobloccanti',
        name: 'Pavers and driveways',
        short: 'Concrete pavers, porphyry and driveways. We clean the joints too and re-sand them if needed.',
        metaTitle: 'Paver and driveway cleaning in Padua | M&A Washing',
        metaDescription:
          'Professional cleaning of concrete pavers and porphyry in Padua: clean joints, moss removed, re-sanding and protective sealer on request.',
        body: [
          'Pavers absorb dirt and moisture: over time they turn dark and slippery, and grass and moss grow in the joints. A household pressure washer often leaves stripes and empties the joints unevenly.',
          'We use a rotary surface cleaner that spreads the pressure evenly, then finish edges and corners by hand. If the joints are empty at the end, we refill them with sand to keep the pavers stable.',
        ],
        includes: [
          'Removal of grass and moss from joints',
          'Even washing with a surface cleaner',
          'Reduction of oil and rust stains',
          'Joint re-sanding on request',
          'Anti-stain protective treatment on request',
        ],
        suitable: 'Paths, driveways, parking spaces, private sidewalks and pool surrounds.',
      },
      {
        id: 'cortili',
        slug: 'courtyard-cleaning',
        image: 'servizio-cortili',
        name: 'Courtyards and yards',
        short: 'Condominium courtyards, inner yards and car parks. Even results on large areas, with no stripes.',
        metaTitle: 'Courtyard and yard cleaning in Padua | M&A Washing',
        metaDescription:
          'Pressure washing of condominium courtyards, yards and private car parks in Padua. Work scheduled with the building manager. Free quote.',
        body: [
          'On large surfaces consistency is what matters: a courtyard washed in patches stands out more than even dirt. That is why we use large surface cleaners and work area by area.',
          'For condominiums we plan the job with the building manager: notices for residents, cars moved zone by zone and times that keep disruption low. The quote is itemised and ready for the owners’ meeting.',
        ],
        includes: [
          'Site visit and area measurement',
          'Work plan by zones',
          'Washing of paving, ramps and entrances',
          'Clearing drains and gutters of residue',
          'Itemised quote for the condominium meeting',
        ],
        suitable: 'Condominiums, building managers, inner courtyards, yards and private car parks.',
      },
      {
        id: 'scalinate',
        slug: 'stair-cleaning',
        image: 'servizio-scalinate',
        name: 'Outdoor stairs',
        short: 'Stone, marble and concrete steps. Less algae also means less risk of slipping.',
        metaTitle: 'Outdoor stair cleaning in Padua | M&A Washing',
        metaDescription:
          'Cleaning of stone, marble and concrete outdoor stairs in Padua. Algae and slippery film removed. Free site visit and quote.',
        body: [
          'On outdoor stairs the green film is not only unsightly: when wet it becomes slippery. Regular cleaning makes entrances safer, especially in autumn and winter.',
          'We wash treads, risers and edges one by one, with pressure suited to the material. On soft stone and marble we use gentle detergents and low-pressure water so the stone is not damaged.',
        ],
        includes: [
          'Washing of treads, risers and landings',
          'Cleaning of edges, corners and joints',
          'Removal of slippery algae film',
          'Cleaning of handrails and plinths',
          'Anti-slip or water-repellent treatment on request',
        ],
        suitable: 'House and condominium entrances, garden stairs, steps to shops and offices.',
      },
      {
        id: 'cordoli',
        slug: 'curb-cleaning',
        image: 'servizio-cordoli',
        name: 'Curbs and edging',
        short: 'Flower-bed and sidewalk curbs, plinths and drainage channels. The details that make everything else look clean.',
        metaTitle: 'Curb and edging cleaning in Padua | M&A Washing',
        metaDescription:
          'Cleaning of curbs, edging, plinths and drainage channels in Padua. Precise finishing work, also combined with other washing jobs. Free quote.',
        body: [
          'Curbs and edging collect soil, leaves and standing water: they are the first place dirt builds up and the last one people think about. A blackened curb makes even clean paving look neglected.',
          'We clean them with concentrated-jet lances, taking care not to wash soil and gravel out of the beds. We often combine this with work on paths and courtyards for a complete result.',
        ],
        includes: [
          'Washing of concrete and stone curbs',
          'Cleaning of plinths and wall bases',
          'Cleaning of channels and drain grates',
          'Removal of grass and moss along edges',
          'Hand finishing of hard-to-reach spots',
        ],
        suitable: 'Private gardens, condominium flower beds, private sidewalks and walkways.',
      },
      {
        id: 'alta-pressione',
        slug: 'pressure-washing',
        image: 'servizio-alta-pressione',
        name: 'Other outdoor surfaces',
        short: 'Terraces, balconies, low walls and stone furniture. We assess the right approach together.',
        metaTitle: 'Pressure washing in Padua | M&A Washing',
        metaDescription:
          'Pressure washing for terraces, balconies, walls and other outdoor surfaces in Padua. Free site visit to assess material and method.',
        body: [
          'Not every surface fits a precise category. Terraces, balconies, low walls, planters and stone or concrete garden furniture can be cleaned with the same tools, but each needs its own assessment.',
          'During the site visit we check material, condition, drains and access. If a surface is not suitable for pressure washing we tell you straight away and suggest an alternative.',
        ],
        includes: [
          'Site visit and material assessment',
          'Choice of pressure, nozzles and detergents',
          'Protection of windows, plants and furniture',
          'Drain check at the end of the job',
          'Maintenance advice for the future',
        ],
        suitable: 'Terraces, balconies, low walls, outdoor furniture and small commercial areas.',
      },
    ],
  },

  process: {
    title: 'How we work',
    steps: [
      {
        title: 'Site visit',
        text: 'We come and see the surface, measure it and assess the material and the dirt. The visit is free and without obligation.',
      },
      {
        title: 'Clear quote',
        text: 'Within 24 hours you get a written, itemised quote. You know in advance what we do, what it costs and how long it takes.',
      },
      {
        title: 'Washing and finishing',
        text: 'We wash with professional equipment, finish the details by hand and leave the area clean and tidy.',
      },
    ],
  },

  works: {
    title: 'Our work',
    intro: 'Drag the handle to compare before and after. These images are placeholders for real photos of our jobs.',
    sliderLabel: 'Before and after comparison',
    items: [
      { image: 'lavoro-vialetto', caption: 'Paver driveway', place: 'Albignasego' },
      { image: 'lavoro-muretto', caption: 'Stone wall', place: 'Abano Terme' },
      { image: 'lavoro-scalinata', caption: 'Entrance stairs', place: 'Padua' },
      { image: 'lavoro-cortile', caption: 'Condominium courtyard', place: 'Selvazzano Dentro' },
    ],
  },

  about: {
    title: 'About us',
    paragraphs: [
      'M&A Washing is a young company from Padua that does one thing: bringing outdoor surfaces back to how they looked when they were new.',
      'We chose to specialise instead of doing a bit of everything. We know the materials found in local homes and condominiums, from porphyry to concrete pavers, from Vicenza stone to render, and how to treat them without damage.',
      'We work with homeowners, building managers and small businesses. Whoever calls us always talks to us directly, from the site visit to the end of the job.',
    ],
    points: [
      'Pressure and nozzles chosen for each material',
      'Specific detergents, only where needed',
      'Work area left clean and tidy',
      'One point of contact for the whole job',
    ],
    imageAlt: 'The M&A Washing team at work (placeholder)',
    imagePlaceholder: 'Team photo',
  },

  area: {
    title: 'Where we work',
    text: 'We are based in Padua and work in the city and nearby towns. If you are just outside this area, ask anyway: we consider every request.',
    mapTitle: 'Map of the area served by M&A Washing',
    mapConsent: 'The map is provided by Google and may set third-party cookies.',
    mapLoad: 'Show the map',
    mapOpen: 'Open in Google Maps',
  },

  faq: {
    title: 'Frequently asked questions',
    more: "Can't find the answer you need? Call or message us, we're happy to help.",
    items: [
      {
        q: 'Are the site visit and quote free?',
        a: 'Yes. The site visit in the Padua area and the written quote are free and carry no obligation.',
      },
      {
        q: 'Can pressure washing damage surfaces?',
        a: 'Yes, if done badly. That is why we set pressure, distance and nozzle type for each material and always test on a hidden spot first. On render and soft stone we work at low pressure with specific detergents.',
      },
      {
        q: 'How long does a job take?',
        a: 'It depends on the surface and its condition. A medium-sized private path or courtyard is usually done in one day; for condominiums we agree a schedule by zones. Exact timings are in the quote.',
      },
      {
        q: 'Do you need water and electricity from the property?',
        a: 'Usually we need a water tap and a power socket near the work area. We check this together during the site visit and find a solution if they are not available.',
      },
      {
        q: 'Do you work for condominiums?',
        a: 'Yes. We prepare itemised quotes for building managers and organise the work to keep disruption for residents low, with notices and agreed times.',
      },
      {
        q: 'How often should outdoor surfaces be cleaned?',
        a: 'Usually every one or two years, depending on exposure: shaded, damp areas get dirty sooner. A protective treatment after washing helps the result last longer.',
      },
      {
        q: 'Which areas do you cover?',
        a: 'Padua and nearby towns, including Abano Terme, Albignasego, Cadoneghe, Vigonza, Rubano and Selvazzano Dentro. For other locations, contact us and we will consider it.',
      },
    ],
  },

  contact: {
    title: 'Request a quote',
    intro: 'Fill in the form or call us directly. We reply within 24 working hours.',
    directTitle: 'Direct contacts',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    whatsappLabel: 'Message us on WhatsApp',
    socialTitle: 'Follow us',
    form: {
      name: 'Full name',
      phone: 'Phone',
      email: 'Email',
      city: 'Town',
      service: 'What do you need cleaned?',
      servicePlaceholder: 'Choose a service',
      serviceOther: "Other / I'm not sure",
      message: 'Describe the job',
      messageHint: 'Type of surface, approximate square metres, any photos you can send on WhatsApp.',
      privacy: 'I have read the',
      privacyLink: 'privacy policy',
      privacyAfter: 'and agree to my data being processed to receive a quote.',
      required: 'required',
      optional: 'optional',
      submit: 'Send request',
      sending: 'Sending…',
      errorRequired: 'Please fill in this field.',
      errorPhone: 'Enter a valid phone number.',
      errorEmail: 'Check the email address.',
      errorPrivacy: 'We need your consent to reply.',
      errorSummary: 'Check the highlighted fields.',
      honeypot: 'Do not fill in this field',
    },
  },

  thanks: {
    title: 'Thank you, request received.',
    text: 'We will get back to you within 24 working hours. If you have photos of the surface, send them on WhatsApp: they help us prepare a more accurate quote.',
    back: 'Back to home',
  },

  blog: {
    title: 'Blog',
    intro: 'Practical advice on keeping paths, walls and shared areas clean, from people who do it every day.',
    readMore: 'Read the article',
    published: 'Published on',
    back: 'All articles',
    ctaTitle: 'Got a surface that needs cleaning?',
    ctaText: 'Free site visit in and around Padua, quote within 24 hours.',
  },

  notFound: {
    title: 'This page does not exist.',
    text: 'The link may be wrong or the page may have moved.',
    back: 'Back to home',
  },

  footer: {
    tagline: 'Pressure washing of outdoor surfaces in Padua and the surrounding province.',
    services: 'Services',
    company: 'Company',
    contacts: 'Contact',
    vat: 'VAT no.',
    privacy: 'Privacy policy',
    cookie: 'Cookie policy',
    cookieSettings: 'Cookie preferences',
    rights: 'All rights reserved.',
  },

  cookie: {
    title: 'Cookies and external services',
    text: 'We only use necessary technical cookies. With your consent we also load Google Maps, which may set third-party cookies.',
    accept: 'Accept all',
    reject: 'Necessary only',
    more: 'Cookie policy',
  },

  whatsapp: {
    label: 'Message us on WhatsApp',
    message: 'Hello, I would like a quote for cleaning',
  },

  breadcrumb: 'Breadcrumb',
};
