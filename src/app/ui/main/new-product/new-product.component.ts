import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Product } from '../../../model/product';
import { MessageService } from 'primeng/api';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  displaySidePanel = false;
  embeddedPictureMode = true;
  isEditMode: boolean = false;
  choosenPicture = 0;
  file: {files: File[]};

  predefinedPictures: string[] = [
    "/assets/img/modul-nopal-taster-svetla-2m.jpg",
    "/assets/img/modul-nopal-taster-zvona-2m.jpg",
    "/assets/img/modul-nopal-ventilator-1m.jpg",
    "/assets/img/modul-nopal-prikljuc-suko-2m.jpg",
    "/assets/img/modul-nopal-prikljuc-euro-1m.jpg",
    "/assets/img/modul-nopal-priklj-utp-cat6.jpg",
    "/assets/img/modul-nopal-maska-bela-2m.jpg",
    "/assets/img/modul-nopal-maska-bela-3m.jpg",
    "/assets/img/modul-nopal-maska-bela-4m.jpg",
    "/assets/img/modul-nopal-nosac-3m.jpg",
    "/assets/img/modul-nopal-nosac-4m.jpg",
    "/assets/img/modul-nopal-nosac-5m.jpg",
    "/assets/img/modul-montazna-kutija-pm3.jpg",
    "/assets/img/modul-montazna-kutija-pm4.jpg",
    "/assets/img/modul-montazna-kutija-pm7.jpg"
  ];

  newProductForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl(''),
    description: new FormControl(''),
    way_of_use: new FormControl(''),
    price: new FormControl('', Validators.required),
    stock: new FormControl(''),
    picture: new FormControl('')
    }
  );

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(s =>{
      if(s === 'edit'){
        this.isEditMode = true;
        this.setFormValues(this.productService.getEditableProduct());
      }
      else {
        this.isEditMode = false;
        this.setFormValues(this.productService.getEmptyProduct());
      }
    });
  }

  private setFormValues(p: Product){
    if(p === null){
      this.newProductForm.reset();
      return;
    }

    this.newProductForm.get('name').setValue(p.name);
    this.newProductForm.get('category').setValue(p.category);
    this.newProductForm.get('description').setValue(p.description);
    this.newProductForm.get('way_of_use').setValue(p.way_of_use);
    this.newProductForm.get('price').setValue('' + p.price);
    this.newProductForm.get('stock').setValue('' + p.storage);
    this.newProductForm.get('picture').setValue(p.picture);
  }

  makeNewProduct(){
    this.updateProduct();
    this.productService.saveProduct();
    this.router.navigate(['/main/my-products']);
    this.messageService.add(
      {
        severity:'success',
        summary: this.isEditMode ? 'Uspešno ste ažurirali proizvod' : 'Dodali ste novi proizvod',
      }
    );
  }

  private updateProduct(){
    this.productService.edit.name = this.newProductForm.get('name').value;
    this.productService.edit.category = this.newProductForm.get('category').value;
    this.productService.edit.description = this.newProductForm.get('description').value;
    this.productService.edit.way_of_use = this.newProductForm.get('way_of_use').value;
    this.productService.edit.price = +this.newProductForm.get('price').value;
    this.productService.edit.storage = +this.newProductForm.get('stock').value;
    this.productService.edit.picture = this.newProductForm.get('picture').value;
  }

  openPanel(){
    this.displaySidePanel = true;
  }

  selectNewPicture(index: number){
    this.choosenPicture = index;
  }

  confirmPictureSelect(){
    if(this.embeddedPictureMode){
      this.newProductForm.get('picture').setValue(this.predefinedPictures[this.choosenPicture]);
    }
    else{
      console.log('Upload image is not supported!');
      if(this.file == undefined || this.file == null){
        this.messageService.add(
          {
            severity:'warn',
            summary:'Slika nije otpremljena.',
            detail:'Da biste potvrdili izmenu morate prvo otpremiti sliku.'
          }
        );
        return;
      }
    }
    this.displaySidePanel = false;
  }

  private saveToFileSystem(response: {files: File[]}) {
    const file = response.files[0];
    return file.name;
  }

  clearPictureSelect(){
    this.file = null;
    this.displaySidePanel = false;
  }

  uploadImage(event){
    this.file = event;
  }
}
