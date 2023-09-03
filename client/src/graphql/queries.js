import { gql } from "@apollo/client"

export const GET_ALL_USERS = gql`
  query Query {
    users {
      email
      firstName
      id
      lastName
    }
  }
`
export const GET_MSG = gql`
  query MessagesByUser($receiverId: Int!) {
    messagesByUser(receiverId: $receiverId) {
      createdAt
      id
      receiverId
      senderId
      text
      imageUrl
    }
  }
`
