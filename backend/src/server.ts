import app from '@src/app'
import validatedEnv from '@lib/index'

const PORT = validatedEnv.PORT || 3000

const runApp = async () => {
  app.listen(PORT, () =>
    console.log(`Server is running at http://localhost:${PORT}`)
  )
}

runApp()
