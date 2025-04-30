import { catchAsync, response } from '@src/lib'
import { requireAuth } from '@src/middlewares'
import { ReqWithUser } from '@src/middlewares/requireAuth.middleware'
import { Response, Router } from 'express'
import ProjectService from './project.service'
import { createProjectDto } from './project.dtos'

class ProjectController {
  private static readonly router = Router()
  private static readonly projectService: typeof ProjectService = ProjectService
  private static readonly getPath = (path: string) => `/projects${path}`

  /* Prepare the module */
  static get projectModule() {
    try {
      const EOFIndex = Object.keys(this).indexOf('EOF') + 1 || 0
      const methods = Object.keys(this).splice(EOFIndex) // skip constructor

      methods.forEach((name) => eval(`this.${name}()`))

      return this.router
    } catch (error) {
      console.log(`Project module error: ${error}`)
    }
  }

  private static readonly EOF = null // routes begin after line

  /* Hare are all the routes */
  private static readonly create = async (path = this.getPath('/')) => {
    this.router.post(
      path,
      requireAuth(),
      catchAsync(async (req: ReqWithUser, res: Response) => {
        const { id } = req.locals.user

        const body = createProjectDto.parse(req.body)

        const project = await this.projectService.createProject(id, body)

        const r = response().success(201).data(project).exec()
        res.status(r.code).json(r)
      })
    )
  }

  private static readonly update = async (
    path = this.getPath('/:projectId')
  ) => {
    this.router.patch(
      path,
      requireAuth(),
      catchAsync(async (req: ReqWithUser, res: Response) => {
        const params = req.params as {
          projectId: string
        }

        const { id } = req.locals.user
        const body = createProjectDto.parse(req.body)

        const updatedProject = await this.projectService.updateProject(
          params.projectId,
          id,
          body
        )

        const r = response().success(200).data(updatedProject).exec()
        res.status(r.code).json(r)
      })
    )
  }

  private static readonly delete = async (
    path = this.getPath('/:projectId')
  ) => {
    this.router.delete(
      path,
      requireAuth(),
      catchAsync(async (req: ReqWithUser, res: Response) => {
        const params = req.params as {
          projectId: string
        }
        const { id } = req.locals.user

        const deletedProject = await this.projectService.deleteProject(
          params.projectId,
          id
        )

        const r = response().success(200).data(deletedProject).exec()
        res.status(r.code).json(r)
      })
    )
  }
}

export default ProjectController.projectModule as Router
