import { Component, OnInit } from '@angular/core';
import { RequestrService } from 'src/app/services/requestr.service';
import { HttpResponse } from '@angular/common/http';

const urls = {
  books: 'https://anapioficeandfire.com/api/books',
};

export interface Character {
  url: string;
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  mother: string;
  spouse: string;
  allegiances: string[];
  books: string[];
  povBooks: any[];
  tvSeries: string[];
  playedBy: string[];
}

export interface Book {
  url: string;
  name: string;
  isbn: string;
  authors: string[];
  numberOfPages: number;
  publisher: string;
  country: string;
  mediaType: string;
  released: string;
  characters: string[];
  povCharacters: string[];
  characterPage?: number;
  characterDatas: Character[];
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  // The number of characters to load per page, default is 12
  readonly CHARACTER_PAGE_SIZE = 12;
  // The books that are being displayed on the UI
  books: Book[];
  // Page number that is being displayed, default is 1
  pageNumber = 1;
  // The page number options for the book pagination
  pageNumbers = [1, 2];
  // Raw book resource map, stored to get book titles
  bookTitleUrlMap: { [key: string]: Book } = {};
  constructor(private requestr: RequestrService) {}

  /**
   * On component init fetch books from server
   */
  ngOnInit() {
    this.fetchBooks(this.pageNumber);
  }

  /**
   * Fetch an array of books using the APIs default pagination parameters.
   * By default 10 books should be fetched every request.
   *
   * After the books are fetched, they are loaded into the url map and their
   * charcter information is also fetched.
   *
   * @param page the page that should be fetched
   * @param pageSize the number of books that should be fetched
   */
  async fetchBooks(page: number, pageSize = 10) {
    this.pageNumber = page;
    try {
      const res: HttpResponse<Book[]> = await this.requestr.get(
        urls.books,
        null,
        {
          page,
          pageSize,
        }
      );
      this.books = this.initializeBookData(res.body);
      this.books.forEach((b) => this.fetchCharacters(b));
    } catch (e) {
      alert('Error Occured when fetching books');
    }
  }

  /**
   * Fetch 12 characters at a time from the array of characters in the Book's object.
   *
   * The pagination is done by injecting a property into the book object called characterPage.
   * This property keeps track of which characters should be returned and whether or not the
   * load more button should be displayed to the user.
   *
   * @param book The book to fetch more characters.
   */
  async fetchCharacters(book: Book) {
    const page = book.characterPage;
    const start = page * this.CHARACTER_PAGE_SIZE;
    const end = (page + 1) * this.CHARACTER_PAGE_SIZE;

    const res = await Promise.all(
      book.characters.slice(start, end).map((c) => this.requestr.get(c))
    );
    const characters: Character[] = res.map((r) => r.body);

    if (!book.characterDatas) {
      book.characterDatas = characters;
    } else {
      book.characterDatas = [...book.characterDatas, ...characters];
    }
    characters.forEach((c) => this.fetchAllMentionedBooks(c.books));
    book.characterPage = page + 1;
  }

  /**
   * This function sets the key value pair of a url to book object in the
   * `bookTitleUrlMap` variable.
   *
   * @param book The book to append to the bookUrl map
   */
  async addTitleToMap(book: Book) {
    this.bookTitleUrlMap[book.url] = book;
  }

  /**
   * This function fetches a list of books provided in the argument, this is
   * mainly used to hydrate the bookUrlMap. This function will check if the
   * url already exists in the map and filter those results out then fetch
   * the remaining results.
   * @param books A list of book urls to check and fetch
   */
  async fetchAllMentionedBooks(books: string[]) {
    const filteredBooks = books.filter((b) => !this.bookTitleUrlMap[b]);
    const res = await Promise.all(
      filteredBooks.map((fb) => this.requestr.get(fb))
    );
    const fetchedBooks: Book[] = res.map((r) => r.body);
    fetchedBooks.forEach((fb) => this.addTitleToMap(fb));
  }

  /**
   * This function prepares book object for display by setting them in the map
   * and injecting character page properties into the object.
   * @param books The raw book information obtained from the server
   */
  private initializeBookData(books: Book[]) {
    return books.map((b) => {
      this.addTitleToMap(b);
      return { ...b, characterPage: 0 };
    });
  }
}
