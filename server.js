import { ApolloServer, gql } from "apollo-server-express"
import typeDefs from "./typeDefs.js"
import resolvers from "./resolvers.js"
import jwt from "jsonwebtoken"
import { makeExecutableSchema } from "@graphql-tools/schema"

import { useServer } from "graphql-ws/lib/use/ws"
import { WebSocketServer } from "ws"
import express from "express"
import path from "path"
import bodyParser from "body-parser"
import { graphqlUploadExpress } from "graphql-upload"
const __dirname = path.resolve()
import cors from "cors"
const port = process.env.PORT || 4000

const app = express()

app.use(cors<cors.CorsRequest>({
  origin: ['http://localhost:3000', '*']
}));


app.use("/images", express.static(path.join(__dirname, "images")))
app.use(bodyParser.json())
app.use("/graphql", graphqlUploadExpress())
const context = ({ req, res }) => {
  const { authorization } = req.headers
  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET)
    return { userId }
  }
}
const schema = makeExecutableSchema({ typeDefs, resolvers })

const apolloserver = new ApolloServer({
  schema,
  context,
  uploads: false,
})
await apolloserver.start()
apolloserver.applyMiddleware({ app, path: "/graphql" })

const server = app.listen(port, () => {
  const wsServer = new WebSocketServer({
    server,
    path: "/graphql",
  })
  useServer({ schema }, wsServer)
  console.log("🚀  Server ready at: http://localhost:4000/graphql ")
})
