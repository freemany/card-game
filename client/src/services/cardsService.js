import { cards as cardsConfig } from "./../config";
import Card from "./card";

let cards = [];
let shuffledCardsConfig;

function shuffle(d) {
  for (let c = d.length - 1; c > 0; c--) {
    const b = Math.floor(Math.random() * (c + 1));
    const a = d[c];
    d[c] = d[b];
    d[b] = a;
  }
  return d;
}

const loadCards = (scene, cardFrontName) => {
  cardsConfig.forEach((ccf, index) => {
    const card = new Card(scene, ccf.value, index, cardFrontName);
    card.load();
    cards.push(card);
  });
};

const getCards = () => cards;

const dealCards = (config) => {
  shuffledCardsConfig = config || shuffle(cardsConfig);
  const cache = [];
  shuffledCardsConfig.forEach((c, i) => {
    cards[c.value - 1].setIndex(i);
    cache.push(cards[c.value - 1]);
  });
  cards = cache;
  cards.forEach((card) => {
    card.add();
  });
};

const flipCards = () => {
  cards.forEach((card) => {
    card.flip();
  });
};

const flipCard = (card) => card.flip();

const battle = (ca, cb) => {
  if (ca.value > cb.value) {
    return "A";
  }
  return "B";
};

const getCardsConfig = () => shuffledCardsConfig;

export default {
  loadCards,
  getCards,
  dealCards,
  flipCards,
  flipCard,
  battle,
  getCardsConfig,
};
