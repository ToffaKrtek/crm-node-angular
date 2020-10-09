import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { error } from 'protractor';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  @ViewChild('input') inputRef: ElementRef;
  form: FormGroup;
  image: File;
  imagePreview = '';
  isNew = true;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryServise: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoryServise.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name,
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        (error) => MaterialService.toast(error.error.message)
      );
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  deleteCategory() {
    const decision = window.confirm(
      `Удалить категорию "${this.category.name}"`
    );

    if (decision) {
      this.categoryServise.delete(this.category._id).subscribe(
        (response) => MaterialService.toast(response.message),
        (error) => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/category'])
      );
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      //create
      obs$ = this.categoryServise.create(this.form.value.name, this.image);
    } else {
      //update
      obs$ = this.categoryServise.update(
        this.category._id,
        this.form.value.name,
        this.image
      );
    }
    obs$.subscribe(
      (category) => {
        this.category = category;
        MaterialService.toast('Изменения сохранены');
        this.form.enable();
      },
      (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
