import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guards';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PostsModule,
    MailModule,
    ChatModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
