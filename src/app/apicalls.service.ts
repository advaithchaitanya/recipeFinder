import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Meal, MealResponse } from './meal/meal.module';

@Injectable({
  providedIn: 'root'
})
export class ApicallsService {

  constructor(private http:HttpClient) { 
    this.loadCartFromLocalStorage();
    localStorage.setItem('favs',JSON.stringify(this.cart))
  }
  loadCartFromLocalStorage() {
    const stored = localStorage.getItem('favs');
    if (stored) {
      try {
        this.cart = JSON.parse(stored);
      } catch (err) {
        this.cart = [];
      }
    }
  }

  displayDish?:Meal
    cart: Meal[] = [];

  addToFavs(meal: Meal) {
    const exists = this.cart.find(m => m.idMeal === meal.idMeal);
    if (!exists) {
      this.cart.push(meal);
      this.saveCartToLocalStorage();
      alert(`${meal.strMeal} added to cart 🛒`);
    } else {
      alert(`${meal.strMeal} is already in your cart 😌`);
    }
    console.log("🛒 Cart Items:", this.cart);
  }
   removeFromCart(mealId: string) {
    this.cart = this.cart.filter((item) => item.idMeal !== mealId);
    this.saveCartToLocalStorage();
  }
     saveCartToLocalStorage() {
    localStorage.setItem('favs', JSON.stringify(this.cart));
  }

  getFavs(): Meal[] {
    return this.cart;
  }
  getBySearch(search:string=''):Observable<MealResponse[]>{
    return this.http.get<MealResponse[]>(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`).pipe(
      catchError((err) => throwError(() => 'Data Not found '))
    )
  }
  private baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  getCategories(): Observable<{ categories: { strCategory: string }[] }> {
    return this.http.get<{ categories: { strCategory: string }[] }>(
      `${this.baseUrl}/list.php?c=list`
    ).pipe(
      catchError((error:HttpErrorResponse)=>throwError(()=>
      {
        console.error(error)

      }))
    );
  }

  getMealsByCategory(category: string): Observable<{ meals: any[] }> {
    return this.http.get<{ meals: any[] }>(
      `${this.baseUrl}/filter.php?c=${category}`
    );
  }
    getMealById(id: string): Observable<any> {
    return this.http.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  }
  active=false
  toggle(){
    this.active=!this.active
  }
  toggleByCard(data:Meal){
    this.active=!this.active
    console.log((data));
    this.displayDish=data

    
  }
 
}
// https://www.themealdb.com/api/json/v1/1/list.php?c=list