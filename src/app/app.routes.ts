import { Routes } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { SearchComponent } from './search/search.component';
import { CatalogComponent } from './catalog/catalog.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AuthComponent } from './auth/auth.component';
import { ChatComponent } from './chat/chat.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [
    {path:'',component:HeroComponent},
    {path:'search',component:SearchComponent},
    {path:'catalog',component:CatalogComponent},
    {path:'fav',component:FavoritesComponent},
    {path:'auth',component:AuthComponent},
    {path:'chat',component:ChatComponent},
    {path:'chatbot',component:ChatbotComponent},
];
