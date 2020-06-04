import express from 'express';
import {ApolloServer}  from 'apollo-server-express';
import {typeDefs} from './data/schema';
import {resolvers} from './data/resolvers';

import dotenv  from 'dotenv';
dotenv.config({path: 'variables.env'});
import jwt from 'jsonwebtoken';

const app = express();
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: async({req}) => {
        //Obtener el token del servidor
        const token = req.headers['authorization'];

        if(token !== "null") {
            try {
                //Verificar el token del fron end (cliente)
                const usuarioActual = await jwt.verify(token, process.env.SECRETO);

                //agregamos el usuario actual al request
                req.usuarioActual = usuarioActual;

                return {
                    usuarioActual
                }
            } catch(err){
                console.log(err);
                
            }
        }
        
    }
});

server.applyMiddleware({app});

app.listen({port: 4000}, ()=> console.log(`Corriendo http://localhost:4000${server.graphqlPath}`));

