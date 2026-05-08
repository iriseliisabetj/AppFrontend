# Lõputöö eesrakendus

Autor: Iris Eliisabet Järvsoo

Tegemist on mängustatud andmepüügi teadlikkuse tõstmise rakendusega, mis loodi lõputöö raames. Rakenduse eesmärk on aidata kasutajatel õppida ära tundma õngitsuskirju ja -sõnumeid läbi lühikeste igapäevaste viktoriinide, kohese tagasiside ja mängustamise elementide.

See repositoorium sisaldab lahenduse eesrakendust Reacti üheleheküljelise rakenduse kujul ning infot, kuidas rakendust käivitada.

## Kasutatud tehnoloogiad

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS
- JWT

## Projekti struktuur

```text
phish-frontend/
├── public/             # Staatilised failid, nt märgid ja pildid
├── src/
│   ├── api/            # API päringud
│   ├── auth/           # Autentimise ja kasutaja oleku abifunktsioonid
│   ├── components/     # Taaskasutatavad kasutajaliidese komponendid
│   ├── pages/          # Rakenduse põhivaated
│   ├── types/          # TypeScript tüübid ja DTO-d
│   ├── utils/          # Üldised abifunktsioonid
│   ├── App.tsx         # Rakenduse marsruudid
│   └── main.tsx        # Rakenduse sisenemispunkt
├── .env.development    # Arenduskeskkonna muutujad
├── package.json
└── vite.config.ts
```

Eesrakendus on üles ehitatud üheleheküljelise rakendusena (SPA), kus vaadete vahel liikumine toimub React Routeri abil ilma lehte täielikult uuesti laadimata. Tagarakendusega suhtlemine toimub REST API kaudu.

## Keskkonnamuutujad

Rakendus vajab tagarakenduse API aadressi.

Loo projekti juurkausta fail `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:5229/api
VITE_MEDIA_BASE_URL=http://localhost:5229
```

Vajadusel muuda aadress vastavalt tagarakenduse käivitamise pordile.

## Projekti käivitamine

### Eeldused

- Node.js
- npm
- töötav tagarakendus

### 1. Paigalda sõltuvused

```bash
npm install
```

### 2. Käivita arenduskeskkond

```bash
npm run dev
```

Rakendus avaneb vaikimisi aadressil:

```text
http://localhost:5173
```
