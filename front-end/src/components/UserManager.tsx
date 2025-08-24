import React, {useState, useEffect} from "react";
import { apiService, User, CreateUserRequest } from '../../../back-end/src/services/api';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newUser, setNewUser] = useState<CreateUserRequest>({name: '', email: ''});

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try{
            setLoading(true);
            setError(null);
            const userData = await apiService.getUsers();
            setUsers(userData);
        }catch(err){
            setError('Error al cargar usuarios');
            console.error(err);
        }finally{
            setLoading(false);
        }
    };
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newUser.name || !newUser.email) {
            setError('Nombre y email son requeridas');
            return;
        }
        try{
            setError(null);
            const createdUser = await apiService.createUser(newUser);
            setUsers(prev => [...prev, createdUser]);
            setNewUser({name: '', email: ''});
        }catch(err){
            setError('Error al crear usuario');
            console.error(err);
        }
    };
    if (loading) {
        return(
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    return(
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Gestión de Usuarios
            </h1>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            {/**Formulario de creación */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Crear Usuarios</h2>
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser(prev => ({...prev, name: e.target.value}))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese el nombre"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese el email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Crear Usuario
                    </button>
                </form>
            </div>
            {/* Lista de usuarios */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold p-6 border-b">Lista de Usuarios</h2>
                {users.length === 0 ? (
                    <p className="p-6 text-gray-500">No hay usuarios registrados</p>
                ): (
                    <div className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <div key={user.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {user.name}
                                        </h3>
                                        <p className="text-gray-600">{user.email}</p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        ID: {user.id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManager;