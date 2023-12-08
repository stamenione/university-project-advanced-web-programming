import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public static PRODUCT_URL = 'products';
  public static EDIT_PRODUCT_URL = 'editProduct';
  public static ID_URL = 'productID';
  public static ID = 0;

  products: Product[] = [];

  product: Product = null;
  edit: Product;

  constructor(private authService: AuthService) {
    this.edit = JSON.parse(localStorage.getItem(ProductService.EDIT_PRODUCT_URL));
    const tempid = JSON.parse(localStorage.getItem(ProductService.ID_URL));

    if(tempid === null){
      localStorage.setItem(ProductService.ID_URL, '0');
    } else {
      ProductService.ID = +tempid;
    }

    const temp = JSON.parse(localStorage.getItem(ProductService.PRODUCT_URL));
    if(temp !== null){
      this.products = temp;
    }

    this.product = JSON.parse(localStorage.getItem('prodDetails'));
  }

  seeProductDetails(p:Product){
    localStorage.setItem('prodDetails', JSON.stringify(p));
    this.product = p;
  }

  findProductDetails(id: number){
    for(const p of this.products){
      if(p.id === id) {
        localStorage.setItem('prodDetails', JSON.stringify(p));
        this.product = p;
        return;
      }
    }
    this.product = null;
    localStorage.removeItem('prodDetails');
  }

  updateProductStorage(p: Product){
    for(let index = 0;index < this.products.length; index++){
      if(this.products[index].id === p.id){
        this.products[index].storage = p.storage;
        localStorage.setItem(ProductService.PRODUCT_URL, JSON.stringify(this.products));
        localStorage.setItem('prodDetails', JSON.stringify(p));
        return;
      }
    }
  }

  getProducts(){
    const username = this.authService.user.value.username;
    let stockEmptyProduct = 0;
    const temp = this.products.filter(p => {
      if(username === p.userId){
        if(p.storage === 0)
          stockEmptyProduct++;
        return true;
      }
      return false;
    });
    return {products: temp, empty: stockEmptyProduct};
  }

  editProduct(p: Product){
    this.edit = p;
    localStorage.setItem(ProductService.EDIT_PRODUCT_URL, JSON.stringify(p));
  }

  getEditableProduct(){
    this.edit = JSON.parse(localStorage.getItem(ProductService.EDIT_PRODUCT_URL));
    if(this.edit === null)
      return this.getEmptyProduct();
    return this.edit;
  }

  getEmptyProduct(){
    this.edit = new Product(ProductService.ID, '', 0, '', 0, '', '' , this.authService.user.value.username,'');
    return this.edit;
  }

  removeProduct(prod: Product){
    for (let index = 0; index < this.products.length; index++) {
      const element = this.products[index];
      if(element.id === prod.id){
        this.products.splice(index, 1);
        localStorage.setItem(ProductService.PRODUCT_URL, JSON.stringify(this.products));
        return;
      }
    }
  }

  saveProduct(){
    localStorage.removeItem(ProductService.EDIT_PRODUCT_URL);

    let exsists = false;
    for (let index = 0; index < this.products.length; index++) {
      const element = this.products[index];
      if(element.id === this.edit.id){
        this.products[index] = this.edit;
        exsists = true;
      }
    }

    if(!exsists){
      this.products.push(this.edit);
      localStorage.setItem(ProductService.ID_URL, ++ProductService.ID + '');
    }
    localStorage.setItem(ProductService.PRODUCT_URL, JSON.stringify(this.products));
  }

  getProductsByCategory(){

  }
}
