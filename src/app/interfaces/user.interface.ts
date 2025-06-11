export interface User {
    usr_id?: string;
    usr_username: string;
    usr_email: string;
    usr_password?: string;
    usr_recoveryToken?: string;
    usr_is_google_authenticated?: boolean;
    usr_is_active?: boolean;
    usr_r_id?: role;
    usr_infp_id?: informacionPersonal;
    updated_at?: string;
    created_at?: string;
    usr_coin?: string;//moneditas;
}

// interface moneditas{
//     cn_count?: number;
//     cn_history?: CoinComment[];
// }

// interface CoinComment {
//     coin_id?: string; // opcional: ID del comentario
//     coin_comment?: string;
//     coin_payment?: string;
//     coin_usr_id?: string; // o Date si lo manejas como objeto
//     created_at?: string;       // opcional: quién hizo el comentario
// }

interface role{
    r_id?: string;
    r_name: string;
    r_description?: string;
    r_level: string;
    r_permissions?: string[];
}

interface informacionPersonal{
    infp_id?: string;
    infp_firstname: string;
    infp_lastname: string;
    infp_phone: string;
    infp_address: string;
    infp_birthday: Date;
    infp_img: string;
}