import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SplashComponent } from './splash.component';

describe('SplashComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SplashComponent],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SplashComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fire-and-ice'`, () => {
    const fixture = TestBed.createComponent(SplashComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('A Song of Fire and Ice');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(SplashComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'A Song of Fire and Ice '
    );
  });
});
