import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksComponent, Book } from './books.component';
import { RequestrService } from 'src/app/services/requestr.service';
import { HttpClientModule } from '@angular/common/http';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [BooksComponent],
      providers: [RequestrService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#fetchBooks', () => {
    let http: RequestrService;
    beforeEach(() => {
      http = TestBed.get(RequestrService);
      spyOn(http, 'get').and.returnValue(Promise.resolve({ body: [] }));
      spyOn(component, 'initializeBookData');
      spyOn(component, 'fetchCharacters');
    });
    it('will provide page and Page size parameters to the get request', async () => {
      await component.fetchBooks(10);
      expect(http.get).toHaveBeenCalledWith(
        'https://anapioficeandfire.com/api/books',
        null,
        {
          page: 10,
          pageSize: 10,
        }
      );
    });
    it('will call initalizeBookData', async () => {
      await component.fetchBooks(10);
      expect(component.initializeBookData).toHaveBeenCalled();
    });
  });

  describe('#fetchCharacters', () => {
    const book = { characters: ['a', 'b', 'c'], characterPage: 0 } as Book;
    let http: RequestrService;
    beforeEach(() => {
      http = TestBed.get(RequestrService);
    });
    it('will call all urls in the book list', async () => {
      spyOn(http, 'get').and.returnValue(Promise.resolve({ body: {} }));
      await component.fetchCharacters(book);
      expect(book.characterDatas.length).toEqual(3);
    });
    it('will increment page count', async () => {
      spyOn(http, 'get').and.returnValue(Promise.resolve({ body: {} }));
      await component.fetchCharacters(book);
      expect(book.characterPage).toEqual(2);
    });
  });

  describe('#addTitleToMap', () => {
    it('will add title to the url map', () => {
      component.addTitleToMap({ url: 'abc' } as Book);
      expect(component.bookTitleUrlMap.abc).toBeTruthy();
    });
  });

  describe('#fetchAllMentionedBooks', () => {
    let http: RequestrService;
    beforeEach(() => {
      http = TestBed.get(RequestrService);
    });
    it('will filter out all books that exist in the map alread', async () => {
      component.bookTitleUrlMap = { abc: {} as Book };
      spyOn(http, 'get').and.returnValue(
        Promise.resolve({ body: { url: 'def' } })
      );
      await component.fetchAllMentionedBooks(['abc', 'def']);
      expect(Object.keys(component.bookTitleUrlMap).includes('def')).toEqual(
        true
      );
    });
  });
});
