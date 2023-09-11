import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { ArticleModule } from './article/article.module';
import { ContentModule } from './content/content.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import {MailerModule} from '@nestjs-modules/mailer';
import { ReviewModule } from './review/review.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '1910008', // Consider not hardcoding this
      username: 'postgres',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      //dropSchema:true,
      database: 'blog',
      synchronize: true,
      logging: true,
    }),
    ArticleModule,
    ContentModule,
    UserModule,
    EmailModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor  
    },
    
  ],
})
export class AppModule {}
