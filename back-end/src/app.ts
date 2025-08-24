import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

//MiddleWare
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000']
}));
app.use(express.json());

//basic Routes
app.get('/api/health', (req, res) => {
    res.json({message: 'Back-end funcionando exitosamente'})
});

//ejemplo crud para usuarios
app.get('/api/users', async (req,res) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    } catch(error){
        res.status(500).json({error:'Error al obtener usuarios'})
    }
});

app.post('/api/users', async (req, res) => {
    try{
        const { name, email } = req.body;
        const users = await prisma.user.createUser({
            data: name, email
        });
        res.json(users);
    }catch(error){
        res.status(401).json({error:'Error al crear al usuario'});
    }
});

//iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`escuchando al servidor en puerto ${PORT}`)
})

//graceful shutdown
process.on('SIGTERM', async () => {
    console.log('cerrando servidor...');
    await prisma.$disconnect();
    server.close();
});

export default app;