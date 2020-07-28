import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SplashComponent } from './components/splash/splash.component';
import { RequestrService } from './services/requestr.service';
import { HttpClientModule } from '@angular/common/http';
import { BooksComponent } from './components/books/books/books.component';
import { AppComponent } from './components/app/app.component';

@NgModule({
  declarations: [SplashComponent, BooksComponent, AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [RequestrService],
  bootstrap: [AppComponent],
})
export class AppModule {}
