export async function autenticar(email, clave) {
    // simulación
    await new Promise((r) => setTimeout(r, 600));
    if (email === 'usuario@email.com' && clave === '123456') {
        return { id: 1, email, nombre: 'Usuario' };
    }
    throw new Error('Credenciales inválidas');
}
