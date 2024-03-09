import { randomUUID } from "node:crypto"
import { sql } from "./db.js"

export class DatabasePostgres{

    #videos = new Map()

    async list(search) {
        let videos

        if (search) {
            videos = await sql`SELECT * FROM VIDEOS WHERE TITLE ILIKE ${'%' + search + '%'}`
        }
        else{
            videos = await sql`SELECT * FROM VIDEOS`  
        }

        return videos
    }

    async create(video) {
        const videoId = randomUUID()
        const { title, description, duration } = video

        await sql `INSERT INTO VIDEOS (ID, TITLE, DESCRIPTION, DURATION) VALUES (${videoId}, ${title}, ${description}, ${duration})`
    }

    async update(id, video) {
        const { title, description, duration } = video

        await sql `update videos set title = ${title}, description = ${description}, duration = ${duration} WHERE id = ${id};`
    }

    async delete(id) {
        await sql `DELETE FROM videos WHERE id = ${id};`
    }
}