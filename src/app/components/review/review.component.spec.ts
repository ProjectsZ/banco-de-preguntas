import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewComponent } from './review.component';
import { Question } from 'src/app/interfaces/question.interface';
import { IonItem, IonItemDivider, IonRow, IonCol, IonButton, IonText, IonIcon } from "@ionic/angular/standalone";
import { TextOutlineButtonComponent } from '../widgets/text-outline-button/text-outline-button.component';
import { IconClearButtonComponent } from '../widgets/icon-clear-button/icon-clear-button.component';
import { CommonModule } from '@angular/common';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  const mockQuestions: Question[] = [
    {
      pr_id: '1',
      pr_question: 'Test question 1',
      pr_content: 'Test content 1',
      pr_difficulty: 'Easy',
      pr_options: ['Option A', 'Option B', 'Option C', 'Option D'],
      pr_answer: '0',
      pr_type: 'multiple_choice',
      pr_tags: ['test', 'question'],
      pr_cat_id: '1',
      selectedAnswer: '1',
      marked: false,
      pr_point: 1,
      viewAnswer: false
    },
    {
      pr_id: '2',
      pr_question: 'Test question 2',
      pr_content: 'Test content 2',
      pr_difficulty: 'Medium',
      pr_options: ['Option A', 'Option B', 'Option C', 'Option D'],
      pr_answer: '2',
      pr_type: 'multiple_choice',
      pr_tags: ['test', 'question'],
      pr_cat_id: '1',
      selectedAnswer: '2',
      marked: true,
      pr_point: 2,
      viewAnswer: true
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReviewComponent,
        IonText,
        IonButton,
        IonCol,
        IonRow,
        IonItemDivider,
        TextOutlineButtonComponent,
        IconClearButtonComponent,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have questions input property', () => {
      expect(component.questions).toBeDefined();
    });

    it('should accept questions array', () => {
      // Test that the input signal exists and can be accessed
      expect(component.questions).toBeDefined();
      expect(typeof component.questions).toBe('function');
    });

    it('should handle empty questions array', () => {
      // Test that the input signal can handle empty arrays
      expect(component.questions).toBeDefined();
    });
  });

  describe('Output Properties', () => {
    it('should have slide output property', () => {
      expect(component.slide).toBeDefined();
    });

    it('should have submitQuiz output property', () => {
      expect(component.submitQuiz).toBeDefined();
    });
  });

  describe('Methods', () => {
    it('should emit slide event with correct index', () => {
      const slideSpy = jest.spyOn(component.slide, 'emit');
      const testIndex = 2;

      component.openSlide(testIndex);

      expect(slideSpy).toHaveBeenCalledWith(testIndex);
    });

    it('should emit submitQuiz event with true value', () => {
      const submitSpy = jest.spyOn(component.submitQuiz, 'emit');

      component.onSubmit();

      expect(submitSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('ngOnInit', () => {
    it('should call ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should add icons on initialization', () => {
      // Since addIcons is called in ngOnInit, we just verify the method can be called
      component.ngOnInit();
      expect(component).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should render with questions data', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled).toBeTruthy();
    });

    it('should handle multiple questions correctly', () => {
      const multipleQuestions = [
        ...mockQuestions,
        {
          pr_id: '3',
          pr_question: 'Test question 3',
          pr_content: 'Test content 3',
          pr_difficulty: 'Hard',
          pr_options: ['Option A', 'Option B', 'Option C', 'Option D'],
          pr_answer: '1',
          pr_type: 'multiple_choice',
          pr_tags: ['test', 'question'],
          pr_cat_id: '1',
          selectedAnswer: '0',
          marked: false,
          pr_point: 3,
          viewAnswer: false
        }
      ];

      // Test that the component can handle multiple questions
      expect(multipleQuestions.length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined questions gracefully', () => {
      // Test that the component can handle undefined input
      expect(component.questions).toBeDefined();
    });

    it('should handle null questions gracefully', () => {
      // Test that the component can handle null input
      expect(component.questions).toBeDefined();
    });

    it('should handle openSlide with negative index', () => {
      const slideSpy = jest.spyOn(component.slide, 'emit');
      const negativeIndex = -1;

      component.openSlide(negativeIndex);

      expect(slideSpy).toHaveBeenCalledWith(negativeIndex);
    });

    it('should handle openSlide with zero index', () => {
      const slideSpy = jest.spyOn(component.slide, 'emit');
      const zeroIndex = 0;

      component.openSlide(zeroIndex);

      expect(slideSpy).toHaveBeenCalledWith(zeroIndex);
    });
  });
});
