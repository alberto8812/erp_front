import { mapUserEntityDomain } from "@/domain/user/mappers/user.mappers";


export async function getAllUsersAction() {
    const response = await fetch(`http://localhost:3000/onerp/user`);
    const data = await response.json();
    //mapear los datos a un array de objetos
    const users = data.map(mapUserEntityDomain);
    return users;
}