import { IUserEntityDomain } from "@/domain/user/entity/user.entity.domain";

export interface IUserTableData {
    id: string;
    username: string;
    email: string;
    roles: string;
    status: string;
    lastLogin: string;
}

function mapUserToTable(user: any, index: number): IUserTableData {
    return {
        id: user.user_Id || user.id || `user_${index}`,
        username: user.username || user.email || `Usuario${index + 1}`,
        email: user.email || '',
        roles: user.roles || '',
        status: user.status === 'active' || user.status === 'Activo' ? 'Activo' : 'Inactivo',
        lastLogin: user.last_login_at
            ? new Date(user.last_login_at).toLocaleDateString('es-ES')
            : '',
    };
}

export async function getAllUsersTableAction(): Promise<IUserTableData[]> {
    try {
        const response = await fetch(`http://localhost:3000/onerp/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error al obtener usuarios: ${response.status} - ${response.statusText}`);
        }
        const rawData = await response.json();
        if (!Array.isArray(rawData)) {
            throw new Error('Formato de datos inesperado de la API');
        }
        return rawData.map((user, index) => mapUserToTable(user, index));
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
} 