import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products!: Array<Product>;
  filteredProducts!: Array<Product>;
  selectedCategory: string = 'All';
  selectedSizes: Set<string> = new Set<string>();
  selectedPriceRange: [number, number] = [0, 1000];
  searchTerm = '';

  totalProducts!: number;
  paginatedProducts!: Array<Product>;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 15, 20];
  showPageSizeOptions = true;

  ngOnInit(): void {
    this.products = this.productService.getAllProducts();
    this.filteredProducts = this.products;
    this.totalProducts = this.products.length;
    this.paginateProducts();
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  // handles page change
  handlePageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateProducts();
  }

  // paginates products array
  paginateProducts() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // filters products based on the search input value
  doSearch(inputValue: string) {
    this.searchTerm = inputValue.trim().toLowerCase();

    if (this.searchTerm) {
      this.filterProducts();
    } else {
      this.filteredProducts = this.products;
    }

    this.totalProducts = this.filteredProducts.length;
    this.currentPage = 0;
    this.paginateProducts();
    this.filterProducts();
  }

  // filters products by selected category
  filterByCategory() {
    this.filterProducts();
  }

  // filters products by selected sizes
  filterBySize(size?: string) {
    if (size) {
      if (this.selectedSizes.has(size)) {
        this.selectedSizes.delete(size);
      } else {
        this.selectedSizes.add(size);
      }
    }

    this.filterProducts();
  }

  // filters products by selected price range
  filterByPrice() {
    this.filterProducts();
  }

  // combines all filter criteria
  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearchTerm =
        this.searchTerm === '' ||
        product.name.toLowerCase().includes(this.searchTerm);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const matchesSize =
        this.selectedSizes.size === 0 || this.selectedSizes.has(product.size);

      const matchesPrice =
        product.price >= this.selectedPriceRange[0] &&
        product.price <= this.selectedPriceRange[1];

      return (
        matchesCategory && matchesSize && matchesPrice && matchesSearchTerm
      );
    });

    this.totalProducts = this.filteredProducts.length;
    this.currentPage = 0;
    this.paginateProducts();
  }

  // redirects to product details component
  // and passes the id of clicked product
  viewProductDetails(id: number) {
    this.router.navigate(['/product-list', id]);
  }

  // adds item to cart
  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
