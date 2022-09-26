import { Request, Response, Router } from 'express'

export const postRouter = Router()

postRouter.get('/', (req: Request, res: Response) => {
  res.json([
    { title: 'First Post', description: 'This is my first post' },
    { title: 'Second Post', description: 'This is my second post' },
  ])
})

postRouter.post('/', (req: Request, res: Response) => {
  res.json(req.body)
})

// export {router as postRouter}
