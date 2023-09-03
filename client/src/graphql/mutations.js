import { gql } from "@apollo/client"

export const SIGNUP_USER = gql`
  mutation SignupUser($userNew: UserInput!) {
    signupUser(userNew: $userNew) {
      email
      firstName
      id
      lastName
    }
  }
`
export const LOGIN_USER = gql`
  mutation Mutation($userSignin: UsersigninInput!) {
    signinUser(userSignin: $userSignin) {
      token
    }
  }
`

export const SEND_MSG = gql`
  mutation Mutation($receiverId: Int!, $text: String, $image: Upload) {
    createMessage(receiverId: $receiverId, text: $text, image: $image) {
      id
      text
      imageUrl
      receiverId
      senderId
      createdAt
    }
  }
`
