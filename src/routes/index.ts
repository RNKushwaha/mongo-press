// export * from './post'
// export * from './user'
import { Router } from 'express'
import { userRouter } from './user.route'
import { postRouter } from './post.route'

const routes = Router()

routes.use('/users', userRouter)
routes.use('/posts', postRouter)

export default routes
