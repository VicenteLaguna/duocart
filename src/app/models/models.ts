export interface UserI{
    image: any;
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
    id: string,
    conductor:string;
    hora_salida:Date;
    puestos_disp:number;
    precio:string
}

export const Sedes = [
'Alameda','Antonio Varas',
'Educación continua','Maipú',
'Melipilla','Padre Alonso de Ovalle',
'Plaza Norte','Plaza Oeste',
'Plaza Vespucio','Puente Alto',
'San Bernardo','San Carlos de Apoquindo',
'San Joaquín','Valparaíso',
'Viña del Mar','Campus Nacimiento',
'San andres de concepción','Villarrica',
'Puerto Montt']