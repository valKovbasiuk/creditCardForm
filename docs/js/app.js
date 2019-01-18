(function() {
  jsForm();

  function jsForm() {
    const classJsValidation = "js-validate";
    const jsForm = document.querySelector("form.js-form");
    var jsValidationFields = jsForm.querySelectorAll(`.${classJsValidation}`);
    let isFormValidated;

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
    storeCardToggle.addEventListener("click", ev => {
      if (
        storeCardToggle.checked &&
        storeCardEmail.classList.contains(classHidden)
      ) {
        storeCardEmail.classList.remove(classHidden);
        storeCardEmailField.classList.add(classJsValidation);
        jsValidationFields = jsForm.querySelectorAll(`.${classJsValidation}`);
        validateForm();
      } else {
        if (!storeCardEmail.classList.contains(classHidden)) {
          storeCardEmail.classList.add(classHidden);
          storeCardEmailField.classList.remove(classJsValidation);
          jsValidationFields = jsForm.querySelectorAll(`.${classJsValidation}`);
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
      let result = false;
      if (number.length === 16) {
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
        result = sum % 10 === 0;
      }
      changeClass(
        ev.target,
        result,
        inputValidationValidClass,
        inputValidationErrorClass
      );
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
      let result = false;
      if (ev.target.value.length === 5) {
        let inputArr = ev.target.value.split("/");
        let currentDate = new Date(Date.now());
        let currentYear = parseInt((currentDate.getFullYear() + "").slice(-2));
        let currentMonth = currentDate.getMonth() + 1;
        let inputMonth = parseInt(inputArr[0]);
        let inputYear = parseInt(inputArr[1]);

        if (inputMonth > 12 || inputMonth < 1) {
          result = false;
        } else {
          result =
            (currentYear === inputYear && currentMonth <= inputMonth) ||
            inputYear > currentYear;
        }
      }

      changeClass(
        ev.target,
        result,
        inputValidationValidClass,
        inputValidationErrorClass
      );
    }

    // validate CVV field
    cvv.addEventListener("input", validateCvv);
    function validateCvv(ev) {
      let result = false;
      ev.target.value = ev.target.value.replace(/\D/g, "");
      if (ev.target.value.length === 3) {
        result = true;
      }

      changeClass(
        ev.target,
        result,
        inputValidationValidClass,
        inputValidationErrorClass
      );
    }

    storeCardEmailField.addEventListener("input", function(ev) {
      validateEmail();
    });

    submitButton.addEventListener("click", submitForm);

    function submitForm(ev) {
      ev.preventDefault();
      if (true) {
        sendData();
        submitButton.disabled = true;

      }
    }

    function sendData() {
      preloader.classList.toggle(preloaderHidden);
      setTimeout(() => {
        preloader.classList.toggle(preloaderHidden);
        alert("Your card successfully submitted!");
      }, 2000);
    }

    function validateEmail() {
      const emailRe = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (!emailRe.test(storeCardEmailField.value.trim())) {
        (!storeCardEmailField.classList.contains(inputValidationErrorClass) &&
          storeCardEmailField.classList.remove(inputValidationValidClass)) ||
          storeCardEmailField.classList.add(inputValidationErrorClass);
      } else {
        storeCardEmailField.value = storeCardEmailField.value.trim();
        storeCardEmailField.classList.remove(inputValidationErrorClass);
        storeCardEmailField.classList.add(inputValidationValidClass);
      }
    }

    // check if all validated
    jsForm.addEventListener("input", validateForm);

    function validateForm() {
      let isFieldsValid = [];
      jsValidationFields.forEach(element => {
        isFieldsValid.push(
          element.classList.contains(inputValidationValidClass)
        );
      });

      if (isFieldsValid.every(field => field)) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
    }

    function changeClass(element, outcome, trueClass, falseClass) {
      if (outcome) {
        if (!element.classList.contains(trueClass)) {
          element.classList.add(trueClass);
        }
        if (element.classList.contains(falseClass)) {
          element.classList.remove(falseClass);
        }
      } else {
        if (!element.classList.contains(falseClass)) {
          element.classList.add(falseClass);
        }
        if (element.classList.contains(trueClass)) {
          element.classList.remove(trueClass);
        }
      }
    }
  }
})();
