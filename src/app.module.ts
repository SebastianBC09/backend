import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { validationSchema } from './config/validation.schema';
import { ItemsModule } from './modules/items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri') as string,
      }),
    }),
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
