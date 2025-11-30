import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            isSubscribed: boolean
            questionsUsed: number
            freeQuestionLimit: number
        } & DefaultSession["user"]
    }
}
