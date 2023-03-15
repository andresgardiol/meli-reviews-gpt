// Retrieve the main title of the page
var pageTitle = document.querySelector("h1").innerText;

// Retrieve the user's Open AI API token from the extension's storage
chrome.storage.sync.get("openaiToken", function (data) {
  var openaiToken = data.openaiToken;

  // Use the Open AI API to generate a product description
  var prompt =
    "Genera una descripcion corta para el siguiente producto: " + pageTitle;
  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + openaiToken,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  };
  fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      var productDescription = data.choices[0].message.content;

      var pageTitleElement = document.querySelector(
        "section[data-testid='reviews-desktop']"
      );
      pageTitleElement.insertAdjacentHTML(
        "beforebegin",
        `<div class="ui-pdp-container__row"><div class="ui-pdp-container__col col-1"><div class="mb-45 ui-box-component-pdp__visible--desktop ui-pdp-collapsable--is-collapsed"><h2 class="ui-pdp-description__title">✨ Resumen de reviews</h2><p class="ui-pdp-description__content">${productDescription}<br></p></div></div></div>`
      );
    })
    .catch((error) => console.log(error));
});

async function getAllReviews(productId) {
  const allReviews = [];

  for (let rating = 1; rating <= 5; rating++) {
    const url = `https://www.mercadolibre.com.ar/noindex/catalog/reviews/${productId}/search?objectId=${productId}&siteId=MLA&isItem=false&rating=${rating}&limit=5&x-is-webview=false`;

    const response = await fetch(url);

    if (!response.ok) {
      console.log("Error fetching reviews");
    }

    const data = await response.json();

    allReviews.push(
      ...data.reviews.map((review) => ({
        rating: review.rating,
        title: review.title.text,
        comment: review.comment.content.text,
      }))
    );
  }

  return allReviews;
}
