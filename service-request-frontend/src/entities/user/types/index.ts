// Пользователь с role как объект (из GET /users)
export interface User {
  id: number;
  fio: string;
  phone: string;
  login: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
}

// DTO для создания пользователя (бэк принимает только 'Админ' или 'Менеджер'!)
export interface CreateUserDTO {
  fio: string;
  phone: string;
  login: string;
  password: string;
  roleName: 'Админ' | 'Менеджер';
}
