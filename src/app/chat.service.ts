import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: Firestore) {}

  getMessages() {
    const msgsRef = collection(this.firestore, 'messages');
    const q = query(msgsRef, orderBy('createdAt'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  async sendMessage(user: any, text: string) {
    const msgsRef = collection(this.firestore, 'messages');
    await addDoc(msgsRef, {
      text,
      createdAt: serverTimestamp(),
      uid: user.uid,
      username: user.username,
    });
  }
}
