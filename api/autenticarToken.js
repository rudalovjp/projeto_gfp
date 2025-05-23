import jwt from 'jsonwebtoken';

const SECRET_KEY = 'sua_chave_secreta'; // Troque por uma chave segura

export function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token recebido:", token);
  

  if (!token) return res.status(403).json({ message: "Token não fornecido" });

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    req.usuario = usuario;
    next();
  });
}