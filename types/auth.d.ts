declare module '#auth-utils' {
  interface User {
    sub: number
    picture: string
    name: string
    email: string
    given_name: string
  }
}
export {}
