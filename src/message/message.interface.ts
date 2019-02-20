export interface IThread {
  createdAt: Date
  id: number
  participants: IParticipant[]
  updatedAt: Date
}

export interface IMessage {
  content: string
  createdAt: Date
  id: number
  participant: IParticipant
  thread: IThread
  updatedAt: Date
}

export interface IParticipant {
  createdAt: Date
  id: number
  updatedAt: Date
  userId: number
}
