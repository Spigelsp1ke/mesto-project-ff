import { addLike, removeLike, deleteCardFromServer } from "./api.js";
// Функция создания карточки
function createCard(cardItem, userId, deleteCard, openImagePopup, likeCard, cardTemplate) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const cardId = cardItem._id;

  cardImage.src = cardItem.link;
  cardImage.alt = cardItem.name;
  cardTitle.textContent = cardItem.name;
  likeCount.textContent = cardItem.likes.length;

  if (cardItem.likes.some((user) => user._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (cardItem.owner._id !== userId) {
    deleteButton.style.display = "none";
  }

  deleteButton.addEventListener("click", function () {
    deleteCard(cardElement, cardId);
  });

  likeButton.addEventListener("click", function () {
    likeCard(likeButton, cardId, likeCount);
  });

  cardImage.addEventListener("click", function () {
    openImagePopup(cardItem.link, cardItem.name);
  });

  return cardElement;
}

// Функции удаления и лайка карточки
function deleteCard(cardElement, cardId) {
  deleteCardFromServer(cardId)
  .then(() => {
    cardElement.remove();
  })
  .catch((err) => {
    console.error("Ошибка при удалении карточки:", err);
  });
}

function likeCard(likeButton, cardId, likeCount) {
  const likeRequest = likeButton.classList.contains("card__like-button_is-active") ? removeLike : addLike

  likeRequest(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => console.error("Ошибка при обработке лайка:", err));
}

export { createCard, deleteCard, likeCard };
