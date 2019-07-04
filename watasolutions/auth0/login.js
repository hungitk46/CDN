function initEvent(webAuth, realm) {

  const loginView = document.querySelector("#login-view");
  const forgotPasswordView = document.querySelector("#forgot-password-view");

  document.body
    .querySelector('#login-form')
    .addEventListener('submit', function (e) {
      e.preventDefault();
      login(webAuth, realm);
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

  const textFields = document.querySelectorAll('.mdc-text-field');
  for (const tf of textFields) {
    mdc.textField.MDCTextField.attachTo(tf);
  }

  const buttons = document.querySelectorAll('.mdc-button');
  for (const button of buttons) {
    mdc.ripple.MDCRipple.attachTo(button);
  }

  var toggleViewLinks = document.querySelectorAll('.toggle-show-view');
  for (const link of toggleViewLinks) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      loginView.classList.toggle("is-hidden");
      forgotPasswordView.classList.toggle("is-hidden");
    });
  }

  document.querySelector('#forgot-password-form')
    .addEventListener('submit', function (e) {
      e.preventDefault();
      forgotPassword();
    });

}

function setFormInputsState(parentElement, isDisabled, ...inputNames) {
  inputNames.forEach(inputName => {
    parentElement.querySelector(`input[name="${inputName}"]`).disabled = isDisabled;
  })
}

function initStyle(assets) {
  const globalStyle = document.head.querySelector('#globalStyle');
  globalStyle.href = assets.style;
  document.body.querySelector('#login').style.backgroundImage =
    "url('" + assets.background + "')";
  document.body.querySelector('.logo').style.backgroundImage =
    "url('" + assets.logo + "')";
}


function createWebAuth({
  realm,
  ...config
}) {
  var params = Object.assign({
      realm,
      domain: config.auth0Domain,
      clientID: config.clientID,
      redirectUri: config.callbackURL,
      responseType: 'code'
    },
    config.internalOptions
  );

  return new auth0.WebAuth(params);
}

function setLoading(elementId) {
  const submitButton = document.getElementById(elementId);
  submitButton.classList.toggle('is-submitting');
  submitButton.disabled = true;
  submitButton.querySelector('#text').style.display = 'none';
  const spinner = document.body.querySelector('.spinner');
  spinner.style.display = 'block';
}

function setNonLoading(elementId) {
  const submitButton = document.getElementById(elementId);
  submitButton.classList.toggle('is-submitting');
  submitButton.disabled = false;
  submitButton.querySelector('#text').style.display = 'block';
  const spinner = document.body.querySelector('.spinner');
  spinner.style.display = 'none';
}

function login(webAuth, realm) {
  setLoading('login-button');
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  webAuth.login({
      realm,
      username: username,
      password: password
    },
    function (err) {
      setTimeout(function () {
        setNonLoading('login-button');
        if (err) displayError('login-button', 'INCORRECT USERNAME OR PASSWORD');
      }, 3000);
    }
  );
}

function forgotPassword() {
  setLoading('forgot-password-button');
  const email = document.querySelector('#email').value;
  if (email !== undefined && email !== null && email !== '') {
    fetch(`${serverUrl}/api/v1/users/forgotpassword`, {
      body: JSON.stringify({
        Email: email
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      setNonLoading('forgot-password-button');
      if (!res.ok) {
        displayError('forgot-password-button', 'Email is not exits.');
      } else {
        alert('An email was sent to your mailbox, please re-check.');
        window.location.reload(false);
      }
    }).catch(e => function (e) {
      setNonLoading('forgot-password-button');
      displayError('forgot-password-button', e.Message);
    })
  } else {
    return displayError('forgot-password-button', "Email for request password must not be empty.");
  }

}

function displayError(elementId, err) {
  const submitButton = document.getElementById(elementId);
  const defaultText = submitButton.innerText;

  submitButton.querySelector('#text').innerHTML = err;
  submitButton.classList.toggle('has-error');
  submitButton.disabled = true;
  setTimeout(function () {
    submitButton.querySelector('#text').innerHTML = defaultText;
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
    realm,
    assets
  } = getTenantOptionsByName(config.auth0Tenant);
  var webAuth = createWebAuth({
    realm,
    ...config
  });
  initStyle(assets);
  initEvent(webAuth, realm);
}
