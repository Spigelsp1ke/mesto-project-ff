import {initialCards} from "./scripts/cards.js";
import './pages/index.css';
// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const places = document.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(cardItem, deleteCard) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardItem.link;
  cardImage.alt = cardItem.name;
  cardTitle.textContent = cardItem.name;

  deleteButton.addEventListener("click", function() {
    deleteCard(cardElement)
  });

  return cardElement;
}
// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
function addCard(cardItem) {
  const cardElement = createCard(cardItem, deleteCard);
  places.append(cardElement);
};

function renderCards() {
  initialCards.forEach(addCard);
}

renderCards();