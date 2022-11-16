export interface UserI{
    rut: string;
    nombre: string;
    p_apellido: string;
    s_apellido: string;
    correo: string;
    fnac: Date;
    uid: string;
    password: string;
    perfil: 'conductor'|'pasajero'
    sede: string;
}

export interface tarifas{
    uid: string,
    conductor:string;
    hora_salida:Date;
    puestos_disp:number;
    precio:string
}