
export interface Dictionary {
    dic_id?: string;
    dic_name: string;
    dic_description: DictionaryDescription[];
    dic_cat_id: string;
    dic_like: number;
    dic_img?: string;
    updateAt?: string;
    createAt?: string;
    categorias?: any;
}

export interface DictionaryDescription {
    text: string;
    calification: number; // Valor de 0 a 10
    image: string;
}

export interface OrderCatDictionary{
    categoria_title: string;
    data_dic: Dictionary[];
}