import { fastify }  from 'fastify'
import cors from '@fastify/cors'
// import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'
const urls = ["http://localhost:5173/", "http://localhost:3333/"]

const server = fastify()

await server.register(cors, { 
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  })

// fastify.addHook('preHandler', (req, reply, done) => {
//     reply.header("Access-Control-Allow-Origin", "http://localhost:5173/")
//     reply.header("Access-Control-Allow-Headers", "content-type")
//     reply.header("Access-Control-Allow-Methods", "PUT, PATCH, DELETE")
//     done()
//   })

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

// Request Body

server.post('/videos', async (request, reply) => {
    const { title, description, duration } = request.body


    await database.create({
        title: title,
        description: description,
        duration: duration,
    })

    return reply.status(201).send()
    // console.log(database.list())
})

server.get('/videos', async (request) => {
    const search = request.query.search
    const videos = await database.list(search)

    return videos
})

server.put('/videos/:id', async (request, reply) => {

    const videoId = request.params.id
    const { title, description, duration } = request.body

    await database.update(videoId, {
        title,
        description,
        duration,
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
    const videoId = request.params.id

    await database.delete(videoId)

    return reply.status(204).send()
})

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
})