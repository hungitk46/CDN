function initEvent() {

  const successView = document.querySelector("#success-view");
  const mainView = document.querySelector("#main-view");

  document.body
    .querySelector('#login-form')
    .addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new URLSearchParams(new FormData(e.target));
      if (data.get('newPassword') !== data.get('confirmNewPassword')) {
        return displayError("Password doesn't match");
      }
      fetch(e.target.action, {
        body: data,
        method: e.target.method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(res => {
        if (!res.ok) {
          return handleError(e);
        }
        successView.classList.toggle("is-hidden");
        mainView.classList.toggle("is-hidden");
      }).catch(e => handleError(e))
    });

  const togglePasswordVisibility = document.body.querySelector(
    '#toggle-password-visibility'
  );

  togglePasswordVisibility.addEventListener('click', function (e) {
    const isVisible = togglePasswordVisibility.innerHTML === 'visibility';
    togglePasswordVisibility.innerHTML = isVisible ?
      'visibility_off' :
      'visibility';
    document.getElementById('password').type = isVisible ?
      'password' :
      'text';
  });

  const toggleConfirmPasswordVisibility = document.body.querySelector(
    '#toggle-confirm-password-visibility'
  );
  toggleConfirmPasswordVisibility.addEventListener('click', function (e) {
    const isVisible = toggleConfirmPasswordVisibility.innerHTML === 'visibility';
    toggleConfirmPasswordVisibility.innerHTML = isVisible ?
      'visibility_off' :
      'visibility';
    document.getElementById('confirm-password').type = isVisible ?
      'password' :
      'text';
  });

  const textFields = document.querySelectorAll('.mdc-text-field');
  for (const tf of textFields) {
    mdc.textField.MDCTextField.attachTo(tf);
  }
  const buttons = document.querySelectorAll('.mdc-button');
  for (const button of buttons) {
    mdc.ripple.MDCRipple.attachTo(button);
  }
}

function initStyle(assets) {
  const globalStyle = document.head.querySelector('#globalStyle');
  globalStyle.href = assets.style;
  document.body.querySelector('#login').style.backgroundImage =
    "url('" + assets.background + "')";
  document.body.querySelector('.logo').style.backgroundImage =
    "url('" + assets.logo + "')";
}


function setLoading() {
  const submitButton = document.getElementById('submit-button');
  submitButton.classList.toggle('is-submitting');
  submitButton.disabled = true;
  submitButton.querySelector('#text').style.display = 'none';
  const spinner = document.body.querySelector('.spinner');
  spinner.style.display = 'block';
}

function setNonLoading() {
  const submitButton = document.getElementById('submit-button');
  submitButton.classList.toggle('is-submitting');
  submitButton.disabled = false;
  submitButton.querySelector('#text').style.display = 'block';
  const spinner = document.body.querySelector('.spinner');
  spinner.style.display = 'none';
}

function requestPasswordChange() {
  console.log('Not implemented')
}

function displayError(err) {
  const submitButton = document.getElementById('submit-button');
  submitButton.querySelector('#text').innerHTML =
    err;
  submitButton.classList.toggle('has-error');
  submitButton.disabled = true;
  setTimeout(function () {
    submitButton.querySelector('#text').innerHTML = 'CONFIRM';
    submitButton.classList.toggle('has-error');
    submitButton.disabled = false;
  }, 3000);
}

/**
 *
 * @description Initialize the application, run this after config is parse from window object
 * @param {*} config
 */
function initApp(config) {
  var {
    assets
  } = getTenantOptionsByName(config.auth0Tenant);
  initStyle(assets);
  initEvent();
}


var handleError = function (res) {
  var getErrorFunc = !!res ? getResponseError : getNetworkError;
  var error = getErrorFunc(res);
  displayError(error);
};

var getResponseError = function (res) {
  var body, text = res;
  if (!body || typeof body !== "object") {
    body = {};
  }
  passwordErrors = {
    PasswordStrengthError: "weakPasswordError",
    PasswordHistoryError: "passwordHistoryError",
    PasswordDictionaryError: "passwordDictError",
    PasswordNoUserInfoError: "passwordNoUserInfoError"
  };
  var error = passwordErrors[body.name] || "serverError";
  return error;
};

var getNetworkError = function (res) {
  var didTimeout = !!err.timeout;
  var error = didTimeout ? "timedoutError" : "networkError";
  return error;
};
