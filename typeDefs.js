const typeDefs = `#graphql
  type Query {
    users: [User]
    messagesByUser(receiverId:Int!):[Message]
  }  
  type User {
    id:ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  input UserInput{
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UsersigninInput{
    email: String!
    password: String!
  }
  type Token{
    token: String!
  }
  scalar Date
  scalar Upload

  type Message{
    id:ID!
    text:String
    imageUrl:String
    receiverId:Int!
    senderId:Int!
    createdAt:Date!
  }
  type Mutation{
    signupUser(userNew:UserInput!): User
    signinUser(userSignin:UsersigninInput!): Token
    createMessage(receiverId : Int!,text : String,image: Upload):Message
  }

  type Subscription{
    messageAdded : Message
  }
`
export default typeDefs
