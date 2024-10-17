function checkUserIn() {
    if ( localStorage.getItem('userIn') === 'false' || localStorage.getItem('userIn') === null ) {
        window.location.href = '../index.html'
    }
}
checkUserIn();

const userProfile = document.getElementById("userProfile");
const userDetail = document.getElementById('userDetail')

userProfile.addEventListener('click', (event) => {
    userDetail.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!userDetail.contains(event.target) && !userProfile.contains(event.target)) {
        userDetail.classList.remove('active'); 
    }
});

userDetail.addEventListener('click', (event) => {
    event.stopPropagation(); 
});

// ******** //
const logout = document.getElementById("logout")

logout.addEventListener('click', (e) => {

    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userIn');
    showToast('<i class="fa-solid fa-circle-check"></i> Logging out')
    setTimeout(() => {
        window.location.href = '../index.html'
    }, 3000);

})

function displayUserDetails() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        document.getElementById('userName').textContent = loggedInUser.name;
        document.getElementById('userEmail').textContent = loggedInUser.email;
    } 
}

displayUserDetails()

// ********* //

// Fetch Data 

async function fetchData() {
    const loadingElement = document.getElementById('loading');
    const productItem = document.getElementById("productItem")
    const head = document.getElementById("head")

    try {
    
        loadingElement.style.display = 'block';
        productItem.style.display = 'none';
        head.style.display = 'none';
    
        const response = await fetch('https://dummyjson.com/products')
        const data = await response.json();
        const products = data.products;
    
        let container = ''
    
        for ( var i = 0; i < products.length; i++ ) {
            container += 
            `
                <div class="col-md-6 col-lg-4">

                    <div class="card">

                        <div class="image">

                            <img src=${products[i].images[0]} alt="">

                        </div>

                        <div class="titles">

                            <p class="category">${products[i].category}</p>

                            <h4 class="productTitle">${products[i].title}</h4>

                            <p class="description">${products[i].description}</p>

                            <div class="d-flex justify-content-between align-items-center mt-3">

                                <p class="price"><span class='newPrice'>${products[i].discountPercentage} $ </span><span class='oldPrice'>${products[i].price} $</span></p>

                                <button class="cartBtn" onclick="addToCart(${products[i].id})" type="button">add to cart <i class="fa-solid fa-bag-shopping"></i></button>

                            </div>

                        </div>

                    </div>

                </div>
            
            `
        }
    
        productItem.innerHTML = container;
        loadingElement.style.display = 'none';
        head.style.display = 'block';
        productItem.style.display = 'flex'; 
    
    } catch {
        showToast('<i class="fa-solid fa-circle-xmark"></i> error! fetching data')
    }
}

fetchData()

// Add to cart Function 
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const productExist = cart.find( productId => productId.id === id )

    if ( productExist ) {
        showToast('<i class="fa-solid fa-circle-info"></i> Invalid!, Product already in cart!');
        return;
    } 

    fetch('https://dummyjson.com/products/' + id) 
    .then( response => response.json() )
    .then( product => {
        cart.push(product)
        localStorage.setItem('cart', JSON.stringify(cart))
        showToast('<i class="fa-solid fa-circle-check"></i> Product added to cart successfully!');
        loggedInUser.cart.push(product);
        updateUserData(loggedInUser);
    } )
    .catch( () => {
        showToast('<i class="fa-solid fa-circle-xmark"></i> error adding product to cart!');
    })

    cartItems()

}

function updateUserData(updatedUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === updatedUser.email);

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser)); 
    }
}

// Cart Items 
const openCart = document.getElementById('openCart'); 
const userCart = document.getElementById('userCart'); 
const box = document.querySelector('.cart .box');

openCart.addEventListener('click', () => {
    if (!userCart.classList.contains('active')) {
        userCart.classList.add('active');
        userCart.style.opacity = '1';
        userCart.style.visibility = 'visible'; 
        document.body.style.overflow = 'hidden';
        cartItems();
    } else {
        userCart.classList.remove('active');
        userCart.style.opacity = '0';
        userCart.style.visibility = 'hidden'; 
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('click', (e) => {
    if (userCart.classList.contains('active') && !box.contains(e.target) && !openCart.contains(e.target)) {
        userCart.classList.remove('active');
        userCart.style.opacity = '0';
        userCart.style.visibility = 'hidden'; 
        document.body.style.overflow = 'auto';
    }
});

function cartItems() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const cart = loggedInUser.cart;

    const cartContainer = document.querySelector('.cart .box')

    let total = 0;

    cartContainer.innerHTML = `
        <h4 class="title d-flex justify-content-between align-items-center mb-5 border-bottom py-2">
            cart <i class="fa-brands fa-shopify"></i>
        </h4>
    `;

    if ( cart.length === 0 ) {
        cartContainer.innerHTML = '<p class="d-flex justify-content-center align-items-center h-100" style="color: red">Your cart is empty!</p>'
        return
    }

    for ( var i = 0; i < cart.length; i++ ) {
        total += cart[i].discountPercentage;
    
        cartContainer.innerHTML += 
        `
            <div class="item">

                <div class="h-100 d-flex align-items-center">

                    <div class="image">

                        <img src="${cart[i].images[0]}" alt="${cart[i].title}">
                    
                    </div>

                    <div class="details">

                        <h4 class="productTitle">${cart[i].title}</h4>
                    
                        <div class="d-flex justify-content-between align-items-center">
                        
                            <p class="price"> ${cart[i].discountPercentage} $</p>
                        
                            <button class="btn btn-danger text-capitalize" onclick="deleteItem(${cart[i].id})">delete <i class="fa-regular fa-trash-can"></i></button>
                        
                        </div>
                    
                    </div>
                
                </div>
            
            </div>
        
        `;
    
    }

    cartContainer.innerHTML += `
        <div class="totalPrice d-flex align-items-center justify-content-between">
            Total price: <span>${total.toFixed(2)}$</span>
        </div>
    `;
}

// Delete Item from cart
function deleteItem(id) {
    const cart = JSON.parse(localStorage.getItem('cart'))|| []
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const productIndex = cart.findIndex( product => product.id === id )
    const userProductIndex = loggedInUser.cart.findIndex(product => product.id === id);

    if ( productIndex !== -1 ) {
        cart.splice(productIndex, 1)
        if (userProductIndex !== -1) {
            loggedInUser.cart.splice(userProductIndex, 1); 
            updateUserData(loggedInUser); 
        }
    
        localStorage.setItem('cart', JSON.stringify(cart))
    
        cartItems()
    
        showToast('<i class="fa-solid fa-circle-check"></i> Product removed from cart successfully!');
    } else {
        showToast('<i class="fa-solid fa-circle-info"></i> Invalid!, Product not found in the cart.');
    }

}

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