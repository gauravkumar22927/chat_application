import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import jwt from "jsonwebtoken"
import { PubSub } from "graphql-subscriptions"
const prisma = new PrismaClient()
import { GraphQLUpload } from "graphql-upload"

import path from "path"
import fs from "fs"
const pubsub = new PubSub()
const __dirname = path.resolve()

//EVENT emit declaration
const MESSAGE_ADDED = "MESSAGE_ADDED"
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    users: async (_, args, { userId }) => {
      if (!userId) throw new GraphQLError("You must be logged in") // Changed error type
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          id: { not: userId },
        },
      })
      return users
    },
    messagesByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) throw new GraphQLError("You must be logged in") // Changed error type
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: userId,
              receiverId: receiverId,
            },
            {
              senderId: receiverId,
              receiverId: userId,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      })
      return messages
    },
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await prisma.user.findUnique({ where: { email: userNew.email } })
      if (user) {
        const error = new GraphQLError("user already exist with this email") // Changed error type
        throw error
      }

      const hashedPassword = await bcrypt.hash(userNew.password, 10)
      const newUser = await prisma.user.create({
        data: {
          ...userNew,
          password: hashedPassword,
        },
      })
      return newUser
    },
    signinUser: async (_, { userSignin }) => {
      const user = await prisma.user.findUnique({ where: { email: userSignin.email } })
      if (!user) {
        const error = new GraphQLError("user doesn't exist with this email") // Changed error type
        throw error
      }
      const doMatch = await bcrypt.compare(userSignin.password, user.password)
      if (!doMatch) {
        const error = new GraphQLError("email or password is invalid!!") // Changed error type
        throw error
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
      return { token }
    },
    createMessage: async (_, { receiverId, text, image }, { userId }) => {
      if (!userId) {
        throw new GraphQLError("You must be logged in") // Changed error type
      }

      let imageUrl = ""

      if (image) {
        try {
          // Access the 'createReadStream' function from the 'image' object
          const { createReadStream, filename } = await image
          // Generate a unique filename for the image
          const uniqueFilename = Date.now() + "_" + filename
          const imagePath = path.join(__dirname, "images", uniqueFilename) // Specify the correct path to your 'images' folder

          const writeStream = fs.createWriteStream(imagePath)

          // Pipe the image stream to the write stream
          await new Promise((resolve, reject) => {
            createReadStream().pipe(writeStream).on("finish", resolve).on("error", reject)
          })

          imageUrl = "/images/" + uniqueFilename
          console.log("Image uploaded successfully:", imageUrl)
        } catch (err) {
          console.error("Error uploading image:", err)
          imageUrl = "" // Set imageUrl to null if there's an error
        }
      }

      const message = await prisma.message.create({
        data: {
          text,
          imageUrl,
          receiverId,
          senderId: userId,
        },
      })

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message })
      return message
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED),
    },
  },
}

export default resolvers
