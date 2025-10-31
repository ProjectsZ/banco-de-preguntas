import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TopicPage } from './topic.page';
import { CategoryService } from 'src/app/services/quiz/category.service';
import { TopicService } from 'src/app/services/quiz/topic.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/components/toast/toast.service';
import { NavController } from '@ionic/angular';

describe('TopicPage', () => {
  let component: TopicPage;
  let fixture: ComponentFixture<TopicPage>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockCategoryService: any;
  let mockTopicService: any;
  let mockAuthService: any;
  let mockToastService: any;
  let mockNavController: any;

  // Datos de prueba más realistas
  const mockTopics = [
    { 
      cat_title: 'test-topic', 
      cat_subtitle: 'Test Topic', 
      cat_description: 'Test Description',
      cat_id: '123',
      cat_img: 'test-image.jpg',
      cat_color: '#007bff',
      cat_badge: 'test-badge',
      cat_crs_id: '456',
      created_at: '2025-01-01T00:00:00.000Z',
      grouped_data: [
        {
          cat_title: 'test-topic',
          cat_subtitle: 'Test Topic',
          cat_description: 'Test Description',
          cat_id: '123',
          cat_img: 'test-image.jpg',
          cat_color: '007bff',
          cat_badge: 'test-badge',
          cat_crs_id: '456',
          created_at: '2025-01-01T00:00:00.000Z'
        }
      ]
    }
  ];

  const mockQuestions = [
    {
      pr_id: '1',
      pr_question: 'Test question 1',
      pr_content: 'Test content 1',
      pr_difficulty: 'easy',
      pr_type: 'multiple_choice',
      pr_options: ['A', 'B', 'C', 'D'],
      pr_answer: 'A',
      pr_tags: ['test', 'easy'],
      pr_cat_id: '123',
      created_at: '2025-01-01T00:00:00.000Z',
      selectedAnswer: null,
      marked: false,
      pr_point: 10,
      viewAnswer: false
    },
    {
      pr_id: '2',
      pr_question: 'Test question 2',
      pr_content: 'Test content 2',
      pr_difficulty: 'medium',
      pr_type: 'true_false',
      pr_options: ['True', 'False'],
      pr_answer: 'True',
      pr_tags: ['test', 'medium'],
      pr_cat_id: '123',
      created_at: '2025-01-01T00:00:00.000Z',
      selectedAnswer: null,
      marked: false,
      pr_point: 15,
      viewAnswer: false
    }
  ];

  beforeEach(() => {
    // Create mocks using Jest syntax with realistic data
    mockRouter = {
      navigate: jest.fn()
    };
    mockActivatedRoute = {
      queryParams: of({ id: 'test-topic' }),
      params: of({})
    };
    mockCategoryService = {
      topics: jest.fn(() => mockTopics),
      topic_selected: jest.fn(() => mockTopics[0])
    };
    mockTopicService = {
      getPreguntasPaginadas: jest.fn().mockResolvedValue(mockQuestions)
    };
    mockAuthService = {
      currentUser: of({ 
        usr_id: '1', 
        usr_email: 'test@test.com', 
        usr_username: 'testuser',
        usr_is_active: true,
        created_at: '2025-01-01T00:00:00.000Z'
      })
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
      imports: [TopicPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: TopicService, useValue: mockTopicService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
        { provide: NavController, useValue: mockNavController }
      ]
    });

    fixture = TestBed.createComponent(TopicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should have questions array with mock data', () => {
    expect(component.preguntas).toEqual(mockQuestions);
  });

  it('should have paginated questions', () => {
    expect(component.preguntasPaginadas.length).toBeGreaterThan(0);
  });

  it('should initialize pagination variables', () => {
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(5);
    expect(component.totalPages).toBeGreaterThan(0);
  });

  it('should have Math object available', () => {
    expect(component.Math).toBe(Math);
  });

  it('should have alert variables initialized', () => {
    expect(component.isSubmitConfirm()).toBe(false);
    expect(component.alertButtons()).toEqual(['Action']);
    expect(component.alertMessage()).toBeNull();
  });

  it('should have topics data from service', () => {
    expect(component.temas()).toEqual(mockTopics);
  });

  it('should have dataTopic from service', () => {
    expect(component.dataTopic).toEqual(mockTopics[0]);
  });

  it('should have current user data', () => {
    expect(component.currentUser).toBeDefined();
    expect(component.currentUser.usr_id).toBe('1');
    expect(component.currentUser.usr_email).toBe('test@test.com');
  });
});
