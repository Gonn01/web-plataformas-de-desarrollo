// Mock de autenticación simple:
// Acepta: email = admin@prueba.com  |  password = 123456
export async function autenticar(email, password) {
  await new Promise((r) => setTimeout(r, 400)); // pequeño delay
  const ok = email?.toLowerCase() === "admin@prueba.com" && password === "123456";
  if (!ok) throw new Error("Credenciales inválidas");
  return { email };
}
