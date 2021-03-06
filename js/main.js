//API from https://fakestoreapi.com/
const API = 'https://fakestoreapi.com/';

/**
 * описываем базовые классы
 */
class List{
  constructor(url, container, list = list2){
    this.container = container;
    this.list = list; // словарь для классов
    this.url = url;
    this.goods = [];
    this.allProducts = [];
    this.filtered = [];   
    this._init();
  }

  /**
   * получение данных с сервера
   * @params url
   * @returns {Promise<any | never>}
   */
  getJson(url){
    return fetch(url ? url : `${API + this.url}`)
      .then(result => result.json())
      .catch(error => {
        console.log(error);
      })
  }

  /**
   * обработка полученных данных
   * @param data
   */
  handleData(data){
    this.goods = [...data];
    //console.log(this.goods);
    this.render();
  }
  
  render(){
    const block = document.querySelector(this.container);   
    for (let product of this.goods){
        //console.log(this.constructor.name);
        const productObj = new this.list[this.constructor.name](product);        
        this.allProducts.push(productObj);        
        block.insertAdjacentHTML('beforeend', productObj.render());
    }
    //console.log(this.allProducts);
  }
  
  /**
   * матод поиска товаров
   * @param value - поисковый запрос
   */
  filter(value){
    const regexp = new RegExp(value, 'i');
    this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
    this.allProducts.forEach(el => {
      const block = document.querySelector(`.product-item[data-id = "${el.id_product}"]`);
      if(!this.filtered.includes(el)){
        block.classList.add('invisible');
      }else{
        block.classList.remove('invisible');
      }
    })
  }
  
  /**
   * подсчет стоимости всех товаров
   * @returns {*|number}
   */
  calcSum(){
    return this.allProducts.reduce((accum, item) => accum += item.price, 0);
  }

  _init(){
    return false;
  }
    
}

class Item{
  constructor(el, img = 'https://placehold.it/200x150'){
    this.product_name = el.title;
    this.price = el.price;
    this.id_product = el.id;
    this.img = el.image || img;
  }

  render(){
    return  `<div class = "product-item" data-id = "${this.id_product}">
                <img src="${this.img}" alt = "Same img">
                <div class = "desc">
                    <h3>${this.product_name}</h3>
                    <p>${this.price}</p>
                    <button class = "buy-btn"
                    data-id = "${this.id_product}"
                    data-name = "${this.product_name}"
                    data-price = "${this.price}"
                    >Купить</button>
                </div>
            </div>`
  }
}

/**
 * Наследуемся от базовых классов
 */
class ProductsList extends List{
  constructor(cart, container = '.products', url = "products"){
    super(url, container);
    //console.log(cart);
    this.cart = cart;    
    this.getJson()
      .then(data => this.handleData(data));    
  }
  _init(){
    document.querySelector(this.container).addEventListener('click', e =>{
      if(e.target.classList.contains('buy-btn')){
        this.cart.addProduct(e.target);
      }
    });
    document.querySelector('.search-form').addEventListener('submit', e =>{
      e.preventDefault();
      this.filter(document.querySelector('.search-field').value)
    });
  }
}

class ProductItem extends Item{}

class Cart extends List{
  constructor(container = ".cart-block", url = "carts/2"){
    super(url, container);
    this.getJson()
      .then(data => {
        //console.log(data.products);
        this._showCart(data.products);
      });
  }
/**
 * [{INT productId, INT quantity},]
 */
  _showCart(cartProducts){
    this.getJson(`${API}products`)
      .then(data => {  
        //console.log(data);      
        let currentCart = cartProducts.map(cartProd => {
          let find = data.find(product => product.id == cartProd.productId);
          find.quantity = cartProd.quantity;
          find.id_product = cartProd.productId;          
          return find;
        });
        //console.log(currentCart);
        this.handleData(currentCart);         
      });
  }

  /**
   * добавление товара
   * @param element
   */
  addProduct(element){
    //нужно добавить скрипт для изменения данных на сервере    
    let productId = +element.dataset['id'];
    //console.log(this.allProducts);
    let find = this.allProducts.find(product => product.id_product === productId);
    if(find){
      find.quantity++;
      this._updateCart(find);
    }else{
      let product = [{
        productId: productId,       
        quantity: 1
      }];
      this._showCart(product);
    }
  }

  /**
   * удаление товара
   * @param element
   */
  removeProduct(element){
    //нужно добавить скрипт для изменения данных на сервере       
    let productId = +element.dataset['id'];
    //console.log(this.allProducts);
    let find = this.allProducts.find(product => product.id_product === productId);
    if(find.quantity > 1){ // если товара > 1, то уменьшаем количество на 1
      find.quantity--;
      this._updateCart(find);
    } else { // удаляем
      this.allProducts.splice(this.allProducts.indexOf(find), 1);
      document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
    }       
  }

  /**
   * обновляем данные корзины
   * @param product
   * @private
   */
  _updateCart(product){    
    let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
    block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
    block.querySelector('.product-price').textContent = `$${product.quantity*product.price}`;
  }

  _init(){
    document.querySelector('.btn-cart').addEventListener('click', () => {
      document.querySelector(this.container).classList.toggle('invisible');
    });
    document.querySelector(this.container).addEventListener('click', e => {
      if(e.target.classList.contains('del-btn')){
        this.removeProduct(e.target);
      }
    })
  }
}

class CartItem extends Item{
  constructor(el, img = 'https://placehold.it/50x100'){
    super(el, img);
    this.quantity = el.quantity;
    //console.log(this);
  }


  render(){
    return `<div class = "cart-item" data-id = "${this.id_product}">
              <div class = "product-bio">
                <img src = "${this.img}" alt = "cart product image">
                <div class = "product-desc">
                  <p class = "product-title">${this.product_name}</p>
                  <p class = "product-quantity">Quantity: ${this.quantity}</p>
                  <p class = "product-single-price">$${this.price} each</p>
                <div>
              </div>
              <div class = "right-block">
                <p class = "product-price">$${this.quantity*this.price}</p>
                <button class = "del-btn" data-id = "${this.id_product}">Удалить</button>
              </div>
            </div>`
  }
}

const list2 = {
  'ProductsList': ProductItem,
  'Cart': CartItem
};


let cart = new Cart();
new ProductsList(cart);

/*
 const products = [
   {id: 1, title: 'Notebook', price: 1000},
   {id: 2, title: 'Mouse', price: 100},
   {id: 3, title: 'Keyboard', price: 250},
   {id: 4, title: 'Gamepad', price: 150},
 ];

 const renderProduct = (item, img = 'https://placehold.it/200x150') => `<div class="product-item">
             <img src="${img}" alt="Some img">
             <h3>${item.title}</h3>
             <p>${item.price}</p>
             <button class="by-btn">Добавить</button>
           </div>`;

 const renderProducts = list => document.querySelector('.products')
   .insertAdjacentHTML('beforeend', list.map(item => renderProduct(item)).join(''));

 renderProducts(products);
*/ 