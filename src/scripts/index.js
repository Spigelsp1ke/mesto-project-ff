//import { initialCards } from "./cards.js";
import { createCard, deleteCard, likeCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import "../pages/index.css";
import { enableValidation,clearValidation } from "./validation.js";
import { getProfile, getInitialCards, updateProfile, uploadNewCard, updateAvatar } from "./api.js";
// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// DOM узлы
const places = document.querySelector(".places__list");

// переменные
const editButton = document.querySelector(".profile__edit-button");
const editPopup = document.querySelector(".popup_type_edit");
const addPopup = document.querySelector(".popup_type_new-card");
const closeButtons = document.querySelectorAll(".popup__close");
const addButton = document.querySelector(".profile__add-button");
const popupButtons = document.querySelectorAll(".popup__button");

const profileTitle = document.querySelector(".profile__title");
const profileDesc = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupTitle = imagePopup.querySelector(".popup__caption");

const profileFormElement = document.forms["edit-profile"];
const nameInput = profileFormElement.querySelector(".popup__input_type_name");
const jobInput = profileFormElement.querySelector(".popup__input_type_description");

const cardFormElement = document.forms["new-place"];
const cardNameInput = cardFormElement.querySelector(".popup__input_type_card-name");
const cardImageInput = cardFormElement.querySelector(".popup__input_type_url");

const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarForm = document.forms["avatar-form"];
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");
const avatarEditArea = document.querySelector(".profile__image-container");

let userId = null;

function renderLoading(isLoading) {
  if (isLoading) {
    popupButtons.forEach(function(popupButton){
      popupButton.textContent = "Сохранение..."
  })
  } else {
    popupButtons.forEach(function(popupButton){
      popupButton.textContent = "Сохранить"
  })
  }
}

Promise.all([getProfile(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;

    profileTitle.textContent = userData.name;
    profileDesc.textContent = userData.about;
    profileImage.src = userData.avatar;

    cards.reverse().forEach((cardItem) => {
      addCard({ ...cardItem, userId });
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });


const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

enableValidation(validationConfig);

// Вывести карточки на страницу
function addCard(cardItem) {
  const cardElement = createCard(cardItem, userId, deleteCard, openImagePopup, likeCard, cardTemplate);
  places.prepend(cardElement);
}


// обработчик кликов на кнопки
editButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDesc.textContent;

  clearValidation(profileFormElement, validationConfig);

  openModal(editPopup);
});

addButton.addEventListener("click", function () {
  cardFormElement.reset();
  clearValidation(cardFormElement, validationConfig);

  openModal(addPopup);
});

avatarEditArea.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// закрытие попапов по кнопке закрытия и оверлею
closeButtons.forEach(function (button) {
  const popup = button.closest(".popup");
  button.addEventListener("click", () => closeModal(popup));
  popup.addEventListener("mousedown", function (evt) {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

// открытие попапа с картинкой
function openImagePopup(link, name) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupTitle.textContent = name;
  openModal(imagePopup);
}
// изменение информации в профиле
function handleProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(true);
  updateProfile(nameInput.value, jobInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDesc.textContent = userData.about;
      closeModal(editPopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => renderLoading(false));

  closeModal(editPopup);
}

profileFormElement.addEventListener("submit", handleProfileSubmit);
// добавление новых карточек
function handleCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(true);
  uploadNewCard(cardNameInput.value, cardImageInput.value)
    .then((newCardItem) => {
      addCard(newCardItem);

      closeModal(addPopup);
    
      cardFormElement.reset();
    })
    .catch((err) => {
      console.error("Ошибка при отправке карточки:", err);
    })
    .finally(() => renderLoading(false));

}

cardFormElement.addEventListener("submit", handleCardSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(true);
  updateAvatar(avatarInput.value)
    .then((userData) => {
      profileImage.src = userData.avatar;
      closeModal(avatarPopup);
    })
    .catch((err) => console.error(err))
    .finally(() => renderLoading(false));
}

avatarForm.addEventListener("submit", handleAvatarSubmit);