import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    AppModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    this.checkDatabaseConnection();
  }
  private readonly logger = new Logger(AppModule.name);


  private async checkDatabaseConnection() {
    try {
      await this.connection.query('SELECT 1');
      this.logger.log('Database connection is successful.');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }
}
