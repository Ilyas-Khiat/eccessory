import {x} from "../test.js";
import { similarity } from "../sortbysim.js";
import { auth,database,app } from "../firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, set, ref, update,get,push,remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";


// Cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
let shop = document.getElementById("shop");

let user = auth.currentUser;
let productsRef;
let uid;



// Open Cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};
// Close Cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Cart Working JS
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Making Function
function ready() {

    
    let cartHistoric;
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
            uid = user.uid;
            productsRef = ref(database, "users/"+uid+"/cart");
            get(productsRef)
                .then((snapshot) => {
                    cartHistoric = snapshot.val();
                    if (cartHistoric) {
                       let products_array =Object.keys(cartHistoric);
                    for (let i = 0; i < products_array.length; i++) {
                        // const element = products_array[i];
                        let title = cartHistoric[products_array[i]].title;
                        let price = cartHistoric[products_array[i]].price;
                        let productImg = cartHistoric[products_array[i]].productImg;
                        addProductToCart(title,price,productImg);

                    } 
                    }
                    updateTotal(); 
                }
                )
                .catch((err) => {
                    console.error(err);
                });
            
          //bla bla bla
          // ...
        } else {
          // User is signed out
          // ...
          //bla bla bla
        }
      });
    
    // Remove items from cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");

    for (var i = 0; i < removeCartButtons.length; i++){
        var button = removeCartButtons[i];
        
        button.addEventListener("click", removeCartItem);
    }
    // Quantity changes
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    // Add to Cart
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);  
    }
    
    // Buy Button
    document.getElementsByClassName("btn-buy")[0].addEventListener("click", buyButtonClicked);
}

// Buy Button
function buyButtonClicked() {
    alert("Your order is placed");
    var cartContent = document.getElementsByClassName("cart-content")[0];
    while(cartContent.hasChildNodes()){
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
}

// Remove items from cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    let element= buttonClicked.parentElement;
    
    let title = element.getElementsByClassName("cart-product-title")[0].innerText;
    element.remove();
    console.log(title);
    remove(ref(database, "users/"+uid+"/cart/"+title))
            .then(() => {
                console.log('Deletion successful.');
            })
            .catch((error) => {
                console.error('Error deleting:', error);
            });
    updateTotal();
}

// Quantity changes
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateTotal();
}

// Add to Cart
function addCartClicked(event) {
    var button = event.target;
    console.log(button);
    button.classList.add('shake');
    cartIcon.classList.add('shakescale');
    const duration = 2000; // Duration in milliseconds
    setTimeout(() => {
    button.classList.remove('shake');
    cartIcon.classList.remove('shakescale');
    }, duration);
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    
    addProductToCart(title, price, productImg);
    console.log(uid);
    console.log(get(productsRef));
    updateTotal();
}

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    // console.log(cartItems);
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");

    let product_t = {title:title,
                    price:price,
                    productImg:productImg};

    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            return;
        }
    }
    var cartBoxContent = `
                        <img src="${productImg}" alt="" class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" value="1" class="cart-quantity">
                        </div>
                        <!-- Remove Cart Icon -->
                        <i class="bx bxs-trash-alt cart-remove" ></i>`;
    cartShopBox.innerHTML = cartBoxContent;

    cartItems.append(cartShopBox);

    const updates = {};
    updates[title] = product_t;
    update(productsRef,updates);

    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
}

// Update Total
function updateTotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
    // if price contain some cents value
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}

function addProduct() {
    let product = document.createElement("div");
    product.classList.add("product-box");
    product.innerHTML =`<img src="img/product2.jpg" alt="p2" class="product-img">
                        <h2 class="product-title">WIRELESS EARBUDS</h2>
                        <span class="price">$15</span>
                        <i class="bx bx-shopping-bag add-cart"></i>`
    let shopItems = document.getElementsByClassName("shop-content");
    shopItems[0].append(product);
    ready();
    product.getElementsByClassName("add-cart")[0].addEventListener("click", addCartClicked);
  }

function goTosignPage() {
    window.location.href = "signup.html";
}

//cartIcon.addEventListener("click",() => console.log(data));


function searchItem() {
    let searchString = shop.getElementsByClassName("input-search")[0].value;
    if (searchString == "") {
        return;
    }
    console.log(similarity(searchString,"abc"));
    let shopItems = document.getElementsByClassName("shop-content");
    const elems = [...document.querySelectorAll(".product-box")];
    elems.sort(function (a, b) {
        if (similarity(a.children[1].innerText,searchString) > similarity(b.children[1].innerText,searchString)) {
          return -1;
        }
        if (similarity(a.children[1].innerText,searchString) < similarity(b.children[1].innerText,searchString)) {
          return 1;
        }
        return 0;
      });
    const outputHtml = elems.reduce((a, el) => a + el.outerHTML, "");

    shopItems[0].innerHTML = outputHtml ;

    ready();
}

let btnSearch =shop.getElementsByClassName("btn-search")[0];
btnSearch.addEventListener("click",searchItem);

addProduct()
  