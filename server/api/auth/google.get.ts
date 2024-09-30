import { db } from '~~/server/utils/db'

export default oauthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const email: string = user.email
    // Vérifiez si l'email est autorisé
    const allowedUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    })
    // Si l'utilisateur n'est pas trouvé dans la base de données, refusez l'accès
    if (!allowedUser) {
      return sendRedirect(event, '/login?error=unauthorized')
    }
    await setUserSession(event, { user })
    return sendRedirect(event, '/')
  },
  async onError(event) {
    return sendRedirect(event, '/login')
  },
  config: {
    authorizationParams: {
      prompt: 'select_account'
    }
  }
})
