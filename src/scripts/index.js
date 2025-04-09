import {initialCards} from "./cards.js";
import {createCard, deleteCard, likeCard} from "./card.js";
import {openModal, closeModal} from "./modal.js";
import '../pages/index.css';
// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// DOM узлы
const places = document.querySelector(".places__list");

// переменные
const popups = document.querySelectorAll('.popup');
const editButton = document.querySelector('.profile__edit-button');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');
const addButton = document.querySelector('.profile__add-button');

const profileTitle = document.querySelector('.profile__title');
const profileDesc = document.querySelector('.profile__description');

// функция обработки клика на изображение
function handleImageClick(item) {
  openImagePopup(item.link, item.name);
};

// Вывести карточки на страницу
function addCard(cardItem) {
  const cardElement = createCard(cardItem, deleteCard, handleImageClick, likeCard, cardTemplate);
  places.prepend(cardElement);
};

function renderCards() {
  initialCards.forEach(addCard);
};

renderCards();

// обработчик кликов на кнопки
editButton.addEventListener('click', function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDesc.textContent;

  openModal(editPopup);
});

addButton.addEventListener('click', function () {
  openModal(addPopup);
});
// закрытия попапов по кнопке закрытия и оверлею
closeButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const popup = button.closest('.popup');
    closeModal(popup);
 });
});

popups.forEach(function(pop) {
  pop.addEventListener('click', function (evt) {
    if (evt.target === pop) {
      closeModal(pop);
    };
  });
});

// открытие попапа с картинкой
function openImagePopup(link, name) {
  const imagePopup = document.querySelector('.popup_type_image');
  const imagePopupSrc = imagePopup.querySelector('.popup__image');
  const imagePopupTitle = imagePopup.querySelector('.popup__caption');

  imagePopupSrc.src = link;
  imagePopupTitle.textContent = name;
  openModal(imagePopup);
};
// изменение информации в профиле и переменные для этого
const formElement = document.querySelector('.popup__form');

const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

function handleFormSubmit(evt) {
    evt.preventDefault();

    profileTitle.textContent = nameInput.value;
    profileDesc.textContent = jobInput.value;

    closeModal(editPopup);
};

formElement.addEventListener('submit', handleFormSubmit);
// добавление новых карточек и переменные для этого
// поиск формы по имени, потому что у формы изменения и добавления одиннаковые классы.
// поиск по имени через квадратные скобки, потому что имя формы с дефисом
const cardFormElement = document.forms["new-place"];

const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const imageInput = cardFormElement.querySelector('.popup__input_type_url');

function handleCardSubmit(evt) {
    evt.preventDefault();

    const newCardItem = {    
      name: cardNameInput.value,
      link: imageInput.value
    }

    addCard(newCardItem);

    closeModal(addPopup);

    cardFormElement.reset();
};

cardFormElement.addEventListener('submit', handleCardSubmit);