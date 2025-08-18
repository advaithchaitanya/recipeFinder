import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, User, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private cookieService: CookieService
  ) {}

  async googleSignIn(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user: User = result.user;

    const token = await user.getIdToken();
    this.cookieService.set('access_token', token, 1);

    // If new user, add basic info
    const userRef = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date()
      });
    }

    return user;
  }
}
