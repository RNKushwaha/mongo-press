import { Request, Response, Router } from 'express'

export const userRouter = Router()

userRouter.get('/', (req: Request, res: Response) => {
  res.json([{ name: 'RN', email: 'rn@gmail.com' }])
})

userRouter.post('/', (req: Request, res: Response) => {
  res.json(req.body)
})

// export {router as userRouter}
