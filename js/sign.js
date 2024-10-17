const isGitHubPages = window.location.hostname === "abdelrouaf.github.io";
const path = isGitHubPages ? "/ShoppingCart/main.html" : "../main.html";

const toastBox = document.getElementById('toastBox')

const addedMsg = '<i class="fa-solid fa-circle-check"></i> Added to cart successfully'

const updateMsg = '<i class="fa-solid fa-circle-check"></i> Updated successfully'

const deleteMsg = '<i class="fa-solid fa-circle-exclamation"></i> Deleted successfully'

const deleteAllMsg = '<i class="fa-solid fa-circle-exclamation"></i> All deleted successfully'

const signInSuccess = '<i class="fa-solid fa-circle-check"></i> Sign in successfully'

const existUser = '<i class="fa-solid fa-circle-xmark"></i> error! user already exist'

const incorrectSign = `<i class="fa-solid fa-circle-xmark"></i> error! Email or password incorrect`

const userNotFoundMsg = `<i class="fa-solid fa-circle-xmark"></i> error! user not found`

const signUpSuccess = '<i class="fa-solid fa-circle-check"></i> Sign up successfully'

const invalidMsg = '<i class="fa-solid fa-circle-exclamation"></i> Invalid input'

const signUpBtn = document.getElementById('signUpBtn')
const signInBtn = document.getElementById('signInBtn')
const signIn = document.getElementById('signIn')
const signUp = document.getElementById('signUp')

// Change Form to Sign up
signUpBtn.addEventListener('click', () => {
    signIn.classList.remove('active')
    signUp.classList.add('active')
})

// Change Form to Sign In
signInBtn.addEventListener('click', () => {
    signIn.classList.add('active')
    signUp.classList.remove('active')
})

// ********* //

const signUpForm = document.getElementById("signUpForm")
const registerName = document.getElementById("registerName")
const registerEmail = document.getElementById("registerEmail")
const registerPassword = document.getElementById("registerPassword")
const changePasswordType = document.getElementById('changePasswordType')
const passwordFeedback = document.getElementById('passwordFeedback')

changePasswordType.style.width = '20px'
changePasswordType.style.height = '20px'

changePasswordType.addEventListener('click', () => {
    if (registerPassword.classList.contains('active')) {
        registerPassword.type = 'password';
        registerPassword.classList.remove('active');
        changePasswordType.classList.add('fa-eye')
        changePasswordType.classList.remove('fa-eye-slash')
    } else {
        registerPassword.type = 'text';
        registerPassword.classList.add('active');
        changePasswordType.classList.remove('fa-eye')
        changePasswordType.classList.add('fa-eye-slash')
    }
});

// Validate Password
function validatePassword() {
    const password = registerPassword.value

    const len = 8;
    const lowChar = /[a-z]/.test(password);
    const uppChar = /[A-Z]/.test(password);
    const nums = /[1-9]/.test(password)
    const specChar = /[!@#$%^&*]/.test(password)

    if ( password.length < len ) {
        passwordFeedback.textContent = `Password must be at least ${len} characters `;
        passwordFeedback.style.color = 'red'
    } else if ( !lowChar || ! uppChar || !nums || !specChar ) {
        passwordFeedback.textContent = `Password must has lower, upper, numbers and special characters `;
        passwordFeedback.style.color = 'red'
    } else {
        passwordFeedback.textContent = `Password is strong!`;
        passwordFeedback.style.color = 'green'
    }
}

registerPassword.addEventListener('input', validatePassword);
registerPassword.addEventListener('change', validatePassword);

// Submit Data
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = {
        name: registerName.value,
        email: registerEmail.value,
        password: registerPassword.value,
        cart: []
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(existingUser => existingUser.email === user.email);
    if (userExists) {
        showToast('<i class="fa-solid fa-circle-exclamation"></i> User already exists');
        return;
    }

    if (user.name === '' || user.email === '' || user.password === '') {
        showToast(invalidMsg)
        return
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));   

    signUpForm.reset()
    passwordFeedback.textContent = ''

    showToast(signUpSuccess)
})

// ******* //

const signInForm = document.getElementById('signInForm');
const userEmail = document.getElementById('userEmail')
const userPassword = document.getElementById('userPassword')
const changeSignInPasswordType = document.getElementById("changeSignInPasswordType")

changeSignInPasswordType.style.width = '20px'
changeSignInPasswordType.style.height = '20px'

changeSignInPasswordType.addEventListener('click', () => {
    if (userPassword.classList.contains('active')) {
        userPassword.type = 'password';
        userPassword.classList.remove('active');
        changeSignInPasswordType.classList.add('fa-eye')
        changeSignInPasswordType.classList.remove('fa-eye-slash')
    } else {
        userPassword.type = 'text';
        userPassword.classList.add('active');
        changeSignInPasswordType.classList.remove('fa-eye')
        changeSignInPasswordType.classList.add('fa-eye-slash')
    }
});

signInForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const user = {
        email: userEmail.value,
        password: userPassword.value
    }

    const users = JSON.parse(localStorage.getItem('users')) || []
    const userExist = users.find( existingUser => existingUser.email === user.email )

    if ( user.email === '' || user.password === '' ) {
        showToast(invalidMsg)
    } else if ( userExist ) {
        if ( userExist.password === user.password ) {
            showToast(signInSuccess)
            localStorage.setItem('loggedInUser', JSON.stringify(userExist));
            localStorage.setItem('userIn', true)
            setTimeout(() => {
                window.location.href = path;
            }, 2000);
        } else {
            showToast(incorrectSign)
        }
    } else {
        showToast(userNotFoundMsg)
    }

    signInForm.reset();

})

// Notification Function
function showToast(msg) {
    const toast = document.createElement('div')
    toast.classList.add('toast')
    toast.innerHTML = msg
    toastBox.append(toast)

    if(msg.includes('error')) {
        toast.classList.add('error')
    }

    if(msg.includes('Invalid')) {
        toast.classList.add('invalid')
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.remove()
    }, 6500);
}