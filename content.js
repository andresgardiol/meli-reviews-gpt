// Retrieve the main title of the page
var pageTitle = document.querySelector("h1").innerText;

// Retrieve the user's Open AI API token from the extension's storage
chrome.storage.sync.get(["openaiToken","textToSpeechToken"], async function (data) {
  console.log(data)
  var openaiToken = data.openaiToken;
  let productID = getProductID();
  const reviews = await getAllReviews(productID);
  const parsedReviews = getParsedReviews(reviews);

  var prompt = getPrompt(parsedReviews);

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
  const reviewsSummary = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      return data.choices[0].message.content;
    }).catch((error) => {
      console.log(error);
      return null;
    });

  const pageTitleElement = document.querySelector(
        "section[data-testid='reviews-desktop']"
  );
  pageTitleElement.insertAdjacentHTML(
        "beforebegin",
        `<div class="ui-pdp-container__row">
            <div class="ui-pdp-container__col col-1">
              <div class="mb-45 ui-box-component-pdp__visible--desktop ui-pdp-collapsable--is-collapsed">
                  <h2 class="ui-pdp-description__title">✨ Resumen de reviews</h2>
                  <p class="ui-pdp-description__content">${reviewsSummary}<br></p>
              </div>
            </div>
          </div>`
  );

    // Retrieve the user's text to speech API token from the extension's storage
    var textToSpeechToken = data.textToSpeechToken;
    var textToSpeechRequestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "audioConfig": {
                "audioEncoding": "MP3",
                "effectsProfileId": [
                    "small-bluetooth-speaker-class-device"
                ],
                "pitch": 0,
                "speakingRate": 1.0
            },
            "input": {
                "text": `${reviewsSummary}`
            },
            "voice": {
                "languageCode": "es-US",
                "name": "es-US-Studio-B"
            }
        }),
    }

    const textToSpeechResponse = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + textToSpeechToken, textToSpeechRequestOptions)
        .then((response) => response.json())
        .then((data) => {
            return data.audioContent;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
    console.log(textToSpeechResponse);
});

function getProductID() {
  const actualURL = window.location.href;
  const id = actualURL.split("/p/")[1].split("#")[0];
  console.log(id);
  return id;
}

function getParsedReviews(reviews) {
  return reviews
      .map(
          (review) =>
              `rating: ${review.rating}; título: "${review.title}; comentario: "${review.comment}"`
      )
      .join("\n");
}

function getPrompt(parsedReviews) {
  return `Crea un resumen a partir de las siguientes reviews del producto. 
    Analiza cada review y descarta las que no son relevantes para el producto o no son útiles. 
    El título del producto es '${pageTitle}'. 
    El resumen debe incluir los puntos más importantes y los pros y contras (si es que se encuentran) del producto. 
    Escribe en un lenguaje formal.
    Cada review se encuentra en una nueva línea. 
    Las reviews son las siguientes:
    
    ${parsedReviews}`;
}

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
