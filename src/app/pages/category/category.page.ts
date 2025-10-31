import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CategoryService } from 'src/app/services/quiz/category.service';
import { CourseService } from 'src/app/services/quiz/course.service';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, chevronBackOutline, chevronForwardOutline, closeOutline, createOutline, searchOutline, trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./../home/home.page.scss', './category.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class CategoryPage implements OnInit {
  categoryForm!: FormGroup;
  isLoading = false;
  successMsg = '';
  errorMsg = '';
  categoriesList: any[] = [];
  searchTerm: string = '';
  filteredCategories: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  editingCategoryId: string | null = null;
  coursesList: any[] = [];

  selectTab = signal<string>('add');

  private router = inject(Router);
  private toastS = inject(ToastService);



  constructor(private fb: FormBuilder, private categoryService: CategoryService, private courseService: CourseService) { 
    addIcons({
      addOutline, chevronBackOutline, chevronForwardOutline ,
      trashOutline,
      createOutline,
      closeOutline,
      searchOutline,
      arrowBackOutline,
    });
  }

  async ngOnInit() {
    this.categoryForm = this.fb.group({
      cat_title: ['', Validators.required],
      cat_subtitle: ['', Validators.required],
      cat_description: ['', Validators.required],
      cat_color: [''],
      cat_img: [''],
      cat_crs_id: ['', Validators.required],
      cat_badge: [''],
      cat_doc: this.fb.array([])
    });
    await this.loadCourses();
    await this.loadCategories();
  }

   
  goBack(){
    this.router.navigate(['tabs/tab1']);
  }


  async loadCourses() {
    try {
      const res = await this.courseService.getCourses();
      this.coursesList = res?.data || [];
    } catch (e) {
      // Opcional: manejar error
    }
  }

  async loadCategories(refresh: boolean = false) {
    try {
      const res = await this.categoryService.getCategories(refresh);
      this.categoriesList = res?.data || [];
      this.applyFilterAndPagination();
    } catch (e) {
      // Opcional: manejar error
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail?.value || '';
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  applyFilterAndPagination() {
    // Filtrado
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categoriesList.filter(cat =>
      cat.cat_title?.toLowerCase().includes(term) ||
      cat.cat_subtitle?.toLowerCase().includes(term) ||
      cat.cat_description?.toLowerCase().includes(term)
    );
    // Paginación
    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize) || 1;
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  get pagedCategories() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(start, start + this.pageSize);
  }

  get catDocArray() {
    return this.categoryForm.get('cat_doc') as FormArray;
  }

  addDocument() {
    const docGroup = this.fb.group({
      uri: [''],
      title: [''],
      author: ['']
    });
    this.catDocArray.push(docGroup);
  }

  removeDocument(index: number) {
    this.catDocArray.removeAt(index);
  }

  editCategory(cat: any) {
    this.editingCategoryId = cat.cat_id;
    this.categoryForm.patchValue({
      cat_title: cat.cat_title,
      cat_subtitle: cat.cat_subtitle,
      cat_description: cat.cat_description,
      cat_color: cat.cat_color,
      cat_img: cat.cat_img,
      cat_crs_id: cat.cat_crs_id,
      cat_badge: cat.cat_badge
    });
    
    // Limpiar y agregar documentos existentes
    this.catDocArray.clear();
    if (cat.cat_doc && Array.isArray(cat.cat_doc)) {
      cat.cat_doc.forEach((doc: any) => {
        const docGroup = this.fb.group({
          uri: [doc.uri || ''],
          title: [doc.title || ''],
          author: [doc.author || '']
        });
        this.catDocArray.push(docGroup);
      });
    }
    this.selectTab.set('add');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingCategoryId = null;
    this.categoryForm.reset();
    this.catDocArray.clear();
  }

  async onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.categoryForm.invalid) return;
    this.isLoading = true;
    try {
      const value = { ...this.categoryForm.value };
      // Quitar el # si existe en cat_color
      if (value.cat_color && value.cat_color.startsWith('#')) {
        value.cat_color = value.cat_color.substring(1);
      }
      if (this.editingCategoryId) {
        await this.categoryService.updateCategory(this.editingCategoryId, value);
       
        this.toastS.openToast('Categoría actualizada correctamente','success');

        this.editingCategoryId = null;
      } else {
        await this.categoryService.addCategory(value);
        this.toastS.openToast('Categoría agregada correctamente','success');
      }
      this.categoryForm.reset();
      this.catDocArray.clear();
      await this.loadCategories();
    } catch (e: any) {
      this.toastS.openToast(e?.message || 'Error al guardar la categoría','danger');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteCategory(cat_id: string) {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    try {
      await this.categoryService.deleteCategory(cat_id);
      await this.loadCategories(true);
    } catch (e) {
      alert('Error al eliminar la categoría');
    }
  }
}
