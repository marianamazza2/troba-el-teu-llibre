import type { Language } from '../types';

const translations: Record<Language, Record<string, string>> = {
  cat: {
    hero_label: 'Sant Jordi 2026',
    hero_title: 'Troba el teu\nLlibre',
    hero_subtitle: 'No saps quin llibre regalar?\nLa intel·ligència artificial t\'ajuda a trobar el regal perfecte.',
    cta_main: 'Troba el teu llibre →',
    previous_results: '📚 Les teves cerques anteriors',
    footer_credit: 'Creat amb codi i IA per',
    footer_cta: 'Necessites una web o app? →',

    q1_title: 'Per a qui és el regal?',
    q1_subtitle: 'Tria la persona especial 🌹',

    q2_title: 'Explica\'ns com és',
    q2_subtitle: 'Com més detalls, millor seran les recomanacions ✨',
    q2_placeholder: 'Li agrada la natura, viatjar per pobles petits, és molt curiosa, li encanten les novel·les de misteri i les històries amb personatges femenins forts...',
    q2_tip_title: '💡 Consells per a millors resultats:',
    q2_tip: 'Descriu la seva personalitat, hobbies, temes que li interessen, o fins i tot pel·lícules i sèries que li agraden.',

    q3_title: 'Quins gèneres li agraden?',
    q3_subtitle: 'Pots triar més d\'un 📚',
    q3_count_one: 'gènere seleccionat',
    q3_count_many: 'gèneres seleccionats',

    q4_title: 'Últim llibre que li va agradar?',
    q4_subtitle: 'Opcional, però ajuda molt! 🎯',
    q4_placeholder: 'Ex: "La sombra del viento", "Sapiens"...',
    q4_skip: 'No ho sé, saltar →',

    q5_title: 'Últims detalls',
    q5_subtitle: 'Quasi ho tenim! 🌹',
    q5_language_label: 'Idioma preferit',
    q5_budget_label: 'Pressupost',
    tant_se_val: 'Tant se val',

    btn_continue: 'Continuar →',
    btn_back: '← Enrere',
    btn_find: 'Troba els llibres! 📚',
    btn_retry: 'Tornar-ho a provar',

    loading_1: 'Buscant entre milers de llibres...',
    loading_2: 'Llegint les teves preferències...',
    loading_3: 'Preparant les recomanacions...',

    results_label: 'Les teves recomanacions',
    results_title: '3 llibres perfectes 📚',
    results_for: 'Per a la teva',
    results_search: 'Buscar en llibreries →',
    results_dedication_btn: 'Generar dedicatòria ✍️',
    results_share_btn: 'Compartir resultats →',

    dedication_title: 'La teva dedicatòria',
    dedication_sub: 'Personalitzada per a',
    dedication_copy: '📋 Copiar text',
    dedication_edit: '✏️ Editar',
    dedication_done: '✓ Fet',
    dedication_copied: '✓ Copiat!',
    dedication_share: 'Compartir tot 🌹',
    dedication_back: '← Tornar als resultats',

    share_title: 'Comparteix-ho!',
    share_subtitle: 'Envia les recomanacions o ajuda a algú més a trobar el seu llibre',
    share_whatsapp: 'Compartir per WhatsApp',
    share_instagram: 'Compartir a Instagram',
    share_copy: 'Copiar enllaç',
    share_copied: '✓ Enllaç copiat!',
    share_instagram_toast: 'Enllaç copiat! Enganxa\'l a la teva story 📸',

    follow_title: 'T\'ha agradat? 🌹',
    follow_subtitle: 'Ajuda\'ns a arribar a més gent',
    follow_instagram: '📷 Segueix-nos a Instagram',
    follow_google: '⭐ Deixa\'ns una ressenya a Google',
    restart: '🔄 Trobar un altre llibre per a algú més',

    error_timeout: 'Uy, ha trigat massa. Torna-ho a provar?',
    error_generic: 'Alguna cosa ha fallat. Torna-ho a provar?',
    error_rate: 'Moltes peticions! Espera uns minuts i torna-ho a provar.',

    shared_cta_title: 'Vols trobar el teu llibre perfecte? 🌹',
    shared_cta_btn: 'Troba el teu llibre →',
  },

  es: {
    hero_label: 'Sant Jordi 2026',
    hero_title: 'Encuentra tu\nLibro',
    hero_subtitle: '¿No sabes qué libro regalar?\nLa inteligencia artificial te ayuda a encontrar el regalo perfecto.',
    cta_main: 'Encuentra tu libro →',
    previous_results: '📚 Tus búsquedas anteriores',
    footer_credit: 'Creado con código real e IA por',
    footer_cta: '¿Necesitas una web o app? →',

    q1_title: '¿Para quién es el regalo?',
    q1_subtitle: 'Elige a la persona especial 🌹',

    q2_title: 'Cuéntanos cómo es',
    q2_subtitle: 'Cuantos más detalles, mejores serán las recomendaciones ✨',
    q2_placeholder: 'Le gusta la naturaleza, viajar por pueblos pequeños, es muy curiosa, le encantan las novelas de misterio y las historias con personajes femeninos fuertes...',
    q2_tip_title: '💡 Consejos para mejores resultados:',
    q2_tip: 'Describe su personalidad, hobbies, temas que le interesan, o incluso películas y series que le gustan.',

    q3_title: '¿Qué géneros le gustan?',
    q3_subtitle: 'Puedes elegir más de uno 📚',
    q3_count_one: 'género seleccionado',
    q3_count_many: 'géneros seleccionados',

    q4_title: '¿Último libro que le gustó?',
    q4_subtitle: 'Opcional, ¡pero ayuda mucho! 🎯',
    q4_placeholder: 'Ej: "La sombra del viento", "Sapiens"...',
    q4_skip: 'No lo sé, saltar →',

    q5_title: 'Últimos detalles',
    q5_subtitle: '¡Ya casi lo tenemos! 🌹',
    q5_language_label: 'Idioma preferido',
    q5_budget_label: 'Presupuesto',
    tant_se_val: 'Da igual',

    btn_continue: 'Continuar →',
    btn_back: '← Atrás',
    btn_find: '¡Encuentra los libros! 📚',
    btn_retry: 'Volver a intentar',

    loading_1: 'Buscando entre miles de libros...',
    loading_2: 'Leyendo tus preferencias...',
    loading_3: 'Preparando las recomendaciones...',

    results_label: 'Tus recomendaciones',
    results_title: '3 libros perfectos 📚',
    results_for: 'Para tu',
    results_search: 'Buscar en librerías →',
    results_dedication_btn: 'Generar dedicatoria ✍️',
    results_share_btn: 'Compartir resultados →',

    dedication_title: 'Tu dedicatoria',
    dedication_sub: 'Personalizada para',
    dedication_copy: '📋 Copiar texto',
    dedication_edit: '✏️ Editar',
    dedication_done: '✓ Hecho',
    dedication_copied: '✓ ¡Copiado!',
    dedication_share: 'Compartir todo 🌹',
    dedication_back: '← Volver a resultados',

    share_title: '¡Compártelo!',
    share_subtitle: 'Envía las recomendaciones o ayuda a alguien más a encontrar su libro',
    share_whatsapp: 'Compartir por WhatsApp',
    share_instagram: 'Compartir en Instagram',
    share_copy: 'Copiar enlace',
    share_copied: '✓ ¡Enlace copiado!',
    share_instagram_toast: '¡Enlace copiado! Pégalo en tu story 📸',

    follow_title: '¿Te ha gustado? 🌹',
    follow_subtitle: 'Ayúdanos a llegar a más gente',
    follow_instagram: '📷 Síguenos en Instagram',
    follow_google: '⭐ Déjanos una reseña en Google',
    restart: '🔄 Encontrar otro libro para alguien más',

    error_timeout: 'Uy, ha tardado demasiado. ¿Volver a intentar?',
    error_generic: 'Algo ha fallado. ¿Volver a intentar?',
    error_rate: '¡Muchas peticiones! Espera unos minutos e inténtalo de nuevo.',

    shared_cta_title: '¿Quieres encontrar tu libro perfecto? 🌹',
    shared_cta_btn: 'Encuentra tu libro →',
  },

  en: {
    hero_label: 'Sant Jordi 2026',
    hero_title: 'Find your\nBook',
    hero_subtitle: 'Don\'t know what book to give?\nAI helps you find the perfect gift for Sant Jordi.',
    cta_main: 'Find your book →',
    previous_results: '📚 Your previous searches',
    footer_credit: 'Built with real code & AI by',
    footer_cta: 'Need a web or app? →',

    q1_title: 'Who is it for?',
    q1_subtitle: 'Choose the special person 🌹',

    q2_title: 'Tell us about them',
    q2_subtitle: 'The more details, the better the recommendations ✨',
    q2_placeholder: 'They love nature, traveling to small towns, are very curious, love mystery novels and stories with strong female characters...',
    q2_tip_title: '💡 Tips for better results:',
    q2_tip: 'Describe their personality, hobbies, topics they\'re into, or even movies and shows they like.',

    q3_title: 'What genres do they like?',
    q3_subtitle: 'You can pick more than one 📚',
    q3_count_one: 'genre selected',
    q3_count_many: 'genres selected',

    q4_title: 'Last book they enjoyed?',
    q4_subtitle: 'Optional, but really helps! 🎯',
    q4_placeholder: 'E.g. "The Shadow of the Wind", "Sapiens"...',
    q4_skip: 'I don\'t know, skip →',

    q5_title: 'Last details',
    q5_subtitle: 'Almost there! 🌹',
    q5_language_label: 'Preferred language',
    q5_budget_label: 'Budget',
    tant_se_val: 'Any',

    btn_continue: 'Continue →',
    btn_back: '← Back',
    btn_find: 'Find the books! 📚',
    btn_retry: 'Try again',

    loading_1: 'Searching through thousands of books...',
    loading_2: 'Reading your preferences...',
    loading_3: 'Preparing recommendations...',

    results_label: 'Your recommendations',
    results_title: '3 perfect books 📚',
    results_for: 'For your',
    results_search: 'Search in bookstores →',
    results_dedication_btn: 'Generate dedication ✍️',
    results_share_btn: 'Share results →',

    dedication_title: 'Your dedication',
    dedication_sub: 'Personalized for',
    dedication_copy: '📋 Copy text',
    dedication_edit: '✏️ Edit',
    dedication_done: '✓ Done',
    dedication_copied: '✓ Copied!',
    dedication_share: 'Share everything 🌹',
    dedication_back: '← Back to results',

    share_title: 'Share it!',
    share_subtitle: 'Send the recommendations or help someone else find their book',
    share_whatsapp: 'Share via WhatsApp',
    share_instagram: 'Share on Instagram',
    share_copy: 'Copy link',
    share_copied: '✓ Link copied!',
    share_instagram_toast: 'Link copied! Paste it in your story 📸',

    follow_title: 'Did you like it? 🌹',
    follow_subtitle: 'Help us reach more people',
    follow_instagram: '📷 Follow us on Instagram',
    follow_google: '⭐ Leave us a review on Google',
    restart: '🔄 Find another book for someone else',

    error_timeout: 'Oops, that took too long. Try again?',
    error_generic: 'Something went wrong. Try again?',
    error_rate: 'Too many requests! Wait a few minutes and try again.',

    shared_cta_title: 'Want to find your perfect book? 🌹',
    shared_cta_btn: 'Find your book →',
  },
};

export default translations;
