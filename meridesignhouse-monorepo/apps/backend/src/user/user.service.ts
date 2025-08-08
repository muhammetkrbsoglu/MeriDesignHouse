import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByClerkId(clerkId: string) {
    if (!clerkId) {
      return null;
    }
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async findAll(params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: Array<{
      id: string;
      clerkId: string | null;
      email: string | null;
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      role: string;
      createdAt: Date;
      _count: { sentMessages: number; receivedMessages: number };
    }>;
    totalCount: number;
  }> {
    const search = params?.search?.trim() ?? '';
    const role = params?.role ?? 'all';
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
                { firstName: { contains: search, mode: 'insensitive' as const } },
                { lastName: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {},
        role !== 'all' ? { role } : {},
      ],
    };

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          clerkId: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              sentMessages: true,
              receivedMessages: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, totalCount };
  }
}
