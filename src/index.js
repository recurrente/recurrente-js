class Recurrente {
  constructor(key) {
    this.publicKey = key
    this.setup()
  }

  static init(key) {
    return new Recurrente(key)
  }

  createCheckout(button) {
    const outerThis = this
    fetch(`https://app.recurrente.com/api/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PUBLIC-KEY": this.publicKey,
      }, body: JSON.stringify({
        items: [{
          price_id: this._priceId(button),
          quantity: this._quantity(button),
        }],
      })
    }).then(function (result) {
      return result.json();
    }).then(function (data) {
      if (data.checkout_url) {
        outerThis.redirectToCheckout(data.checkout_url)
      } else {
        console.log(data)
      }
    })
  }

  _priceId(button) {
    return button.getAttribute("data-recurrente-price-id") || this.priceId
  }

  _quantity(button) {
    return button.getAttribute("data-recurrente-quantity") || this.quantity || 1
  }

  redirectToCheckout(url) {
    window.location = url
  }

  setup() {
    const outerThis = this
    const submitButtons = Array.from(document.querySelectorAll("[data-recurrente-button]"))
    if (submitButtons.length > 0) {
      submitButtons.map((submitButton) => {
        submitButton.addEventListener("click", function () {
          outerThis.createCheckout(submitButton)
        })
      })
    }
  }
}

window.Recurrente = Recurrente
module.exports = {
  Recurrente,
  default: Recurrente,
}
