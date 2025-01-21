export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Mexico",
  // South American Countries
  "Argentina",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Guyana",
  "Paraguay",
  "Peru",
  "Suriname",
  "Uruguay",
  "Venezuela",
  // European Countries
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Netherlands",
  "Portugal",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  // Caribbean Islands
  "Bahamas",
  "Barbados",
  "Cuba",
  "Dominican Republic",
  "Haiti",
  "Jamaica",
  "Trinidad and Tobago",
  "Puerto Rico"
];

// Define which countries use cities instead of states
export const COUNTRIES_WITH_CITIES = [
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Portugal",
  "Italy",
  "Ireland"
];

export const STATES_BY_COUNTRY: { [key: string]: string[] } = {
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ],
  "Canada": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
    "Northwest Territories", "Nunavut", "Yukon"
  ],
  "United Kingdom": [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  "Mexico": [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
    "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca",
    "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
    "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
  ],
  "Brazil": [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
  ],
  "Argentina": [
    "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
    "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
    "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
    "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
  ],
  "France": [
    "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire",
    "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie",
    "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
  ],
  "Germany": [
    "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg",
    "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia",
    "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt",
    "Schleswig-Holstein", "Thuringia"
  ],
  "Spain": [
    "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country",
    "Canary Islands", "Cantabria", "Castile and León", "Castilla-La Mancha",
    "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid",
    "Murcia", "Navarre", "Valencia"
  ]
};

// Major cities for countries without states
export const CITIES_BY_COUNTRY: { [key: string]: string[] } = {
  "Sweden": [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", 
    "Linköping", "Helsingborg", "Jönköping", "Norrköping"
  ],
  "Norway": [
    "Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", 
    "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg"
  ],
  "Denmark": [
    "Copenhagen", "Aarhus", "Odense", "Aalborg", "Frederiksberg", "Esbjerg", 
    "Randers", "Kolding", "Horsens", "Vejle"
  ],
  "Finland": [
    "Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", 
    "Jyväskylä", "Lahti", "Kuopio", "Pori"
  ],
  "Netherlands": [
    "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", 
    "Groningen", "Almere", "Breda", "Nijmegen"
  ],
  "Belgium": [
    "Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", 
    "Namur", "Leuven", "Mons", "Aalst"
  ],
  "Switzerland": [
    "Zürich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", 
    "Lucerne", "St. Gallen", "Lugano", "Biel"
  ],
  "Austria": [
    "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", 
    "Villach", "Wels", "Sankt Pölten", "Dornbirn"
  ],
  "Portugal": [
    "Lisbon", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Setúbal",
    "Coimbra", "Funchal", "Almada", "Faro"
  ],
  "Italy": [
    "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", 
    "Bologna", "Florence", "Bari", "Venice"
  ],
  "Ireland": [
    "Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda",
    "Dundalk", "Swords", "Bray", "Navan"
  ]
};