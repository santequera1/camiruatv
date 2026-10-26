/**
 * Contenido del portafolio. Por ahora vive aquí (no hay API ni CMS): lo que
 * Camila mande nuevo se agrega en este archivo. Fuentes: info.md, la cubierta
 * del libro y la revista Sofoco (edición 02).
 */

export const CAMILA = {
  nombre: "Camila Andrea Rua Tovio",
  nombreCorto: "Camila Rua Tovio",
  usuario: "camiruatv",
  rol: "Periodista e investigadora de las modas y el vestir",
  lema: "Información y pensamiento crítico cultural",
  ciudad: "Colombia",
  instagram: "https://www.instagram.com/camiruatv/",
  linktree: "https://linktr.ee/Facteda",
  correo: "camilaruatovio@gmail.com",
  /** Factedá: su proyecto de divulgación (Linktree, Instagram, TikTok, Pinterest). */
  facteda: {
    nombre: "Factedá",
    lema: "Pienso e informo sobre las modas, el vestir y la sostenibilidad",
    instagram: "https://instagram.com/kmy_and_rt",
    tiktok: "https://tiktok.com/@kmy_and_rt",
    pinterest: "https://pinterest.com/kmy_and_rt",
  },
  presentacion: [
    "Soy periodista e investigadora de las modas y el vestir. Mi trabajo explora la relación entre la sociedad, la cultura y las historias que en ellas habitan a través de la creación de contenido y la escritura. He colaborado con medios y organizaciones digitales como El Bolivarense, Melodrama.mx y la Fundación Entre Soles y Lunas.",
    "Mi formación en periodismo, publicidad y sociología me ha permitido analizar y narrar la realidad de manera rigurosa, atractiva y crítica. Más allá de mi desempeño en comunicación digital y periodismo, mi labor académica me hizo acreedora de un estímulo del Ministerio de las Culturas para publicar mi investigación enfocada en género, moda y subculturas.",
  ],
  /** De la solapa del libro. */
  trayectoria: [
    { titulo: "Magíster en Sociología", detalle: "Universidad de Antioquia" },
    { titulo: "Periodista y publicista", detalle: "Más de cinco años investigando la moda y el vestir desde ambas disciplinas" },
    { titulo: "Mención de Honor a la Excelencia Periodística", detalle: "Círculo de Periodistas y Comunicadores Sociales de Antioquia (CIPA), por una publicación coautorada" },
    { titulo: "Pasantía de investigación", detalle: "Grupo Cuerpo, Arte y Moda · Universidad de Buenos Aires" },
    { titulo: "Ponente", detalle: "XIV Congreso Nacional de Sociología" },
    { titulo: "Estímulo del Ministerio de las Culturas, las Artes y los Saberes", detalle: "Para publicar su investigación de maestría sobre género, moda y subculturas" },
  ],
  medios: ["El Bolivarense", "Melodrama.mx", "Universo MOLA", "Fundación Entre Soles y Lunas", "Sofoco Revista"],
};

export const LIBRO = {
  titulo: "Desvistiendo otros estilos",
  subtitulo: "Performatividades de género, hipismo, moda y vestir en Medellín (1967⁠–⁠1975)",
  estado: "Próximamente",
  editorial: "Fondo Editorial Remington",
  apoyo: "Ministerio de las Culturas, las Artes y los Saberes",
  /** Texto de la contraportada. */
  sinopsis: [
    "Entre finales de los años 60 y comienzos de los 70, el mundo se transformó y las juventudes se pusieron en el centro del debate social, político y cultural. En Medellín, capital textil de Colombia, esos cambios se vistieron, se bordaron y se discutieron: la ciudad vivía una tensión entre la modernidad, la moral y los valores católicos, entre la promesa de progreso de Coltejer y Fabricato y la llegada de nuevas formas de vida.",
    "Este libro analiza cómo la moda y el vestir configuraron el género y las relaciones interpersonales en la sociedad antioqueña entre 1967 y 1975. Desde los discursos de la industria, el Gobierno local y la cultura paisa hasta las prácticas de las subculturas, en especial el movimiento hippie, la investigación revela cómo los cuerpos y los estilos agrietaron la matriz heterosexual y el ethos antioqueño, y permite comprender las complejidades de una ciudad en transformación.",
  ],
  temas: ["Género", "Hipismo", "Moda y vestir", "Medellín", "1967–1975", "Subculturas", "Archivo"],
};

/**
 * Brújula. Las imágenes son de prueba hasta que Camila mande las suyas: se
 * ponen en contenido/brujula/ y se corre `node scripts/brujula.mjs`, que las
 * deja en public/brujula/ con estos nombres. Sin imagen, el nombre va solo.
 */
export type NombreBrujula = { nombre: string; imagen?: string };

export const FAVORITOS: { etiqueta: string; valor: NombreBrujula[] }[] = [
  { etiqueta: "Primera diseñadora de la que me enamoré", valor: [{ nombre: "Elsa Schiaparelli", imagen: "/brujula/schiaparelli.webp" }] },
  {
    etiqueta: "Diseño de autor colombiano",
    valor: [{ nombre: "La Petite Mort", imagen: "/brujula/la-petite-mort.webp" }, { nombre: "Heroica" }],
  },
  {
    etiqueta: "Autoras",
    valor: [
      { nombre: "Marvel Moreno", imagen: "/brujula/marvel-moreno.webp" },
      { nombre: "Idea Vilariño", imagen: "/brujula/idea-vilarino.webp" },
    ],
  },
  {
    etiqueta: "Teóricos",
    valor: [
      { nombre: "Judith Butler", imagen: "/brujula/judith-butler.webp" },
      { nombre: "Joanne Entwistle", imagen: "/brujula/joanne-entwistle.webp" },
      { nombre: "Michel Foucault", imagen: "/brujula/michel-foucault.webp" },
    ],
  },
  { etiqueta: "Accesorio", valor: [{ nombre: "Pañoletas", imagen: "/brujula/panoletas.webp" }] },
  {
    etiqueta: "Lugar",
    valor: [
      {
        nombre: "Los archivos, en especial el Archivo Histórico de Medellín",
        imagen: "/brujula/archivo-historico-medellin.webp",
      },
    ],
  },
];

export type Articulo = {
  slug: string;
  titulo: string;
  medio: string;
  edicion?: string;
  anio: string;
  /** Fecha de publicación (AAAA-MM-DD), para ordenar. */
  fecha: string;
  resumen: string;
  /** Imagen que aparece al pasar el mouse (public/escritura/). */
  imagen?: string;
  urlExterna?: string;
  /** Párrafos del cuerpo. Un string que empieza por "> " es una cita destacada. */
  cuerpo?: string[];
  nota?: string;
  creditos?: string;
};

export const ARTICULOS: Articulo[] = [
  {
    slug: "la-ficcion-tropical-que-nos-viste",
    titulo: "La ficción tropical que nos viste",
    medio: "Sofoco Revista",
    edicion: "Edición 02",
    anio: "2026",
    fecha: "2026-06-01",
    imagen: "/escritura/sofoco.webp",
    resumen:
      "Del «tropical chic» a las alertas de viaje: cómo la idea colonial del trópico sigue vistiendo a la moda colombiana y qué se pierde cuando el Caribe solo se narra desde el clima.",
    urlExterna: "https://heyzine.com/flip-book/68279efa7d.html#page/243",
    creditos: "Ilustración digital por Sofoco. Fotografías cortesía de Camila Rua y Colombiamoda.",
    cuerpo: [
      "Cada cierto tiempo, aunque cada vez menos, aparece en internet una persona extranjera narrando que trajo la ropa equivocada para su viaje por Latinoamérica.",
      "Así, una maleta llena de bermudas, camisetas y vestidos se enfrenta a «la nevera», la capital de Colombia, Bogotá, que registra una temperatura promedio de 13,5 °C a lo largo del año. Una equivocación aparentemente simple que demuestra cómo conciben al país y al trópico.",
      "En ese sentido, las maletas empacadas por personas del norte global no solo contienen la ropa equivocada o adecuada, sino que también cargan imaginarios, entre ellos la idea del trópico como territorio binario: un paraíso o una región peligrosa, salvaje y llena de enfermedades.",
      "El viaje en sí mismo es muestra de esa primera cara de la moneda y las medidas internacionales, como las alertas de viaje, evidencian la segunda. Por ejemplo, a pesar de que el Global Peace Index de 2026 categoriza el estado de paz de Colombia y Estados Unidos en el mismo nivel, bajo; en abril de 2026, Estados Unidos emitió una nueva advertencia para Colombia y en ella indicó: «Reconsidere su viaje a Colombia debido a la delincuencia, el terrorismo, los disturbios civiles, los secuestros y los desastres naturales».",
      "Las fantasías y los temores sobre los países tropicales de los viajeros actuales son la continuación de las ideas coloniales que contribuyeron a la construcción tanto de América Latina (aunque no de Abya Yala¹) como del resto de territorios ubicados entre el Trópico de Cáncer y el Trópico de Capricornio, por ejemplo, India, Hawái, Filipinas, Cuba y Tailandia.",
      "Al conjunto de ideas y actitudes, como la ambivalencia de paraíso y peligro, David Arnold la nombró como «Tropicalidad», que distingue «lo otro» de occidente, particularmente las tierras tropicales o «zonas tórridas» de las tierras templadas europeas. Edward Said explica que la «otredad» o «lo otro» es una construcción mental y política de occidente que presenta a las culturas no occidentales como inferiores, exóticas o atrasadas; en el caso de análisis de Said se refiere a Oriente y Arnold lo retoma para observar el trópico.",
      "> Los destinos tropicales son casi que intercambiables y la estética aspiracional para ellos es una, no importa que sea Tailandia, Panamá, Bali o Colombia.",
      "La construcción mental de «lo otro» es una sobresimplificación de una realidad compleja y viva, así que no es una realidad objetiva. Entonces, los destinos tropicales son casi que intercambiables y la estética aspiracional para ellos es una, no importa que sea Tailandia, Panamá, Bali o Colombia, la inspiración vestimentaria se codifica en redes sociales bajo las etiquetas de «tropical vacation outfit», «island girl» y el símbolo de la flor hibiscus o «bonche» como se le conoce en la costa Caribe colombiana. Una estética que se diferencia de la de un «verano mediterráneo» y que no tiene en cuenta el clima de ciudades como Bogotá.",
      "La existencia de una vestimenta general para todo el trópico tiene antecedentes, así se puede observar en el European cloth and ‘tropical’ skin: clothing material and British ideas of health and hygiene in tropical climates, ya que Johnson menciona que los viajeros británicos de finales del siglo XIX, en vez de comprar ropa específica para lugares como el Congo o Calcuta, a menudo compraban ropa para usarla en todos los climas tropicales. De esta manera se puede comprender que la «tropicalidad» es un discurso homogeneizante, al mismo tiempo que diferenciador.",
      "Como se mencionó anteriormente, esta diferenciación plantea al trópico como inferior, exótico y/o atrasado, tanto así que justifica la dominación de los pueblos supuestamente salvajes y la explotación de los recursos naturales desde la colonización hasta la actualidad. En paralelo, este discurso colonial se capitaliza y convierte al territorio y las características útiles para la «tropicalidad» en mercancía cultural exportable, como el personaje de Carmen Miranda o el disco Tropicoqueta de Karol G.",
      "Por consiguiente, no es de extrañar que el boom internacional de la moda colombiana se haya dado con la estética «Tropical chic» y/o «Caribbean chic», específicamente con la colección Nativa de Johanna Ortiz en 2014, que exploraba lo caribeño y tropical a través de elementos como flores, colores y boleros.",
      "La importancia de esta estética se alcanza a dimensionar cuando Vogue afirma que «se podría decir, entonces, que fue esta estética la que abrió la puerta al diseño de autor en Colombia» en el artículo «25 años de moda en Colombia: del Tropical Chic al diseño de autor».",
      "Hoy diseñadores de todas las regiones de Colombia hacen uso de los elementos del trópico tórrido, su fauna, su flora, sus paisajes y su pasado colonial; tanto así que viajan a ciudades como Cartagena, se inspiran, hacen sus colecciones y las venden en el centro histórico y/o las exportan a todo el mundo con Estados Unidos como principal destino en 2025, de acuerdo con El Colombiano en el artículo «Estas son las empresas y los departamentos que más exportan moda colombiana».",
      "La dinámica de apropiarse de los elementos exóticos que no se dan en las tierras frías del trópico andino lleva siglos de historia, desde el siglo XIX, cuando el mercado europeo le exigió a las élites criollas exportar materias primas como la quina, el tabaco, el caucho, el banano o el café. Así lo explica Felipe Martínez Pinzón en el libro Una cultura de invernadero: trópico y civilización en Colombia (1808-1928), donde afirma que «la apropiación del trópico en Colombia surge como un mandato de la economía mundial que se corresponde con un relato representacional». Martínez habla de una apropiación del trópico en Colombia porque los criollos de países ubicados en el trópico andino y sus climas fríos crearon una ficción ideológica en la que Bogotá y los Andes no hacían parte del trópico, refiriéndose al trópico tórrido de las tierras bajas.",
      "Al igual que Europa entendía al trópico como inferior para diferenciarse de él, los criollos también hicieron lo mismo. De acuerdo con su ficción, en el trópico de tierras bajas las enfermedades abundaban, la temperatura degeneraba las razas, los «salvajes» vivían estancados en el tiempo y la fertilidad de las tierras fomentaba la holgazanería y la lujuria. Algunos de estos discursos continúan vigentes y permean los imaginarios sobre las zonas tórridas del país, como las ciudades coloniales estancadas en el tiempo.",
      "Esa comprensión y representación superficial sobre ciudades como Cartagena también se puede observar en la moda y sus diferentes actores. Por ejemplo, en el libro Cartagena Grace, escrito por la diseñadora Johanna Ortiz y Lauren Santo Domingo, y descrito como «Esplendor colonial. Alma caribeña y orgullo inquebrantable», una frase que parece transmitir el sentimiento de alguien que añora la época de la colonización y solo entiende a Cartagena desde esa mirada, estancada en el tiempo.",
      "> El caso anterior ocurrió en 2023, y solo algunas semanas después, la marca Baobab causó otra polémica por sus prácticas racistas durante la apertura de su boutique en Cartagena.",
      "La marca contrató un performance de «palenqueras» en el exterior de la tienda mientras que en el interior mujeres blancas hacían parte del evento, reproduciendo así dinámicas y discursos de la esclavitud.",
      "Tanto Baobab como Johanna Ortiz son marcas de talla internacional que han utilizado el discurso de lo tropical y las estéticas del resort wear para sumar exportaciones, aunque ambas lo hicieron con su propio estilo y en momentos distintos. Sin lugar a dudas, esa fórmula que reproduce discursos coloniales y discriminatorios sobre lo que se supone que es el trópico y sus tierras calientes ha llevado al éxito a la moda colombiana.",
      "Esa ceguera ya era notable en 1996 con los incipientes avances de la moda en Colombia. Alfred Wild, en el libro La moda en Colombia, afirmó: «Al fin, pues, la moda colombiana o, para no ser tan enfáticos, la moda producida en Colombia. Una moda hecha con todo lo que conforma nuestra nacionalidad, nuestra variada y mixta geografía. Pues ya no es Bogotá la ciudad que irradia sus pesados trajes de paño oscuro hacia la tórrida costa. Hay una respuesta adecuada a las necesidades del clima, al temperamento e incluso a la temperatura de la seducción, distintas en cada punto del país. La moda de Colombia surge en el centro y en la provincia». La cuestión está en que el éxito de la moda colombiana y la producción desde la «provincia», la «periferia» o lo «otro» no implica necesariamente una representación del territorio por fuera de la «tropicalidad».",
      "Aun así, es cierto que en los últimos años hemos visto pasarelas inspiradas en otros elementos del trópico. Como la colección Matilde del diseñador Juan Pablo Socarrás, presentada en Colombiamoda 2026, que se inspira en la cantante de cumbia colombiana Matilde Díaz. La pasarela Homenaje al Valle, inspirada en canciones clásicas del vallenato y que reunió a ocho diseñadores colombianos durante la edición 2026 de Ixel Moda Itinerante en Valledupar; o la colección Soy Río de Faride Ramos, presentada en Panamá Fashion Week 2025, con una sastrería que muestra a un Caribe más anguloso y sin tanto color.",
      "Sin embargo, cuando miramos de cerca podemos encontrar elementos estéticos de este Caribe ficcional y la continuación de la narrativa tropical, como en la descripción de la colección de Ramos: «Soy Río es una colección inspirada en Mompox y el río Magdalena que celebra a las mujeres del trópico, reinterpretada por Faride Ramos con sastrería refinada y de identidad».",
      "Ahí, como ser caribeño que soy, en búsqueda de la complejidad es cuando vuelve una duda que me atormenta desde que empecé a interesarme por la moda: ¿acaso las estéticas y narrativas en la moda creada en el Caribe y el trópico siempre tienen que estar atravesadas por sus condiciones climáticas y ambientales?",
    ],
    nota: "¹ Abya Yala es el término utilizado por los pueblos indígenas para referirse al continente americano como resistencia a la colonización.",
  },
];


/** Publicados en otros medios (fuente: su Linktree, Factedá). Fechas e imágenes de cada medio. */
const EXTERNOS: Articulo[] = [
  {
    slug: "costura",
    titulo: "Confesiones en máquina de coser: la costura y el trabajo feminizado",
    medio: "Melodrama.mx",
    anio: "2025",
    fecha: "2025-04-19",
    resumen: "La máquina de coser como archivo íntimo del trabajo de las mujeres, entre el oficio y la precariedad.",
    imagen: "/escritura/costura.webp",
    urlExterna: "https://melodrama.mx/2025-04-costura/",
  },
  {
    slug: "nobsa",
    titulo: "La tejeduría de Nobsa: una oportunidad para la revitalización",
    medio: "Fundación Entre Soles y Lunas",
    anio: "2025",
    fecha: "2025-04-04",
    resumen: "El legado muisca que convirtió a Nobsa en la capital mundial de la ruana: sus historias, dificultades y oportunidades.",
    imagen: "/escritura/nobsa.webp",
    urlExterna: "https://entresolesylunas.org/la-tejeduria-de-nobsa-una-oportunidad-para-la-revitalizacion/",
  },
  {
    slug: "diseno-ia",
    titulo: "Diseño consciente junto a la IA",
    medio: "Universo MOLA",
    anio: "2025",
    fecha: "2025-03-26",
    resumen: "Qué cambia en la creación de moda cuando la inteligencia artificial entra al taller, y cómo usarla con conciencia.",
    imagen: "/escritura/ia.webp",
    urlExterna: "https://universomola.com/diseno-consciente-junto-a-la-ia/",
  },
  {
    slug: "lujo-colombia",
    titulo: "Transformación y proyecciones del mercado de lujo en Colombia",
    medio: "Universo MOLA",
    anio: "2025",
    fecha: "2025-03-18",
    resumen: "Las cifras y las preguntas detrás del crecimiento del lujo colombiano en 2025.",
    imagen: "/escritura/lujo-colombia.webp",
    urlExterna: "https://universomola.com/transformacion-y-proyecciones-del-mercado-de-lujo-en-colombia/",
  },
  {
    slug: "conciertos",
    titulo: "¿Los conciertos aumentan el consumo de prendas de un solo uso?",
    medio: "Universo MOLA",
    anio: "2025",
    fecha: "2025-03-10",
    resumen: "De la gira de Shakira al clóset: el outfit de concierto y la moda de una sola noche.",
    imagen: "/escritura/conciertos.webp",
    urlExterna: "https://universomola.com/los-conciertos-aumentan-el-consumo-de-prendas-de-un-solo-uso/",
  },
  {
    slug: "ecommerce",
    titulo: "El estado real de la moda sostenible en el e-commerce latinoamericano",
    medio: "Universo MOLA",
    anio: "2025",
    fecha: "2025-02-24",
    resumen: "Trescientos millones de compradores digitales en la región: ¿cuánto de lo que se vende en línea es de verdad sostenible?",
    imagen: "/escritura/ecommerce.webp",
    urlExterna: "https://universomola.com/el-estado-real-de-la-moda-sostenible-en-el-e-commerce-latinoamericano/",
  },
  {
    slug: "valentina-suarez",
    titulo: "Aprender para afrontar: Valentina Suárez y los retos de la moda sostenible",
    medio: "Universo MOLA",
    anio: "2025",
    fecha: "2025-02-18",
    resumen: "Conversación sobre lo que se desconoce al entrar, o transicionar, hacia una industria de la moda sostenible.",
    imagen: "/escritura/valentina.webp",
    urlExterna: "https://universomola.com/aprender-para-afrontar-valentina-suarez-explica-los-retos-de-la-industria-de-la-moda-sostenible/",
  },
  {
    slug: "pescado",
    titulo: "El pescado, sus residuos y los nuevos materiales de la moda",
    medio: "Universo MOLA",
    anio: "2025",
    fecha: "2025-02-17",
    resumen: "América Latina es la segunda región acuícola del mundo; sus residuos ya se están volviendo textiles.",
    imagen: "/escritura/pescado.webp",
    urlExterna: "https://universomola.com/el-pescado-sus-residuos-y-los-nuevos-materiales-que-pueden-ser-utilizados-en-la-industria-de-la-moda/",
  },
  {
    slug: "aesthetic",
    titulo: "Vestir aesthetic a las realidades latinas",
    medio: "Melodrama.mx",
    anio: "2024",
    fecha: "2024-11-05",
    resumen: "Vestirse en Colombia, México o Chile: realidades parecidas y distintas, atravesadas por la estética de las redes.",
    imagen: "/escritura/aesthetic.webp",
    urlExterna: "https://melodrama.mx/2024-11-aesthetic-latinoamerica/",
  },
  {
    slug: "lujo",
    titulo: "La insostenibilidad del lujo en la moda colombiana y latina",
    medio: "Melodrama.mx",
    anio: "2024",
    fecha: "2024-09-06",
    resumen: "¿Debe redefinirse el lujo a costa de prácticas laborales dudosas y procesos de producción que nadie conoce?",
    imagen: "/escritura/lujo.webp",
    urlExterna: "https://melodrama.mx/2024-09-lujo/",
  },
];

/**
 * Reels de Instagram de Camila. Para agregar otro: copia su enlace (el
 * `data-instgrm-permalink` del código de inserción, sin `?utm…`) y su texto.
 * `articulo` enlaza el reel con un texto de ESCRITOS (se muestra también en
 * la página de ese artículo).
 */
export type Reel = { url: string; titulo: string; texto: string[]; articulo?: string };

export const REELS: Reel[] = [
  {
    url: "https://www.instagram.com/reel/DeiCT6OSC8G/",
    titulo: "¿En la costa usan jeans?",
    texto: [
      "Aún recuerdo cuando alguien en Medellín me preguntó con incredulidad «¿en la costa usan jeans?» y yo me quedé perpleja. Al leer el libro de Felipe Martínez Pinzón, Una cultura de invernadero: trópico y civilización en Colombia (1808-1928), encontré el sentido de muchos sentimientos que en su momento no supe nombrar.",
      "Este video es una fracción de todo el análisis que se puede hacer sobre las regiones en Colombia, sus culturas, los imaginarios entre ellas y su relación con el vestir.",
    ],
    articulo: "la-ficcion-tropical-que-nos-viste",
  },
];

/** Todos los textos, del más reciente al más antiguo. */
export const ESCRITOS: Articulo[] = [...ARTICULOS, ...EXTERNOS].sort((a, b) => b.fecha.localeCompare(a.fecha));

export function buscarArticulo(slug: string): Articulo | undefined {
  return ARTICULOS.find((a) => a.slug === slug);
}
