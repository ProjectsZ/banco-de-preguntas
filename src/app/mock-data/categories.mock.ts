import { Category } from "../interfaces/category.interface";

export const categories: Category[] = 
[
    { 
        cat_id: '1', 
        cat_title: 'General Knowledge', 
        cat_subtitle: 'General Knowledge Quiz',
        cat_description: 'A quiz that tests your general knowledge on various topics.',
        cat_crs_id: '1',
        created_at: '2023-10-01' 
    },
    {
        cat_id: '2', 
        cat_title: 'Science', 
        cat_subtitle: 'Science Quiz',
        cat_description: 'A quiz that tests your knowledge of science.',
        cat_crs_id: '1',
        created_at: '2023-10-02' 
    },
    { 
        cat_id: '3', 
        cat_title: 'History', 
        cat_subtitle: 'History Quiz',
        cat_description: 'A quiz that tests your knowledge of history.',
        cat_crs_id: '1',
        created_at: '2023-10-03'
    }
]

