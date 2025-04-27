export interface Question {
    pr_id?: string;
    pr_question: string;
    pr_content: string;
    pr_difficulty: string;
    pr_options: string[];
    pr_answer: string;
    pr_type: string;
    pr_tags: string[];
    pr_cat_id: string;
    pr_img?: string;
    created_at?: string;
    selectedAnswer?: string | null;
    marked?: boolean;
    pr_point?: number;
    viewAnswer?: boolean;
}
