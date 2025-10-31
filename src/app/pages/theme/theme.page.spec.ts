import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ThemePage } from './theme.page';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/components/toast/toast.service';
import { NavController } from '@ionic/angular';

describe('ThemePage', () => {
  let component: ThemePage;
  let fixture: ComponentFixture<ThemePage>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockAuthService: any;
  let mockToastService: any;
  let mockNavController: any;

  beforeEach(() => {
    // Create mocks using Jest syntax
    mockRouter = {
      navigate: jest.fn()
    };
    mockActivatedRoute = {
      queryParams: of({}),
      params: of({})
    };
    mockAuthService = {
      currentUser: of({ id: '1', email: 'test@test.com', name: 'Test User' })
    };
    mockToastService = {
      openToast: jest.fn()
    };
    mockNavController = {
      navigateForward: jest.fn(),
      navigateBack: jest.fn(),
      navigateRoot: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [ThemePage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
        { provide: NavController, useValue: mockNavController }
      ]
    });

    fixture = TestBed.createComponent(ThemePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isLoading()).toBe(false);
  });

  it('should have null themeData initially', () => {
    expect(component.themeData).toBeNull();
  });
});
