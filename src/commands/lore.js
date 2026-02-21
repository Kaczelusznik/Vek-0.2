const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/* =========================
   KOLORY (zdefiniowane u góry)
   ========================= */
const COLORS = {
  // frakcje
  pyovshehurdi: 0xD4AF37, // złoty
  nezet: 0xFF4FA3, // różowy
  wekretia: 0x0B1E5B, // granatowy (niebieski granatowy)
  sztorm: 0x7A0C2E, // bordowy
  pszenol: 0x000000, // czarny
  zmora: 0x8B0026, // karmazynowy (zmora karmazynu)
  atarach: 0x3AA7FF, // błękitny
  dajrach: 0x1F8A4C, // zielony
  dush: 0xFF8A00, // pomarańczowy
  kapak: 0x2A0A45, // ciemny fiolet
  zelazny_las: 0x6B3F24, // brązowy
  naeveh: 0x19C6B4, // turkus
  kamakojima: 0xD4001A, // czerwony
  lichter: 0xFFFFFF, // biały
  varkesh: 0x8B0026, // karmazyn
  makiyaku: 0xB07CFF, // jasny fioletowy / purpurowy
  kamachio: 0x1E6CFF, // niebieski

  // tematy
  slepcy: 0x120006, // czarny z czerwonym podbiciem (imitowany)
  krysztal: 0x6A00FF, // fioletowy
};

/* =========================
   MIEJSCA NA GRAFIKI (podmień później)
   ========================= */
const ASSETS = {
  // frakcje
  pyovshehurdi: "https://media.discordapp.net/attachments/800414422324871178/1474767013888000134/IMG_8833.jpg?ex=699b0b4f&is=6999b9cf&hm=a79253c1067125d3277dd98cc27ef706cdaeba03608fb77d190773e6358d4715&=&format=webp",
  nezet: "https://media.discordapp.net/attachments/800414422324871178/1474766874867662950/IMG_8831.jpg?ex=699b0b2e&is=6999b9ae&hm=a0dcd091a0684a97a2acb18310e5e3073b534334bb04c9cd8355e65c699adf4b&=&format=webp&width=912&height=541",
  wekretia: "https://media.discordapp.net/attachments/800414422324871178/1474764538456047818/IMG_8822.jpg?ex=699b0901&is=6999b781&hm=b7137fb13e1cc70e8330da770feb1711cf4a048dc73dea14db18998b2174cbcf&=&format=webp&width=912&height=521",
  sztorm: "https://media.discordapp.net/attachments/800414422324871178/1474766866349166656/IMG_8829.jpg?ex=699b0b2c&is=6999b9ac&hm=38aef6683f33628d89bd926682abdc0bd50a2561c678567bf9ee999a447d7617&=&format=webp",
  pszenol: "https://media.discordapp.net/attachments/800414422324871178/1474762600905572403/IMG_8818.jpg?ex=699b0733&is=6999b5b3&hm=0d27add4578121abd1cf18cd5f09dde1905b7b77b15c0048be9efd866693b918&=&format=webp&width=562&height=855",
  zmora: "https://i.pinimg.com/736x/bd/d5/34/bdd534fe86e9c172546fed149ed009c0.jpg",
  atarach: "https://media.discordapp.net/attachments/800414422324871178/1474766430384689324/IMG_8827.jpg?ex=699b0ac4&is=6999b944&hm=477407e17a8e4c98126d1975d302d61e4b3e4fdc8ccee94b998142b79f9e7601&=&format=webp&width=808&height=408",
  dajrach: "https://media.discordapp.net/attachments/800414422324871178/1474766431131402392/IMG_8826.jpg?ex=699b0ac5&is=6999b945&hm=dce3c8a781ab8eedcda5773aef301a691d8af680f8ae866481716d2594c5dac4&=&format=webp&width=808&height=400",
  dush: "https://media.discordapp.net/attachments/800414422324871178/1474758182403313755/IMG_8793.jpg?ex=699b0316&is=6999b196&hm=6fed4498ffc989be7a36263150466d1798b706b5c442d77ed107749411db71ba&=&format=webp&width=912&height=519",
  kapak: "https://media.discordapp.net/attachments/800414422324871178/1474758268948578426/IMG_8794.jpg?ex=699b032b&is=6999b1ab&hm=57eaf87dcd0a45515cadef11cc341580e6e656e75fff5e758a8e5ab4b3e43750&=&format=webp",
  zelazny_las: "https://media.discordapp.net/attachments/800414422324871178/1474759363108274461/IMG_8800.jpg?ex=699b042f&is=6999b2af&hm=ef54c56811b31f741a37839de549de9ce4b73f60e9398fab0271b6d5c4924206&=&format=webp&width=912&height=570",
  naeveh: "https://media.discordapp.net/attachments/800414422324871178/1474766881847246959/IMG_8832.jpg?ex=699b0b30&is=6999b9b0&hm=f423e539cd3fd05b9b3a2e590967717710e5d0eeb413c211c21089bbf32b511b&=&format=webp&width=912&height=388",
  kamakojima: "https://media.discordapp.net/attachments/800414422324871178/1474763558087557351/IMG_8819.jpg?ex=699b0818&is=6999b698&hm=5fb5b2fb6d933d62d9e0b0f42aba5ec79e8cb263a6b66774eb675c0c6c5a2b11&=&format=webp",
  lichter: "https://media.discordapp.net/attachments/800414422324871178/1474759937451229267/IMG_8804.jpg?ex=699b04b8&is=6999b338&hm=b2b81cb86a9f500a0a936e98edaca2249e59ef96713e4d24f59da83ad94ea36d&=&format=webp&width=912&height=375",
  varkesh: "https://media.discordapp.net/attachments/800414422324871178/1474760090241208452/IMG_8806.jpg?ex=699b04dd&is=6999b35d&hm=aa9fed89e3845dd93d8c4ffed8470fbfa32a1f5fb3d778d9204716486c0bbc2a&=&format=webp&width=912&height=462",
  makiyaku: "https://media.discordapp.net/attachments/800414422324871178/1474759919961112626/IMG_8805.jpg?ex=699b04b4&is=6999b334&hm=db8d698c7d165c0c9e6ce2763885cadfb907406a260f1cdbbe6e689b8543ee79&=&format=webp&width=912&height=419",
  kamachio: "https://media.discordapp.net/attachments/800414422324871178/1474759638225518735/IMG_8802.jpg?ex=699b0471&is=6999b2f1&hm=aca48a1a2468853b59b3ce5692bae9ff7f6812e031f51d6bfc4662f3eb04ace2&=&format=webp&width=912&height=535",

  // tematy
  slepcy: "https://media.discordapp.net/attachments/800414422324871178/1474758619135213640/IMG_8796.jpg?ex=699b037e&is=6999b1fe&hm=8a7e06157dad05a397ddd11d5ba26b3c3702cac0ac7d8fccc1d92b404ef3ce73&=&format=webp",
  krysztal: "https://media.discordapp.net/attachments/800414422324871178/1474758619588329625/IMG_8795.jpg?ex=699b037e&is=6999b1fe&hm=c8014a56b5f25139bed45395950724e48418d7ff0aa3280e0fd2a73ea18c1a52&=&format=webp&width=808&height=453",
};

const FACTIONS = {
  pyovshehurdi: {
    title: "Królestwo Pyovshehurdi",
    text: "Militarne państwo stalowych twierdz i twardej hierarchii. Przegrało wojnę z Nezetem, jest osłabione politycznie i gospodarczo. Z żołnierskiej przysięgi narodziła się Zmora Karmazynu – plaga nieumarłych, będąca piętnem regionu. Elity wciąż wierzą w odbudowę potęgi, lecz kraj balansuje między honorem a widmem upadku."
  },

  nezet: {
    title: "Dyktaturat Nezetu",
    text: "Państwo żelaznej administracji i bezwzględnej dyscypliny. To ono pokonało Pyovshehurdię w ostatniej wojnie, umacniając pozycję stabilnego, chłodnego gracza politycznego. Władza opiera się na aparacie kontroli i hierarchii. Król Nezetu żyje – rządzi poprzez radę i prawą rękę, pozostając symbolem ciągłości państwa."
  },

  wekretia: {
    title: "Wielkie Księstwo Wekretii",
    text: "Rdzeń polityczny kontynentu: sieć sojuszy, wpływów i układów. Wspiera Republikę Kamachio, prowadząc grę dyplomacji zamiast wojny. Obecnie osłabione lekkomyślnością księcia i jego odwróceniem od spraw państwa, co łączy się symbolicznie z „odwróceniem Tukor”. To czyni Wekretię podatną na presję z zewnątrz i rozgrywki religijno-polityczne."
  },

  sztorm: {
    title: "Królestwo Sztormu",
    text: "Nadmorskie królestwo o silnej, regionalnej tożsamości. Funkcjonuje jako odrębny byt polityczny i nie daje się łatwo wciągać w cudze wojny. Znane z niezależności oraz twardych elit. Nie jest dziś głównym mocarstwem, ale pozostaje ważnym elementem równowagi sił między większymi państwami i kontroluje kluczowe szlaki oraz porty."
  },

  pszenol: {
    title: "Wolne Miasto Pszenol",
    text: "Dawne księstwo, dziś zniszczone. Upadło w wyniku konfliktów i destabilizacji regionu, stając się symbolem kruchości małych państw wobec wielkich wojen. Ruiny Pszenolu są przestrogą i argumentem w sporach o przyszłość kontynentu. Dla jednych to martwe miejsce, dla innych – punkt zapalny i przypomnienie, że historia potrafi wracać."
  },

  zmora: {
    title: "Zmora Karmazynu",
    text: "Plaga nieumarłych wywodząca się z przysięgi żołnierzy Pyovshehurdi. Nie jest państwem w klasycznym sensie – to siła destrukcji, rozchodząca się jak choroba. Zagraża całej Wekretii, wypalając miasta, szlaki i pamięć. Jej „skażona siostra” – przelatująca kometa – próbuje infekować kolejne obszary świata, niosąc zarazę dalej niż armie."
  },

  atarach: {
    title: "Sułtanat Atarach",
    text: "Jedno z południowych imperiów kontynentu, sułtanat o własnej tradycji i strukturze władzy. Stanowi odrębny biegun kulturowy wobec północnych monarchii i teokracji. Rzadko ingeruje bezpośrednio w konflikty centralne, ale pozostaje znaczącym podmiotem politycznym – stabilnym, cierpliwym i trudnym do zignorowania w dłuższej grze wpływów."
  },

  dajrach: {
    title: "Sułtanat Dajrach",
    text: "Państwo południa o ustabilizowanej strukturze sułtańskiej. Wymieniane jako jeden z filarów geopolitycznych świata poza osią Nezet–Wekretia–Pyovshehurdi. Utrzymuje własną autonomię i nie angażuje się bezpośrednio w konflikt Zmory, przez co bywa postrzegane jako chłodny obserwator. Jego siła to stabilność, tradycja i kontrola własnych szlaków."
  },

  dush: {
    title: "Wolne Miasto Dush",
    text: "Republika kupiecka rządzona przez Radę. Oparta na handlu i autonomii miejskiej. Nie kieruje się ideologią, lecz interesem – dlatego bywa neutralna, ale wpływowa. Dush jest przestrzenią wymiany między państwami: to tu spotykają się emisariusze, kupcy i przemytnicy, a informacje mają cenę równie wysoką jak złoto. Miasto żyje z przepływu ludzi i towarów."
  },

  kapak: {
    title: "Hrabstwo Kapak",
    text: "Mniejsze państwo o charakterze terytorialnym, działające w feudalnej strukturze. Zachowuje własną autonomię i gra przede wszystkim o przetrwanie oraz interes regionu. Kapak nie jest wielkim mocarstwem, ale przez położenie i lokalne układy potrafi stać się języczkiem u wagi. W świecie wielkich wojen liczą się też małe granice – i Kapak o tym wie."
  },

  zelazny_las: {
    title: "Hrabstwo Żelaznego Lasu",
    text: "Leśne, autonomiczne terytorium silnie związane z regionem i własną tożsamością. Funkcjonuje jako niezależny element polityczny: lokalnie ważny, choć nie dominujący w skali kontynentu. Żelazny Las bywa cichy, lecz nie bezbronny – jego siła tkwi w terenie, tradycji i upartości mieszkańców. Kto lekceważy te ziemie, zwykle płaci za to długo."
  },

  naeveh: {
    title: "Królestwo Naeveh",
    text: "Monarchia należąca do głównych bytów politycznych świata VEK. Utrzymuje ciągłość i odrębność wobec konfliktów Pyovshehurdi i Nezetu, przez co bywa postrzegana jako stabilizator. Naeveh rzadko działa impulsywnie – buduje swoją pozycję cierpliwie, opierając się na własnych instytucjach i tradycji. Jest częścią równowagi sił kontynentu, nawet gdy trzyma dystans."
  },

  kamakojima: {
    title: "Imperium Kamakojimy",
    text: "Teokratyczne imperium Hirdaresa. Władza religijna i państwowa stanowią jedność, a hierarchia jest twarda i nieprzejednana. Izolacyjny charakter państwa wzmacnia poczucie misji i wyższości. Kamakojima rywalizuje z Republiką Kamachio o wpływy kulturowe i polityczne, traktując świat jako pole duchowej próby. Kto nie pasuje do ich porządku, bywa uznany za zagrożenie."
  },

  lichter: {
    title: "Das Tal Der Lichter",
    text: "Państwo Świetlistych – izolacyjna teokracja kryształowych istot rządzona przez wielkie złoże kryształu. Funkcjonuje poza klasyczną polityką ludzi, zachowując dystans wobec ich sporów. Ich obecność jest bardziej zjawiskiem niż sojusznikiem: chłodna, obca, trudna do zrozumienia. Nieliczni, którzy mieli z nimi kontakt, mówią o porządku tak doskonałym, że aż przerażającym."
  },

  varkesh: {
    title: "Varkesh",
    text: "Żywy lud stepowy uciekający przed zagrożeniem ze wschodu. Mobilny, klanowy, oparty na wspólnocie i przetrwaniu. Varkesh nie jest Zmorą – to odrębny naród, który dźwiga ciężar katastrofy regionu i wplątanych przysiąg. Ich tożsamość budują pamięć wędrówki, lojalność wobec klanu i twarde zasady stepu. Tam, gdzie inni proszą o łaskę, oni wybierają drogę."
  },

  makiyaku: {
    title: "Shogunat Makiyaku",
    text: "Młode, ambitne państwo o silnym etosie wojowników. Postrzegane jako zakompleksione i wciąż szukające własnej pozycji w świecie. Dąży do umocnienia znaczenia przez siłę, dyscyplinę i konsekwencję. Makiyaku chce być traktowane poważnie – nawet jeśli musi to udowadniać stalą. Ich polityka jest prostsza niż u starych monarchii: rosnąć, zwyciężać, nie cofać się."
  },

  kamachio: {
    title: "Republika Kamachio",
    text: "Republika wspierana przez Wekretię. Pragmatyczne państwo o strukturze republikańskiej, będące przeciwwagą dla teokratycznej Kamakojimy. Kamachio buduje pozycję przez handel, prawo i sieć interesów – tu kontrakt bywa skuteczniejszy niż armia. Jest elementem gry wpływów na wschodzie kontynentu, a jego siłą jest elastyczność i umiejętność przeżycia w cieniu większych potęg."
  }
};

const TOPICS = {
  slepcy: {
    title: "Ślepcy",
    text: "W kronikach Wekretii mówi się o nich szeptem. Nie są królami, nie są kapłanami, a jednak ich cień pada na więcej miejsc, niż ktokolwiek chciałby przyznać. Pojawiają się tam, gdzie człowiek stoi na granicy - między nadzieją a rozpaczą, między wyborem a koniecznością. Nie mają jednego oblicza. Czasem są głosem zza ściany, czasem postacią w półmroku, czasem tylko uczuciem, że ktoś patrzy. Twierdzą, że pomagają. Oferują drogę, gdy wszystkie inne zdają się zamknięte. Nigdy jednak nie robią tego bez powodu. Ślepcy nie prowadzą wojen i nie zasiadają na tronach. A mimo to wpływają na losy ludzi, miast i całych krain. Ich obecność nie jest oczywista - raczej wyczuwalna. Jak napięcie w powietrzu przed burzą. Wielu uważa ich za wybawców. Inni za coś znacznie starszego i trudniejszego do nazwania. Jedno jest pewne: jeśli spotkasz Ślepca, to znaczy, że twoja historia właśnie zaczyna się naprawdę.",
  },
  krysztal: {
    title: "Kryształy Narminargowa",
    text: "Kryształ narminargowy to podstawowy surowiec Wekretii – jej ropa, jej złoto i jej przekleństwo w jednym. Występuje w żyłach skalnych, lecz bywa też znajdowany w zwykłym żwirze, niczym niepozorny odłamek kwarcu. Jego naturalna barwa jest delikatnie purpurowa – najczęstsza i względnie tania. Rzadsze odmiany przybierają kolor błękitny, a najcenniejsze – głęboki, krwisty czerwony.\nKryształ można modulować i rafinować. Skruszony służy do produkcji leków i narkotyków; stapiany z metalem tworzy stal narminargowską – trwalszą, lżejszą i bardziej sprężystą niż zwykłe stopy. Odpowiednio oczyszczony staje się nośnikiem energii: zasila mechanizmy, wzmacnia broń, stabilizuje eksperymenty.\nJest jednak kapryśny. Reaguje na środowisko, zanieczyszczenia i sposób obróbki. Źle przetworzony potrafi emitować niestabilne promieniowanie, wywołując mutacje, uzależnienia lub niekontrolowane reakcje energetyczne.\nDla jednych to fundament cywilizacji.\nDla innych – źródło wojen i upadku."
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lore")
    .setDescription("Lore świata VEK")
    .addSubcommand((sc) =>
      sc
        .setName("frakcja")
        .setDescription("Opis frakcji")
        .addStringOption((opt) =>
          opt
            .setName("nazwa")
            .setDescription("Wybierz frakcję")
            .setRequired(true)
            .addChoices(
              { name: "Królestwo Pyovshehurdi", value: "pyovshehurdi" },
              { name: "Dyktaturat Nezetu", value: "nezet" },
              { name: "Wielkie Księstwo Wekretii", value: "wekretia" },
              { name: "Królestwo Sztormu", value: "sztorm" },
              { name: "Wolne Miasto Pszenol", value: "pszenol" },
              { name: "Zmora Karmazynu", value: "zmora" },
              { name: "Sułtanat Atarach", value: "atarach" },
              { name: "Sułtanat Dajrach", value: "dajrach" },
              { name: "Wolne Miasto Dush", value: "dush" },
              { name: "Hrabstwo Kapak", value: "kapak" },
              { name: "Hrabstwo Żelaznego Lasu", value: "zelazny_las" },
              { name: "Królestwo Naeveh", value: "naeveh" },
              { name: "Imperium Kamakojimy", value: "kamakojima" },
              { name: "Das Tal Der Lichter", value: "lichter" },
              { name: "Varkesh", value: "varkesh" },
              { name: "Shogunat Makiyaku", value: "makiyaku" },
              { name: "Republika Kamachio", value: "kamachio" }
            )
        )
    )
    .addSubcommand((sc) =>
      sc
        .setName("temat")
        .setDescription("Inne hasła lore")
        .addStringOption((opt) =>
          opt
            .setName("nazwa")
            .setDescription("Wybierz temat")
            .setRequired(true)
            .addChoices(
              { name: "Ślepcy", value: "slepcy" },
              { name: "Kryształy Narminargowa", value: "krysztal" }
            )
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand(true);

    let entry = null;
    let key = null;

    if (sub === "frakcja") {
      key = interaction.options.getString("nazwa", true);
      entry = FACTIONS[key];
    } else if (sub === "temat") {
      key = interaction.options.getString("nazwa", true);
      entry = TOPICS[key];
    }

    if (!entry) {
      return interaction.reply({ content: "Brak takiego wpisu lore.", ephemeral: true });
    }

    const color = COLORS[key] || 0x2B2D31;
    const image = ASSETS[key] || null;

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(entry.title)
      .setDescription(entry.text)
      .setTimestamp()
      .setFooter({ text: "VEK — Kroniki Kontynentu" });

    // duży obrazek (na dole embeda) – thumbnail celowo WYŁĄCZONY
    if (image) embed.setImage(image);

    return interaction.reply({ embeds: [embed] });
  },
};