(function() {
  jsForm();

  function jsForm() {
    // CSS classes
    const inputValidationErrorClass = "error";
    const inputValidationValidClass = "valid";
    const classHidden = "hidden";
    const preloaderHidden = "preloader--hidden";

    // input fields
    const cardNumberField = document.getElementById("card-number");
    const expiration = document.getElementById("expiration");
    const cvv = document.getElementById("cvv");
    const storeCardToggle = document.getElementById("store-card");
    const storeCardEmail = document.getElementById("store-card-email");
    const storeCardEmailField = document.querySelector(
      "#store-card-email input[type='email']"
    );
    const submitButton = document.querySelector("form .button--submit");
    const preloader = document.querySelector(".preloader");

    // disable submit button on load
    submitButton.disabled = true;

    // turn off html validation when js can be executed
    const forms = document.querySelectorAll(".js-form");

    if (!forms) {
      return console.log("forms not found");
    }

    forms.forEach(element => element.setAttribute("novalidate", "true"));

    // toggle email field to store card
    storeCardToggle.addEventListener("click", () => {
      if (
        storeCardToggle.checked &&
        storeCardEmail.classList.contains(classHidden)
      ) {
        storeCardEmail.classList.remove(classHidden);
      } else {
        if (!storeCardEmail.classList.contains(classHidden)) {
          storeCardEmail.classList.add(classHidden);
        }
      }
    });

    //format card number on input
    cardNumberField.addEventListener("input", formatCardNumber);

    function formatCardNumber(ev) {
      let input = ev.target.value.replace(/\D/g, "");
      ev.target.value = input
        .replace(/(\d{4})(\d{1})/, "$1 $2")
        .replace(/(\d{4}) (\d{4})(\d{1})/, "$1 $2 $3")
        .replace(/(\d{4}) (\d{4}) (\d{4})(\d{1})/, "$1 $2 $3 $4");
    }

    //check card number with Luhn algorithm
    cardNumberField.addEventListener("input", validateCardNumber);
    function validateCardNumber(ev) {
      let number = ev.target.value.replace(/\D/g, "");
      if (number.length === 16) {
        // console.log("card number length is 16 " + number);
        let sum = 0;

        for (let i = number.length - 1; i >= 0; i--) {
          let digit = parseInt(number.charAt(i));

          if (i % 2 === 1) {
            sum += digit;
          } else {
            if (digit * 2 > 9) {
              sum += digit * 2 - 9;
            } else {
              sum += digit * 2;
            }
          }
        }
        // console.log("sum is " + sum);
        return sum % 10 === 0;
      }
    }

    // format expiration date field
    expiration.addEventListener("input", formatExpDate);

    function formatExpDate(ev) {
      let input = ev.target.value
        .replace(/(^\d{1}[/])(\d{2})/, "0$1$2")
        .replace(/(\d{2})(\d{1})/, "$1/$2");
      ev.target.value = input;
    }

    // validate expiration date field
    expiration.addEventListener("input", validateExpDate);
    function validateExpDate(ev) {
      if (ev.target.value.length === 5) {
        let inputArr = ev.target.value.split("/");
        let currentDate = new Date(Date.now());
        let currentYear = parseInt((currentDate.getFullYear() + "").slice(-2));
        let currentMonth = currentDate.getMonth() + 1;
        let inputMonth = parseInt(inputArr[0]);
        let inputYear = parseInt(inputArr[1]);

        if (inputMonth > 12 || inputMonth < 1) {
          return false;
        } else {
          return (
            (currentYear === inputYear && currentMonth <= inputMonth) ||
            inputYear > currentYear
          );
        }
      }
    }

    // format CVV field
    cvv.addEventListener("input", formatCvv);
    function formatCvv(ev) {
      ev.target.value = ev.target.value.replace(/\D/g, "");
    }

    // validate CVV

    // const inputRequired = document.querySelectorAll("input[required]");
    // const expirationField = document.querySelector("input[type='email']");
    // const cvvField = document.querySelector("input[type='password'][required]");

    storeCardEmailField.addEventListener("input", function(ev) {
      console.log("email input detected");
      validateInput();
    });

    submitButton.addEventListener("click", submitForm);

    function submitForm(ev) {
      // console.log("clicked");
      ev.preventDefault();
      // if (validateInput()) {
      if (true) {
        sendData();
        submitButton.disabled = true;

        // console.log("success!!!");
      }
    }

    function sendData() {
      preloader.classList.toggle(preloaderHidden);
      setTimeout(() => {
        preloader.classList.toggle(preloaderHidden);
        alert("All done!");
      }, 2000);
    }

    function validateInput() {
      validateEmail();
      if (validateEmail()) {
        submitButton.disabled = false;
        return true;
      } else {
        submitButton.disabled = true;
        return false;
      }
    }

    function validateEmail() {
      const emailRe = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (
        // storeCardEmail.value.trim() === "" ||
        !emailRe.test(storeCardEmailField.value.trim())
      ) {
        !storeCardEmailField.classList.contains(inputValidationErrorClass) &&
          storeCardEmailField.classList.add(inputValidationErrorClass);
        return false;
      } else {
        storeCardEmailField.value = storeCardEmailField.value.trim();
        storeCardEmailField.classList.remove(inputValidationErrorClass);
        storeCardEmailField.classList.add(inputValidationValidClass);
        return true;
      }
    }
  }
})();
