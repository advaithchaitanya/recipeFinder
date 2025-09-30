import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import {  query, orderBy, onSnapshot } from 'firebase/firestore';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  users: any[] = [];
  currentUser: User | null = null;
  selectedUser: any = null;
  selectedGroup: string | null = null;
  chefUsers:any[]=[]
  messages: any[] = [];
  newMessage = '';
  isSidebarOpen = false;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router,private cookieService:CookieService) {}

chefGroups: string[] = ['Chef Alpha', 'Chef Beta', 'Chef Gamma', 'Chef Delta', 'Chef Omega'];
// Example groups


  async ngOnInit() {
      this.isSidebarOpen = window.innerWidth >= 768;
      console.log(this.auth);
    this.auth.onAuthStateChanged(async (user) => {
        const token = this.cookieService.get('access_token');

  if (!token) {
    // ❌ No token? Bounce to auth
    this.router.navigate(['/auth']);
    return;
  }
      if (user) {
        this.currentUser = user;
        await this.loadUsers();
        // Filter chef users after users are loaded
        this.chefUsers = this.users.filter(user => user.role === 'Chef');
        if (this.selectedGroup) {
          this.loadMessages();
        } else if (this.selectedUser) {
          this.loadMessages();
        }
      }
    });

  }
  getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0].toUpperCase())
    .join('')
    .slice(0, 2); // Max 2 initials
}
getColorFromString(str: string): string {
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

  async loadUsers() {
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    this.users = querySnapshot.docs
      .map(doc => doc.data())
      .filter((u: any) => u.uid !== this.currentUser?.uid);
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.selectedGroup = null;
    this.loadMessages();
  }

  selectGroup(groupName: string) {
    this.selectedGroup = groupName;
    this.selectedUser = null;
    this.loadMessages();
  }

loadMessages() {
  this.messages = [];

  if (this.selectedGroup) {
    const groupRef = collection(this.firestore, `groupChats/${this.selectedGroup}/messages`);
    const q = query(groupRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      this.messages = snapshot.docs.map(doc => doc.data());
    });

  } else if (this.selectedUser) {
    const roomId = this.getRoomId(this.currentUser?.uid!, this.selectedUser.uid);
    const chatRef = collection(this.firestore, `chats/${roomId}/messages`);
    const q = query(chatRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      this.messages = snapshot.docs.map(doc => doc.data());
    });
  }
}

getUserById(uid: string) {
  return this.users.find(user => user.uid === uid);
}


 async sendMessage() {
  if (!this.newMessage.trim()) return;

 const msgData = {
  text: this.newMessage,
  senderId: this.currentUser?.uid,
  senderName: this.currentUser?.displayName,
  senderPhotoURL: this.currentUser?.photoURL || null,
  timestamp: Timestamp.now()
};


  if (this.selectedGroup) {
    const chatRef = collection(this.firestore, `groupChats/${this.selectedGroup}/messages`);
    await addDoc(chatRef, msgData);
  } else if (this.selectedUser) {
    const roomId = this.getRoomId(this.currentUser?.uid!, this.selectedUser.uid);
    const chatRef = collection(this.firestore, `chats/${roomId}/messages`);
    await addDoc(chatRef, msgData);
  }

  this.newMessage = '';
  this.loadMessages();
}


  getRoomId(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join('_');
  }
}
