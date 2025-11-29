import { clsx, type ClassValue } from 'clsx'
import { io } from 'socket.io-client';
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const socketRef =()=>{
  return io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
    transports: ["websocket"],
  })}