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
  sztorm: "https://media.discordapp.net/attachments/800414422324871178/1474768580796223681/IMG_8836.jpg?ex=699b0cc5&is=6999bb45&hm=522060f4107a86ffb2e6079acaad8ea9cf4e81ffe72849a5e92622124bc8b27b&=&format=webp",
  pszenol: "https://media.discordapp.net/attachments/800414422324871178/1474762600905572403/IMG_8818.jpg?ex=699b0733&is=6999b5b3&hm=0d27add4578121abd1cf18cd5f09dde1905b7b77b15c0048be9efd866693b918&=&format=webp&width=562&height=855",
  zmora: "https://i.pinimg.com/736x/bd/d5/34/bdd534fe86e9c172546fed149ed009c0.jpg",
  atarach: "https://media.discordapp.net/attachments/800414422324871178/1474772206109200568/IMG_8841.jpg?ex=699b1025&is=6999bea5&hm=9064ff891688697a96914a2bf3194940d57e4a13e45f73cb35e69ada8771c351&=&format=webp&width=1152&height=960",
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
  krysztal: "https://media.discordapp.net/attachments/800414422324871178/1474779037330051254/IMG_8850.jpg?ex=699b1682&is=6999c502&hm=00662763e1c53ba7bd6e721a62cd54e0d20a97250cefec6e60949af5f8b3e604&=&format=webp&width=480&height=856",
};

const FACTIONS = {
  pyovshehurdi: {
    title: "Królestwo Pyovshehurdi",
    text: "Królestwo Pyovshehurdi to militarne państwo zbudowane na kulcie siły, dyscypliny i bezwzględnej hierarchii. Jego krajobraz znaczą stalowe twierdze, masywne mury i miasta przypominające zbrojownie bardziej niż ośrodki życia cywilnego. Armia przez dekady była sercem państwa i jego dumą, religią i fundamentem tożsamości narodowej.\nPrzegrana wojna z Nezetem zachwiała jednak tym porządkiem. Państwo zostało osłabione gospodarczo, a politycznie utraciło część wpływów i prestiżu. Klęska podważyła mit niepokonanej potęgi, który przez pokolenia cementował społeczeństwo. Weterani wrócili do domów z pytaniami, na które elity nie chcą odpowiadać.\nWewnątrz kraju narasta konflikt bratobójczy. Część możnych domaga się reform i odbudowy poprzez modernizację, inni wzywają do jeszcze większej militaryzacji i odwetu. Społeczeństwo jest podzielone. Między lojalnością wobec tradycji a zmęczeniem niekończącą się mobilizacją.\nElity wciąż wierzą w odbudowę dawnej potęgi. Mówią o honorze, o długu wobec przodków, o konieczności odzyskania utraconej pozycji. Jednak pod stalową fasadą twierdz coraz wyraźniej słychać pęknięcia. Królestwo balansuje na granicy, między próbą powrotu do chwały a widmem powolnego upadku, który może nadejść nie od wroga z zewnątrz, lecz z własnego wnętrza."
  },

  nezet: {
    title: "Dyktaturat Nezetu",
    text: "Państwo żelaznej administracji i nadto wiecznego spokoju. Nezet zbudował swoją potęgę nie na krzyku armat, lecz na chłodnej kalkulacji, porządku i konsekwencji. Jego miasta są uporządkowane, prawa jasne, a urzędnicy równie nieugięci jak stal, którą tak często gardzą jego sąsiedzi.\nTo właśnie Nezet pokonał Pyovshehurdię w ostatniej wojnie, nie dzięki szałowi bitewnemu, lecz dzięki strategii, cierpliwości i bezbłędnej logistyce. Zwycięstwo to umocniło jego pozycję jako stabilnego i przewidywalnego gracza politycznego, państwa które nie działa pod wpływem emocji.\nKról Nezetu żyje od setek lat i choć rzadko ukazuje się publicznie, pozostaje symbolem ciągłości i trwałości państwa. Rządzi poprzez radę oraz swoją prawą rękę, Ode Pagundur, która w jego imieniu podejmuje decyzje i utrzymuje żelazny porządek.\nDla jednych Nezet jest ostoją stabilności i rozsądku, dla innych zimnym mechanizmem władzy pozbawionym duszy. Jedno jednak pozostaje pewne - dopóki żyje król, dopóty trwa Nezet."
  },

  wekretia: {
    title: "Wielkie Księstwo Wekretii",
    text: "Rdzeń polityczny kontynentu: sieć sojuszy, wpływów i układów, które przez dekady czyniły z Wekretii serce wszelkiej równowagi. To tutaj krzyżują się interesy państw, tu zapadają decyzje, które rzadko brzmią jak wyrok wojny, a częściej jak cichy kompromis przy zamkniętych drzwiach.\nWekretia wspiera Republikę Kamachio, prowadząc grę dyplomacji zamiast otwartego konfliktu. Jej siłą zawsze była rozmowa, presja polityczna i umiejętność wiązania przeciwników zależnościami, z których trudno się wyplątać.\nObecnie jednak państwo słabnie przez lekkomyślność księcia i jego odwrócenie od spraw władzy. Symbolicznie mówi się o „odwróceniu Tukor” jakby sama opiekunka Wekretii przestała patrzeć na swój lud. To osłabienie czyni kraj podatnym na presję z zewnątrz oraz na religijno-polityczne rozgrywki, które coraz śmielej wnikają w jego struktury.\nMimo tego Wekretia pozostaje niesmiertelnym państwem, od którego kontynent wziął swoją nazwę. Kraina tajg, bagien, gór i mrozu, znana ze znakomitej kawalerii i osobliwej miłości do kotów, wciąż stanowi symbol dawnej potęgi i osi, wokół której obraca się los całego świata."
  },

  sztorm: {
    title: "Królestwo Sztormu",
    text: "Królestwo o silnej, regionalnej tożsamości, zbudowane na dumie i odrębności Brakhyrów jako rasy. Od pokoleń funkcjonuje jako samodzielny byt polityczny i nie pozwala łatwo wciągać się w cudze wojny ani ideologiczne krucjaty. Jego elity są twarde, pragmatyczne i przyzwyczajone do podejmowania decyzji bez oglądania się na naciski z zewnątrz.\nNie jest dziś głównym mocarstwem kontynentu, lecz pozostaje istotnym elementem równowagi sił między większymi państwami. Kontroluje kluczowe szlaki handlowe oraz porty, przez które przepływają towary, informacje i wpływy, co daje mu znaczenie większe niż sugerowałaby jego liczebność.\nObecny książę jest zbyt młody, by samodzielnie władać państwem, dlatego realną władzę sprawuje regent Augustyn von Thernica. To on prowadzi politykę zagraniczną, negocjuje sojusze i dba o stabilność wewnętrzną, starając się utrzymać królestwo z dala od chaosu, który coraz częściej ogarnia resztę kontynentu."
  },

  pszenol: {
    title: "Wolne Miasto Pszenol",
    text: "Dawne księstwo, dziś zniszczone i opuszczone, którego upadek stał się jednym z najbardziej bolesnych symboli ostatnich dekad. Pszenol rozpadł się w wyniku konfliktów i destabilizacji regionu, nie wytrzymując nacisku większych sił oraz własnych wewnętrznych napięć. To, co kiedyś było ośrodkiem lokalnej władzy i handlu, dziś jest pasmem ruin porośniętych ciszą.\nW okolicznych lasach wybuchła Zmora Karmazynu, która ostatecznie przypieczętowała los księstwa. Plaga rozlała się po ziemiach Pszenolu jak cień, a strach i chaos przyspieszyły jego ostateczny rozpad.\nWładał nim Tenebris, postać owiana tajemnicą, która zniknęła wraz z upadkiem państwa. Nie wiadomo, czy poległ, uciekł, czy wciąż gdzieś istnieje, czekając na właściwy moment.\nRuiny Pszenolu są dziś przestrogą i argumentem w sporach o przyszłość kontynentu. Dla jednych to martwe miejsce, którego historia dobiegła końca. Dla innych punkt zapalny i przypomnienie, że historia potrafi wracać, zwłaszcza tam, gdzie pozostawiono nierozliczone winy i niedopowiedziane prawdy."
  },

  zmora: {
    title: "Zmora Karmazynu",
    text: "Plaga nieumarłych wywodząca się z przysięgi żołnierzy Pyovshehurdi, wypaczonej i przekutej w coś, co wymknęło się spod kontroli. Nie jest państwem w klasycznym sensie, nie ma granic, stolicy ani władcy, którego można pokonać. Jest siłą destrukcji, rozchodzącą się jak choroba, jak echo dawnego zobowiązania, które nie wygasło wraz ze śmiercią przysięgających.\nZmora Karmazynu zagraża całej Wekretii, wypalając miasta, szlaki handlowe i pamięć o tym, co istniało wcześniej. Tam, gdzie przechodzi, pozostaje cisza i pustka, a ziemia na długo nie chce przyjąć nowych mieszkańców.\nJej „skażona siostra”, przelatująca kometa, pojawia się na niebie jako omen i narzędzie dalszej infekcji. Według wierzeń to ona próbuje zakażać kolejne obszary świata, niosąc zarazę dalej niż jakakolwiek armia mogłaby dotrzeć. W ten sposób Zmora przekracza granice, które dla ludzi wciąż mają znaczenie, lecz dla niej są jedynie chwilową przeszkodą."
  },

  atarach: {
    title: "Sułtanat Atarach",
    text: "Jedno z południowych imperiów kontynentu, sułtanat o własnej tradycji i rozbudowanej strukturze władzy. Stanowi odrębny biegun kulturowy wobec północnych monarchii i teokracji, kierując się inną wizją porządku, autorytetu i prawa. Jego dwór słynie z ceremoniału, cierpliwej polityki i długofalowego planowania.\nRządzony przez starą Temire, władczynię doświadczoną i bezwzględnie konsekwentną, sułtanat prowadzi obecnie wojnę z Dajrach. Konflikt ten nie jest jedynie starciem granic, lecz próbą ustalenia dominacji na południu i zabezpieczenia wpływów w regionie.\nTo jedno z większych imperiów, którego granice wychodzą daleko poza znane ludom Wekretii mapy. Jego wpływy sięgają terenów, o których na północy krążą jedynie opowieści. Choć rzadko ingeruje bezpośrednio w konflikty centralne, pozostaje znaczącym podmiotem politycznym, stabilnym, cierpliwym i trudnym do zignorowania w dłuższej grze wpływów."
  },

  dajrach: {
    title: "Sułtanat Dajrach",
    text: "Sułtanat Dajkrach to dynamicznie rozwijające się państwo, które atakuje Atarach niczym rój szerszeni, metodycznie i bez wahania przesuwając swoje granice coraz dalej. Jego ekspansja jest szybka, zdecydowana i oparta na mobilności wojsk oraz silnym zapleczu wewnętrznym.\nMimo swojej ofensywnej polityki wobec południowego rywala, Dajkrach nie ingeruje w spory głównego kontynentu, ograniczając się do ich uważnej obserwacji. Zamiast mieszać się w północne konflikty, buduje własną pozycję, wzmacnia gospodarkę i zabezpiecza interesy.\nPaństwo pozostaje otwarte na handel z innymi krajami, chętnie przyjmując kupców i zawierając pragmatyczne umowy. Dla wielu jest przykładem rosnącej potęgi, która woli rozwijać się na własnych zasadach, niż wikłać w cudze wojny."
  },

  dush: {
    title: "Wolne Miasto Dush",
    text: "Republika kupiecka rządzona przez Radę oraz Wilca Klemensa, który stoi na straży porządku i interesów miasta. Oparta na handlu i silnej autonomii miejskiej, nie kieruje się ideologią, lecz czystym interesem, dlatego bywa neutralna, lecz niezwykle wpływowa. Dush jest przestrzenią wymiany między państwami, miejscem gdzie spotykają się emisariusze, kupcy i przemytnicy, a informacje mają cenę równie wysoką jak złoto.\nMiasto żyje z przepływu ludzi i towarów, lecz jego otwartość nie oznacza swobody. Obowiązują tu godziny policyjne, a prawo jest surowe i egzekwowane bez wyjątku. Państwo ma charakter restrykcyjny, kontroluje handel, porty i ruch wewnętrzny z żelazną konsekwencją.\nMimo twardych zasad Dush prosperuje doskonale. Stabilność, bezpieczeństwo i przewidywalność sprawiają, że kapitał nie odpływa, a wpływy republiki rosną z każdym rokiem, czyniąc z niej jedno z najbogatszych i najbardziej pragmatycznych miejsc na kontynencie."
  },

  kapak: {
    title: "Hrabstwo Kapak",
    text: "Mniejsze państwo o wyraźnie terytorialnym charakterze, funkcjonujące w feudalnej strukturze zależności i lokalnych przysiąg. Hrabstwo Kapak zachowuje własną autonomię, a jego władcy koncentrują się przede wszystkim na przetrwaniu oraz ochronie interesu regionu, zamiast na ambicjach wykraczających poza jego granice.\nKapak nie jest wielkim mocarstwem, lecz jego położenie oraz gęsta sieć lokalnych układów sprawiają, że potrafi stać się języczkiem u wagi w sporach silniejszych sąsiadów. Przez jego ziemie przebiegają ważne trakty i granice wpływów, co czyni go cennym, choć często niedocenianym partnerem.\nW świecie wielkich wojen i imperialnych ambicji liczą się również małe granice, a Kapak doskonale o tym wie. Dlatego prowadzi ostrożną, wyważoną politykę, unikając otwartych konfliktów, lecz nigdy nie rezygnując z możliwości wzmocnienia własnej pozycji."
  },

  zelazny_las: {
    title: "Hrabstwo Żelaznego Lasu",
    text: "Leśne, autonomiczne terytorium silnie związane z regionem i własną tożsamością. Hrabstwo Żelaznego Lasu znajduje się w centrum kontynentu i formalnie podlega Pyovshehurdi, jednak zachowuje znaczną niezależność w sprawach wewnętrznych. Funkcjonuje jako odrębny element polityczny, lokalnie istotny, choć niedominujący w skali całej Wekretii.\nŻelazny Las bywa cichy, lecz nie jest bezbronny. Jego siła tkwi w trudnym terenie, gęstych borach, znajomości ziemi oraz w twardej tradycji mieszkańców, którzy od pokoleń uczą się żyć na granicy wpływów i konfliktów.\nChoć lojalny wobec Pyovshehurdi, region zachowuje własny charakter i własne interesy. Kto lekceważy te ziemie lub traktuje je wyłącznie jako peryferie większego państwa, zwykle przekonuje się zbyt późno, że las potrafi bronić się sam."
  },

  naeveh: {
    title: "Królestwo Naeveh",
    text: "Królestwo Naeveh, państwo Brakhyrów, niegdyś znane z radości, otwartości i dostatku, dziś jest cieniem swojej dawnej świetności. Przez pokolenia uchodziło za jednego z najwierniejszych sojuszników Nezetu, budując stabilność na wzajemnym zaufaniu i wspólnych interesach.\nObecnie jednak Naeveh znajduje się pod władzą szalonego króla, którego rządy przyniosły strach, represje i izolację. Dyktatorskie decyzje oraz obsesyjna kontrola nad społeczeństwem sprawiły, że państwo zaczęło zamykać się w sobie, odcinając się zarówno od dawnych partnerów, jak i własnych tradycji.\nZamiast być częścią większej równowagi sił, Naeveh stało się odseparowanym graczem, który coraz częściej niszczy samego siebie. Dawny sojusz z Nezetem istnieje już głównie w pamięci starszych pokoleń, a przyszłość królestwa zależy od tego, czy Brakhyrowie zdołają przerwać spiralę wewnętrznego upadku."
  },

  kamakojima: {
    title: "Imperium Kamakojimy",
    text: "Teokratyczne imperium Hirdaresa, w którym władza religijna i państwowa stanowią nierozerwalną jedność. Hierarchia jest twarda, jasno określona i nieprzejednana, a każdy szczebel podporządkowany jest doktrynie uznawanej za absolutną prawdę.\nIzolacyjny charakter państwa wzmacnia poczucie misji oraz przekonanie o własnej wyższości. Kamakojima postrzega siebie jako strażnika duchowego porządku, a świat zewnętrzny jako przestrzeń nieustannej próby wiary i lojalności.\nImperium rywalizuje z Republiką Kamachio o wpływy kulturowe i polityczne, uznając jej świecki model za zagrożenie dla właściwego ładu. Kto nie pasuje do ich porządku lub kwestionuje doktrynę, bywa szybko uznany za niebezpieczny element, który należy podporządkować albo wykluczyć."
  },

  lichter: {
    title: "Das Tal Der Lichter",
    text: "Państwo Świetlistych, izolacyjna teokracja kryształowych istot rządzona przez wielkie złoże kryształu, które stanowi zarówno centrum władzy, jak i źródło ich istnienia. Ich struktura nie przypomina ludzkich monarchii ani republik, a porządek, w którym funkcjonują, wydaje się wynikać z samej natury kryształu.\nŚwietliści pozostają poza klasyczną polityką ludzi, zachowując wyraźny dystans wobec ich wojen, sojuszy i ambicji. Nie angażują się w spory, o ile nie zostaną bezpośrednio dotknięci ich skutkami, a ich decyzje rzadko bywają zrozumiałe dla zewnętrznych obserwatorów.\nIch obecność jest bardziej zjawiskiem niż sojuszem, chłodna, obca i trudna do pojęcia. Nieliczni, którzy mieli z nimi kontakt, mówią o porządku tak doskonałym, że aż przerażającym, jakby każda cząstka ich państwa była podporządkowana jednemu, niezmiennemu prawu."
  },

  varkesh: {
    title: "Varkesh",
    text: "Żywy lud stepowy uciekający przed zagrożeniem ze wschodu. Mobilny, klanowy, oparty na wspólnocie i przetrwaniu, Varkesh przemieszcza się wraz z całymi rodami, stadami i pamięcią dawnych ziem. Nie jest Zmorą, lecz odrębnym narodem, który dźwiga ciężar katastrofy regionu oraz konsekwencje wplątanych przysiąg i dawnych zobowiązań.\nIch tożsamość budują pamięć niekończącej się wędrówki, bezwzględna lojalność wobec klanu oraz twarde zasady stepu, gdzie słabość szybko zostaje wystawiona na próbę. W ich kulturze honor mierzy się czynem, a przywództwo zdolnością do ochrony wspólnoty.\nNajeżdżają główny kontynent nie z żądzy podboju, lecz z konieczności i desperacji, szukając przestrzeni do życia i bezpieczeństwa dla swoich rodów. Tam, gdzie inni proszą o łaskę, oni wybierają drogę, nawet jeśli prowadzi ona przez obce ziemie i ku nowym konfliktom."
  },

  makiyaku: {
    title: "Shogunat Makiyaku",
    text: "Młode, ambitne państwo o silnym etosie wojowników, które dopiero buduje swoją legendę. Postrzegane bywa jako zakompleksione i zbyt gwałtowne w swoich działaniach, wciąż szukające własnej pozycji w świecie zdominowanym przez starsze i bardziej ugruntowane potęgi.\nMakiyaku dąży do umocnienia znaczenia poprzez siłę, dyscyplinę i konsekwencję. W ich kulturze ceniona jest wytrwałość, honor pola bitwy oraz bezwzględna lojalność wobec zwierzchnictwa. Każde zwycięstwo ma być dowodem, że zasługują na miejsce przy stole wielkich graczy.\nChcą być traktowani poważnie, nawet jeśli muszą to udowadniać stalą. Ich polityka jest prostsza niż u starych monarchii, pozbawiona zawiłych intryg i wielopokoleniowych kompromisów. Rosnąć, zwyciężać, nie cofać się, to zasada, która wyznacza kierunek ich działań i definiuje przyszłość państwa."
  },

  kamachio: {
    title: "Republika Kamachio",
    text: "Republika wspierana przez Wekretię, stanowiąca pragmatyczną przeciwwagę dla teokratycznej Kamakojimy. Jej ustrój opiera się na strukturze republikańskiej, w której decyzje zapadają poprzez instytucje i układy, a nie boskie mandaty czy dziedziczne prawa.\nKamachio buduje swoją pozycję przez handel, prawo i rozbudowaną sieć interesów. W tym państwie kontrakt bywa skuteczniejszy niż armia, a wpływy zdobywa się poprzez zależności ekonomiczne i precyzyjnie skonstruowane porozumienia.\nJest ważnym elementem gry wpływów na wschodzie kontynentu. Jego siłą pozostaje elastyczność oraz zdolność do przetrwania w cieniu większych potęg, balansując między nimi tak, by nigdy nie znaleźć się całkowicie pod czyjąś dominacją."
  }
};

const TOPICS = {
  slepcy: {
    title: "Ślepcy",
    text: "W kronikach Wekretii mówi się o nich szeptem. Nie są królami, nie są kapłanami, a jednak ich cień pada na więcej miejsc, niż ktokolwiek chciałby przyznać. Pojawiają się tam, gdzie człowiek stoi na granicy, między nadzieją a rozpaczą, między wyborem a koniecznością.\nNie mają jednego oblicza. Czasem są głosem zza ściany, czasem postacią w półmroku, czasem tylko przelotnym wrażeniem, że ktoś obserwuje każdy ruch. Twierdzą, że pomagają. Oferują drogę wtedy, gdy wszystkie inne zdają się zamknięte, gdy świat kurczy się do jednego, ostatecznego kroku.\nNigdy jednak nie robią tego bez powodu. Ślepcy nie prowadzą wojen i nie zasiadają na tronach, a mimo to wpływają na losy ludzi, miast i całych krain. Ich obecność nie jest oczywista, raczej wyczuwalna, jak napięcie w powietrzu przed burzą.\nWielu uważa ich za wybawców. Inni za coś znacznie starszego i trudniejszego do nazwania. Jedno jest pewne, jeśli spotkasz Ślepca, to znaczy, że twoja historia właśnie zaczyna się naprawdę.",
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