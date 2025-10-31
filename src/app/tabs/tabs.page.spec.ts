import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsPage } from './tabs.page';
import { TranslateStore, TranslateLoader, TranslateService, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    const mockTranslateService = {
      get: jest.fn().mockReturnValue(of('')),
      instant: jest.fn().mockReturnValue(''),
      setDefaultLang: jest.fn(),
      use: jest.fn(),
      getBrowserLang: jest.fn().mockReturnValue('es'),
      currentLang: 'es'
    };

    const mockTranslateStore = {
      currentLang: 'es',
      defaultLang: 'es'
    };

    const mockTranslateLoader = {
      getTranslation: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [TabsPage, TranslateModule.forRoot()],
      providers: [
        { provide: TranslateStore, useValue: mockTranslateStore },
        { provide: TranslateLoader, useValue: mockTranslateLoader },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    })
    .overrideTemplate(TabsPage, '<div>Mocked Template</div>')
    .compileComponents();

    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
