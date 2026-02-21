const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
  kryszty: {
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
    if (sub === "frakcja") {
      const key = interaction.options.getString("nazwa", true);
      entry = FACTIONS[key];
    } else if (sub === "temat") {
      const key = interaction.options.getString("nazwa", true);
      entry = TOPICS[key];
    }

    if (!entry) {
      return interaction.reply({ content: "Brak takiego wpisu lore.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(entry.title)
      .setDescription(entry.text);

    return interaction.reply({ embeds: [embed] });
  },
};