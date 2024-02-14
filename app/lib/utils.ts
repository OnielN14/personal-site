import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPageUrl(request: Request) {
  const forwardedProto = request.headers.get('X-Forwarded-Proto') ?? request.headers.get('x-forwarded-roto')

  const url = new URL(request.url)
  url.protocol = forwardedProto ?? url.protocol

  return url
}
