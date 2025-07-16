import { ForbiddenException } from "@nestjs/common";

export function checkOwnership(resourceUserId: string, currentUserId: string) {
  if (resourceUserId !== currentUserId) {
    throw new ForbiddenException('You do not have access to this resource');
  }
}
