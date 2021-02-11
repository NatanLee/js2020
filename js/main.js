//API from https://fakestoreapi.com/
const API = 'https://fakestoreapi.com/products';
/*
let getRequest = (url, cb) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          console.log('Error');
        } else {
          //cb(xhr.responseText);
          console.log(xhr.responseText);
        }
      }
    };
    xhr.send();
};
getRequest(API);
*/


class ProductList{
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        //this._fetchProducts();
        this._getProducts()
          .then(data => {
            console.log(data);
            //this.goods = data;
            this.goods = [...data];
            console.log(this.goods);
            this._render();

          });
        //this._render();        
    }
    /*_fetchProducts(){      
      this.goods = [
            {id: 1, title: 'Notebook', price: 1000},
            {id: 2, title: 'Mouse', price: 100},
            {id: 3, title: 'Keyboard', price: 250},
            {id: 4, title: 'Gamepad', price: 150},
        ];
    }*/
    _getProducts(){
      return fetch(`${API}`)
        .then(result => result.json())
        .catch(error => {
          console.log(error);
        })
    }

    _render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObject = new ProductItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        }
    }
}

class ProductItem{
    constructor(product, img = 'https://placehold.it/200x150'){
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = product.image;
    }

    render(){
       return   `<div class = "product-item" data-id = "${this.id}">
                    <img src="${this.img}" alt = "Same img">
                    <div class = "desc">\
                        <h3>${this.title}</h3>
                        <p>${this.price}</p>
                        <button class = "buy-btn">купить</button>
                    </div>
                </div>`;
    }
}



const list = new ProductList();

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