"use strict";
//@ts-check 
// Joukkueen sarja on viite data.sarjat-taulukossa lueteltuihin sarjoihin
// Joukkueen rastileimausten rastit ovat viitteitä data.rastit-taulukossa lueteltuihin rasteihin

// Kirjoita tästä eteenpäin oma ohjelmakoodisi


// NOTE: Tason viisi puutteita: Järjestämisuuntaa ei voi muuttaa

/**
  * @param {Object} data - tietorakenne, jonka data.rastit-taulukko järjestetään 
  * @return {Array} palauttaa järjestetyn _kopion_ data.leimaustavat-taulukosta
*/
function jarjestaLeimaustavat(data) {
  console.log(data);
  let kopioTaulukosta = JSON.parse(JSON.stringify(data.leimaustavat));

  return kopioTaulukosta.sort();
}

/**
  * @param {Object} data - tietorakenne, jonka data.rastit-taulukko järjestetään 
  * @return {Array} palauttaa järjestetyn _kopion_ data.sarjat-taulukosta
  */
function jarjestaSarjat(data) {
  let kopioTaulukostaSarjat = JSON.parse(JSON.stringify(data.sarjat));

  return kopioTaulukostaSarjat.sort(compare);
}

/**
 * 
 * @param {Object} a ensimmäinen vertailtava objekti
 * @param {Object} b toinen vertailtava objekti
 * @returns parsii merkkijonot ja vertailee niitä keskenään, palauttaa -,0 tai +
 */
function compare(a, b){
  return parseInt(a.nimi)-parseInt(b.nimi);
}

/**
  * @param {Object} data - tietorakenne johon sarja lisätään 
  * @param {String} nimi - Lisättävän sarjan nimi
  * @param {String} kesto - Sarjan kesto
  * @param {String} alkuaika - Sarjan alkuaika, ei pakollinen
  * @param {String} loppuaika - Sarjan loppuaika, ei pakollinen
  * @return {Object} palauttaa muutetun alkuperäisen data-tietorakenteen
  */
function lisaaSarja(data, nimi, kesto, alkuaika, loppuaika) {

  let onkosVaikosEikos = false;

  for(let i =0; i<data.sarjat.length; i++){
    let objekti = data.sarjat[i];
    let objektinNimi = objekti.nimi;

    if(objektinNimi.trim() === nimi.trim()){onkosVaikosEikos = true;}
  }

  if(nimi.trim().length === 0){onkosVaikosEikos = true;}
  
  if(onkosVaikosEikos == false && nimi !="" && kesto != "" && kesto > 0){
  let edellinenObjekti = data.sarjat.length-1;
  let edellisenObjektinId = data.sarjat[edellinenObjekti].id;
  let idUusi = edellisenObjektinId + 1;
  
  let uusiSarja = {nimi: nimi.trim(),
                   kesto: parseInt(kesto),
                   id: idUusi,
                   alkuaika: alkuaika,
                   loppuaika: loppuaika};
  data.sarjat[data.sarjat.length] = uusiSarja;
  }
  return data;
}

/**
  * @param {Object} data - tietorakenne josta joukkue poistetaan
  * @param {String} id - poistettavan joukkueen id
  * @return {Object} palauttaa muuttuneen alkuperäisen datan
  */
function poistaJoukkue(data, id) {

  let joukkueTaulukko = data.joukkueet;
  
  for(let i = 0; i<joukkueTaulukko.length; i++){
    let joukkueId = joukkueTaulukko[i].id;
    if(joukkueId === id){
      data.joukkueet.splice(i, 1);
    }
  }
  return data;
}

/**
  * @param {Object} data - tietorakenne, jonka data.rastit-taulukko järjestetään 
  * @return {Array} palauttaa järjestetyn _kopion_ data.rastit-taulukosta
  */
function jarjestaRastit(data) {

  let kopioRastitTaulukosta = JSON.parse(JSON.stringify(data.rastit));
  return kopioRastitTaulukosta.sort(sorttaaRastitTaulukko);
}

/**
 * Funktio rastit-taulukon järjestämistä varten
 * @param {Object} a objekti a, joka järjestetään suhteessa objektiin b
 * @param {Object} b objekti b, joka järjestetään suhteessa objektiin a 
 * @returns Jos vertailtavista koodeista molemmat ovat numeroita, palautetaan koodi -koodi
 *          Jos vertailtavista koodeista molemmat ovat merkkijonoja, palautetaan koodi-koodi
 *          Jos a.koodi on merkkijono ja b.koodi on numero, palautetaan -1
 *          Jos b.koodi on merkkijono ja a.koodi on numero, palautetaan 1
 */
function sorttaaRastitTaulukko(a,b){

  let sortattava1 = a.koodi;
  let sortattava2 = b.koodi;
  let parsittuSortattava1 = parseInt(sortattava1);
  let parsittuSortattava2 = parseInt(sortattava2);

  if(!(isNaN(parsittuSortattava1)) && !(isNaN(parsittuSortattava2))){
    return sortattava1-sortattava2;
  }

  if(isNaN(parsittuSortattava1) && isNaN(parsittuSortattava2)){
    return sortattava1 - sortattava2;
  }

  if(isNaN(parsittuSortattava1 && !(isNaN(parsittuSortattava2)))){
    return -1;
  }

  if(!(isNaN(parsittuSortattava1)) && isNaN(parsittuSortattava2)){
    return 1;
  }
}

/**
 * Funktio, jonka tarkoituksena on filtteröidä jasenet taulukko siten, että taulukossa on vain uniikkeja nimiä.7
 * Tunnustettakoon, että parametreistä ei ole mitään muistikuvaa, mitä varten ovat ne ovat
 * @param {*} value  
 * @param {*} index 
 * @param {*} self 
 * @returns palauttaa boolean arvon
 */
 function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
  * @param {Object} data - tietorakenne johon joukkue lisätään 
  * @param {String} nimi - Lisättävän joukkueen nimi
  * @param {Array} leimaustavat - Taulukko leimaustavoista
  * @param {String} sarja - Joukkueen sarjan id-tunniste
  * @param {Array} jasenet - joukkueen jäsenet
  * @return {Object} palauttaa muutetun alkuperäisen data-tietorakenteen
  */
function lisaaJoukkue(data, nimi, leimaustavat, sarja, jasenet) {

  let jasenetTaulukko = [];
  let leimaustapaTaulukko = [];
  let onkosVaikosEikos = true;

  // Ongitaan oikeat leimaustapojen indeksit ja lisätään ne leimaustapaTaulukkoon
  for(let i = 0; i<leimaustavat.length; i++){
    for(let j = 0; j<data.leimaustavat.length; j++){
      let leimaustapa1 = leimaustavat[i];
      let leimaustapa2 = data.leimaustavat[j];
      if(leimaustapa1 === leimaustapa2){
        leimaustapaTaulukko[i] = j;
      }
    }
  }

  // Tarkistetaan, että leimaustapa on valittu
  if(leimaustapaTaulukko.length === 0){onkosVaikosEikos=false;}

  // Tarkistetaan, ettei jaseneksi tulee tyhjää
  for(let i= 0; i<jasenet.length; i++){
    if(jasenet[i].length != 0){
      jasenetTaulukko[i] = jasenet[i].trim();
    }
  }
  // Poistaa taulukosta dublikaatit. Huom! Jos taulukon pituudeksi tulee <2, uutta joukkuetta ei lisätä. 
  // Mutta jos pituudeksi jää >= 2, joukkue lisätään, mutta saman nimisiä jäseniä ei ole. If this makes any sense?
  // En tiedä onko aivan tehtävänannon mukainen ratkaisu.
  let uniikkiTaulukko = jasenetTaulukko.filter(onlyUnique);
  
  // Jos taulukko on liian lyhyt, onkosVaikosEikos = false.
  if(uniikkiTaulukko.length <2){
    onkosVaikosEikos = false;
  }

  //Etsitään data.sarjat taulukosta sarjaa("string") vastaava id. Poimitaan k.o. objekti ja tallennetaan tahanTuleeSarja muuttujaan.
  let tahanTuleeSarja;
  let dataSarjat = data.sarjat;
 for(let i =0; i<dataSarjat.length; i++){
   let sarjaObjekti = dataSarjat[i];
   if(sarjaObjekti.id === parseInt(sarja)){
    tahanTuleeSarja = sarjaObjekti;
   }
 }

  //tehdään uusi id
let uusiId = Math.floor(Math.random() * 1000000000000000);
let joukkueetTaulukko = data.joukkueet;
let joukkueenNimi = nimi.trim();

// Tarkistetaan, ettei joukkueen nimi ole pelkkää whitespacea
if(joukkueenNimi === ""){
  onkosVaikosEikos = false;
}
//tarkistetaan, että uusiId ja nimi ovat uniikkeja
  for(let i=0; i<joukkueetTaulukko.length;i++){
    if(joukkueetTaulukko[i].id === uusiId || joukkueetTaulukko[i].nimi === joukkueenNimi){
      onkosVaikosEikos = false;
    }
  }
  // Tehdään uusi joukkue, jos kaikki ehdot täyttyvät
let uusiJoukkue;
if(onkosVaikosEikos === true){
  uusiJoukkue = {
                    nimi: joukkueenNimi,
                    jasenet: jasenetTaulukko,
                    leimaustapa: leimaustapaTaulukko,
                    rastileimaukset:[],
                    sarja: tahanTuleeSarja,
                    pisteet: 0,
                    matka: 0,
                    aika: "00:00:00",
                    id: uusiId                 
  };
}
  // UusiJoukkue lisätään dataan vain jos kaikki ehdot täyttyvät --> Jos ei, palautetaan alkuperäinen data
  if(onkosVaikosEikos === true){data.joukkueet[data.joukkueet.length] = uusiJoukkue;}
  return data;

  // Kommentoidaan vielä, että tämä olisi pitänyt varmaan oikeaoppisesti jakaa useampaan eri funktioon, mutta pidän tämän nyt yhdessä nipussa vaikka onkin sekava.
}

/**
  * @param {Object} joukkue
  * @return {Object} joukkue
  */
function laskeAika(joukkue) {

  let halututLeimaukset = etsiHalututLeimaukset(joukkue);

  if(halututLeimaukset.length === 0){
    return joukkue;
  }

  let lahto = halututLeimaukset[0].aika;
  let maali = halututLeimaukset[halututLeimaukset.length-1].aika;

  let date1 = new Date(maali);
  let date2 = new Date(lahto);
  let date3 = date1.getTime()-date2.getTime();
  let aikaSekunteina = (date3 / 1000)%60;
  let aikaMinuutteina = Math.floor(((date3 % 86400000) % 3600000) / 60000);
  let aikaTunteina = Math.floor((date3 % 86400000) / 3600000);

  if (aikaTunteina < 10) {aikaTunteina   = "0"+aikaTunteina;}
  if (aikaMinuutteina < 10) {aikaMinuutteina = "0"+aikaMinuutteina;}
  if (aikaSekunteina < 10) {aikaSekunteina = "0"+aikaSekunteina;}

  let lopullinenAika = aikaTunteina + ":" + aikaMinuutteina + ":" + aikaSekunteina;

  joukkue.aika = lopullinenAika;

  return joukkue;
}

/**
  * @param {Object} data - tietorakenne, jonka data.rastit-taulukko järjestetään 
  * @param {String} mainsort - ensimmäinen (ainoa) järjestysehto, joka voi olla nimi, sarja, matka, aika tai pisteet  TASO 3
  * @param {Array} sortorder - mahdollinen useampi järjestysehto TASO 5
  * @return {Array} palauttaa järjestetyn ja täydennetyn _kopion_ data.joukkueet-taulukosta
  */
function jarjestaJoukkueet(data, mainsort="nimi", sortorder=[] ) {

    let kopioJoukkueet = JSON.parse(JSON.stringify(data.joukkueet)); // taulukko joukkueista

    for(let i = 0; i< data.joukkueet.length; i++){
      kopioJoukkueet[i] = {...data.joukkueet[i]};
      kopioJoukkueet[i].jasenet.sort();
      kopioJoukkueet[i].leimaustapa = sorttaaLeimaustavat(kopioJoukkueet[i].leimaustapa);
    }

    if(sortorder.length === 0){
      if(mainsort === "sarja"){kopioJoukkueet.sort(vertaileSarja);}
      if(mainsort === "nimi"){kopioJoukkueet.sort(vertaileNimi);}
      if(mainsort === "matka"){kopioJoukkueet.sort(vertaileMatka);}
      if(mainsort === "aika"){kopioJoukkueet.sort(vertaileAika);}
      if(mainsort === "pisteet"){kopioJoukkueet.sort(vertailePisteet);}
    }

    if(sortorder.length > 0){
      if(sortorder[0].key === 'sarja'){kopioJoukkueet.sort(vertaileSarja);}
      if(sortorder[0].key === 'nimi'){kopioJoukkueet.sort(vertaileNimi);}
      if(sortorder[0].key === 'aika'){kopioJoukkueet.sort(vertaileAika);}
      if(sortorder[0].key === 'pisteet'){kopioJoukkueet.sort(vertailePisteet);}
      if(sortorder[0].key === 'matka'){kopioJoukkueet.sort(vertaileMatka);}
    }
  return kopioJoukkueet;
}

/**
 * Funktion tarkoituksena on järjestellä joukkueen leimaustavat
 * @param {Array} taulukko 
 * @returns palautetaan järjestelty taulukko
 */
function sorttaaLeimaustavat(taulukko){

  const mappi = new Map();
  const mappi2 = new Map();
  let tulos = [];

  mappi.set(0, 'QR');
  mappi.set(1, 'NFC');
  mappi.set(2, 'GPS');
  mappi.set(3, 'LOMAKE');

  mappi2.set('QR', 0);
  mappi2.set('NFC', 1);
  mappi2.set('GPS', 2);
  mappi2.set('LOMAKE', 3);

  for(let i = 0; i<taulukko.length; i++){tulos[i] = mappi.get(taulukko[i]);}

  tulos = tulos.sort();
  let tulos2 = [];

  for(let i = 0; i<taulukko.length; i++){tulos2[i] = mappi2.get(tulos[i]);}

  return tulos2;
}
/**
 * Funktion tarkoituksena on vertailla kahden eri joukkueen aikoja ja laittaa ne keskinäiseen järjestykseen.
 * 
 * @param {Object} a joukkue1
 * @param {Object} b joukkue2
 * @returns 
 */
function vertaileAika(a,b){
 let aikaATunnit = parseInt(a.aika.substring(0,2)); 
 let aikaBTunnit = parseInt(b.aika.substring(0,2));
 let aikaAMinuutit = parseInt(a.aika.substring(3,5));
 let aikaBMinuutit = parseInt(b.aika.substring(3,5));
 let aikaASekunnit = parseInt(a.aika.substring(6,8));
 let aikaBSekunnit = parseInt(b.aika.substring(6,8));

 let aikaASekunneissa = (aikaATunnit*60*60) + (aikaAMinuutit * 60)+ aikaASekunnit;
 let aikaBSekunneissa = (aikaBTunnit*60*60) + (aikaBMinuutit * 60) + aikaBSekunnit;
 return aikaASekunneissa - aikaBSekunneissa;
}

/**
 * Vertaillaan matkan pituuksia ja laitetaan ne järjestykseen
 * @param {Object} a 
 * @param {Object} b 
 * @returns Palauttaa matka-matkan (-1 tai pienemmän, nollan tai 1 tai suuremman)
 */
function vertaileMatka(a,b){
  return b.matka-a.matka;
}

/**
 * Vertaillaan pisteitä ja laitetaan joukkueet sen perusteella järjestykseen
 * @param {Object} a 
 * @param {Object} b 
 * @returns Palauttaa pisteet-pisteet tuloksen
 */
function vertailePisteet(a,b){
  return b.pisteet-a.pisteet;
}

/**
 * Vertaillaan joukkueiden nimiä ja laitetaan ne nimen perusteella keskinäiseen järjestykseen
 * @param {Object} a 
 * @param {Object} b 
 * @returns Palauttaa -1, tai 1 sen perusteella kumman nimi on "isompi" tai jos saman arvoiset niin 0 
 */
function vertaileNimi(a,b){
  if (a.nimi < b.nimi) {
    return -1;
  }
  if (a.nimi > b.nimi) {
    return 1;
  }
  return 0;
}
/**
 * Laittaa joukkueet sarjan perusteella keskinäiseen järjetykseen
 * @param {Object} a 
 * @param {Object} b 
 * @returns Palauttaa -1 tai 1 sen perusteella kumman sarja on "isompi", jos saman arvoisia niin palauttaa 0
 */
function vertaileSarja(a, b){
  if (a.sarja.nimi < b.sarja.nimi) {
    return -1;
  }
  if (a.sarja.nimi > b.sarja.nimi) {
    return 1;
  }
  return 0;
}

/**
  * Taso 5
  * Laskee joukkueen kulkeman matkan. Matka tallennetaan joukkue.matka-ominaisuuteen
  * Laske kuinka pitkän matkan kukin joukkue on kulkenut eli laske kunkin rastivälin
  * pituus ja laske yhteen kunkin joukkueen kulkemat rastivälit. Jos rastille ei löydy
  * sijaintitietoa (lat ja lon), niin kyseistä rastia ei lasketa matkaan mukaan. Matka
  * lasketaan viimeisestä LAHTO-rastilla tehdystä leimauksesta alkaen aina
  * ensimmäiseen MAALI-rastilla tehtyyn leimaukseen asti. Leimauksia jotka tehdään
  * ennen lähtöleimausta tai maalileimauksen jälkeen ei huomioida.
  * Käytä annettua apufunktiota getDistanceFromLatLonInKm
  * @param {Object} joukkue
  * @return {Object} joukkue
  */
function laskeMatka(joukkue) {
  // taulukko leimauksista, jotka ovat lähdön ja maalin välillä
  let halututLeimaukset = etsiHalututLeimaukset(joukkue); 
  // järjestetään leimaukset aikajärjestykseen
 //halututLeimaukset.sort(jarjestaLeimauksetAikajarjestykseen);

  let matkanpituus = 0;

  for(let i = 0; i<halututLeimaukset.length-1;i++){
    let rasti1 = halututLeimaukset[i].rasti;
    let rasti2 = halututLeimaukset[i+1].rasti;
  if(rasti1 != undefined && rasti2 != undefined && typeof rasti1 != 'string' && typeof rasti2 != 'string'){
  if(rasti1.lon != "" && rasti1.lat !="" && rasti2.lon != "" && rasti2.lat != ""){
    let lon1 = rasti1.lon;
    let lat1 = rasti1.lat;
    let lon2 = rasti2.lon;
    let lat2 = rasti2.lat;

    let kahdenPisteenValinenMatka = getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
  
    matkanpituus += kahdenPisteenValinenMatka;
    }
  }
}

  joukkue.matka = parseInt(matkanpituus);
  return joukkue;
}

function jarjestaLeimauksetAikajarjestykseen(a,b){
  let aikaA = parsiSekunneiksi(a.aika);
  let aikaB = parsiSekunneiksi(b.aika);

  return aikaA-aikaB;
}

function parsiSekunneiksi(aika){
  let aikaTunnit = parseInt(aika.substring(11,13)); 
  let aikaMinuutit = parseInt(aika.substring(14,16));
  let aikaSekunnit = parseInt(aika.substring(17,19));
  let aikaSekunneissa = (aikaTunnit*60*60) + (aikaMinuutit * 60)+ aikaSekunnit;

  return aikaSekunneissa;
}

/**
  * Taso 5
  * Laskee joukkueen saamat pisteet. Pistemäärä tallennetaan joukkue.pisteet-ominaisuuteen
  * Joukkue saa kustakin rastista pisteitä rastin koodin ensimmäisen merkin
  * verran. Jos rastin koodi on 9A, niin joukkue saa yhdeksän (9) pistettä. Jos rastin
  * koodin ensimmäinen merkki ei ole kokonaisluku, niin kyseisestä rastista saa nolla
  * (0) pistettä. Esim. rasteista LÄHTÖ ja F saa 0 pistettä.
  * Samasta rastista voi sama joukkue saada pisteitä vain yhden kerran. Jos
  * joukkue on leimannut saman rastin useampaan kertaan lasketaan kyseinen rasti
  * mukaan pisteisiin vain yhden kerran.
  * Rastileimauksia, jotka tehdään ennen lähtöleimausta tai maalileimauksen jälkeen, ei
  * huomioida.
  * Maalileimausta ei huomioida kuin vasta lähtöleimauksen jälkeen.
  * Jos joukkueella on useampi lähtöleimaus, niin pisteet lasketaan vasta
  * viimeisen lähtöleimauksen jälkeisistä rastileimauksista.
  * Joukkue, jolla ei ole ollenkaan rastileimauksia, saa 0 pistettä
  * @param {Object} joukkue
  * @return {Object} joukkue
  */
function laskePisteet(joukkue) {

  let joukkueenLeimaukset = etsiHalututLeimaukset(joukkue); // halutut leimaukset, kopio
  poistaTuplatLeimausTaulukosta(joukkueenLeimaukset);
  let pisteet = laskePisteetTaulukosta(joukkueenLeimaukset);
  joukkue.pisteet = pisteet;
  return joukkue;
}
/**
 * Lasketaan muokatusta rastileimaukset taulukosta pisteet
 * @param {Array} taulukko 
 */
function laskePisteetTaulukosta(taulukko){

  let pisteet = 0;

  for(let i=0; i<taulukko.length; i++){
    if(typeof taulukko[i] != 'undefined'){
      let leimaus = taulukko[i];
      if(typeof leimaus.rasti != 'undefined'){
        let rasti = leimaus.rasti;
        if(typeof rasti.koodi != 'undefined'){
          let koodi = rasti.koodi;
          let eka = parseInt(koodi.charAt(0));
          if(!(isNaN(eka))){
            pisteet += eka;
          }
        }
      }
    }
  }

  return pisteet;
}

/**
 * Tällä funktiolla siivotaan taulukkoa ja poistetaan tuplat
 * @param {Array} leimausTaulukko 
 */
function poistaTuplatLeimausTaulukosta(leimausTaulukko){

  for(let i=1; i<leimausTaulukko.length-2; i++){
    if(typeof leimausTaulukko[i].rasti != 'undefined'){
    let leimaus = leimausTaulukko[i];
    let rasti = leimaus.rasti;
    let rastinKoodi = rasti.koodi;
    for(let j = i+1; j<leimausTaulukko.length-1; j++){
      let leimaus2 = leimausTaulukko[j];
      if(typeof leimaus2.rasti != 'undefined'){
      let rasti2 = leimaus2.rasti;
      let rastinKoodi2 = rasti2.koodi;
      if(rastinKoodi === rastinKoodi2){leimausTaulukko.splice(j,1);j--;}}
    }
    }
  }
}

/**
 * Tässä etsitään halutut leimaukset
 * Ensin etsitään viimeinen LAHTO leimaus ja ensimmäinen MAALI leimaus
 * Tämän jälkeen etsitään kaikki leimaukset siltä väliltä
 * @param {*} leimausTaulukko taulukko, jossa on kaikki joukkueen leimaukset
 */ 
function etsiHalututLeimaukset(joukkue){

  let halututLeimaukset = [];
  let leimausTaulukko = [];
    for(let i = 0; i< joukkue.rastileimaukset.length; i++){
      leimausTaulukko[i] = {...joukkue.rastileimaukset[i]};
    }

  if(leimausTaulukko.length === 0){return leimausTaulukko;} // Jos leimaustaulukko on tyhjä, palautetaan sama tyhjä taulukko
  // järjestetään leimaukset aikajärjestykseen
  leimausTaulukko.sort(jarjestaLeimauksetAikajarjestykseen);

  // Etsitään ensimmäisten lähtö- ja maalileimausten indeksi
  let maalileimausIndeksi = 0;
  let lahtoleimausIndeksi = 0;

  for(let i = 0; i<leimausTaulukko.length; i++){
    let leimaus =  leimausTaulukko[i];
    if(typeof leimaus.rasti === 'object'){
      let rasti = leimaus.rasti;
     if(rasti.koodi === 'MAALI' && maalileimausIndeksi === 0){
        maalileimausIndeksi = i;
      }
      if(rasti.koodi === 'LAHTO' && lahtoleimausIndeksi === 0){
       lahtoleimausIndeksi = i;
      }
    }
  }
  if(maalileimausIndeksi === 0){return halututLeimaukset;}
  // Valitaan lähtö- ja maalileimaus indeksien väliset alkiot palautettavaan taulukkoon

  for(let k = lahtoleimausIndeksi; k<maalileimausIndeksi; k++){
    halututLeimaukset.push(leimausTaulukko[k]);
  }

  return halututLeimaukset;
}



// apufunktioita tasolle 5
/**
  * Laskee kahden pisteen välisen etäisyyden
  */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2-lat1);  // deg2rad below
  let dLon = deg2rad(lon2-lon1);
  let a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c; // Distance in km
  return d;
}
/**
   Muuntaa asteet radiaaneiksi
  */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

