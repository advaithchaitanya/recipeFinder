import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Firestore, doc, getDoc, setDoc, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import AOS from 'aos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {  onAuthStateChanged } from 'firebase/auth';
interface UserData {
  nickname: string;
  role: 'Chef' | 'Foodie';
  name: string;
  email: string;
  photoURL: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoggedIn = false;
  showFormAfterSignIn = false;
  nickname = '';
  role = '';
  userData: any = null;
  usersu: any[] = [];
  marqueeUsers: any[] = [];

  // 👇 For toggling update UI
  a = false;
  currentUser: any = null;


  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private router: Router,
    private cookieService: CookieService
  ) {
    AOS.init();
  }
  ngOnInit(): void {
  AOS.init();
  this.isLoggedIn = this.cookieService.check('access_token');

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      this.currentUser = user; // 🎯 Save current user here!
      this.isLoggedIn = true;
      this.usersu = await this.getAllUsers();
    }
  });
}
  getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
  get doubledUsers() {
  return [...this.usersu, ...this.usersu];
}

  // 🔁 Toggle update form + pre-fill
  tog() {
    this.a = !this.a;
    const currentUser = getAuth().currentUser;
    const thisUser = this.usersu.find(u => u.uid === currentUser?.uid);
    if (thisUser) {
      this.nickname = thisUser.nickname;
      this.role = thisUser.role;
    }
  }

async signInWithGoogle() {
  try {
    const user = await this.authService.googleSignIn();
    const userRef = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(userRef);
    const data = snap.data() as UserData;

    this.currentUser = user; // 👈 THIS IS THE FIX

    if (!snap.exists() || !data.nickname || !data.role) {
      this.userData = user;
      this.showFormAfterSignIn = true;
    } else {
      this.isLoggedIn = true;
      this.usersu = await this.getAllUsers();
      this.router.navigate(['/']);
    }
  } catch (err) {
    console.error('Sign-in error:', err);
  }
}

  async submitProfile() {
    if (!this.nickname || !this.role || !this.userData) return;

    const userRef = doc(this.firestore, 'users', this.userData.uid);
    await setDoc(userRef, {
      uid: this.userData.uid,
      email: this.userData.email,
      name: this.userData.displayName,
      photoURL: this.userData.photoURL,
      nickname: this.nickname,
      role: this.role,
      updatedAt: new Date()
    }, { merge: true });

    this.showFormAfterSignIn = false;
    this.isLoggedIn = true;
    this.usersu = await this.getAllUsers();
    this.router.navigate(['/chat']);
  }

  async updateProfile() {
    if (!this.nickname?.trim() || !this.role) {
      alert('Please enter a nickname and select a role!');
      return;
    }

    const currentUser = getAuth().currentUser;

    if (!currentUser) {
      console.error('User not found 😬');
      alert('User not logged in.');
      return;
    }

    const userRef = doc(this.firestore, 'users', currentUser.uid);

    try {
      await updateDoc(userRef, {
        nickname: this.nickname,
        role: this.role,
      });

      alert('Profile updated successfully ✅');
      this.usersu = await this.getAllUsers();
      this.tog(); // close form after update
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile ❌');
    }
  }

  async getAllUsers() {
    const snapshot = await getDocs(collection(this.firestore, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  logout() {
    this.cookieService.delete('access_token');
    this.isLoggedIn = false;
    this.usersu = [];
    this.userData = null;
    // this.router.navigate(['/']);
  }
}
