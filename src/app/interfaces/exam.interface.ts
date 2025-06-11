
import { Course } from "./course.interface";
import { Question } from "./question.interface";
import { User } from "./user.interface";

export interface Exam {
    exm_id: string; // uuid
    exm_usr_id: string | User; // uuid
    exm_name: string; // Nombre del examen
    exm_description: string; // Descripción del examen
    exm_pr: PreguntasEnExamen[] | any; // Preguntas y respuestas del examen (jsonb)
    exm_duration: string; // Duración del examen
    exm_state: string; // Estado del examen (private/public)
    exm_access: string; // Accesos al examen (jsonb)
    exm_crs_id: string | Course; // id del curso al que pertenece el examen
    created_at: string; // Fecha de creación del examen
    marked?: boolean;
}

export interface PreguntasEnExamen {
    pr_id?: string;
    pr_point?: number;
}
