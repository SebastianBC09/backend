import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { IItemRepository } from '../../modules/items/infrastructure/repositories/item.repository.interface';
import { Product } from '../../modules/items/domain/entities/product.entity';
import { Event } from '../../modules/items/domain/entities/event.entity';

async function seedItems() {
  console.log('🌱 Starting seed...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const itemRepository = app.get<IItemRepository>('IItemRepository');

  try {
    const sunglasses = new Product({
      name: 'Sunglasses Carey',
      price: 39.99,
      stock: 20,
      thumbnail: 'https://via.placeholder.com/150/sunglasses',
      description: 'Stylish Carey sunglasses with UV protection',
      brand: 'Carey',
      category: 'Accessories',
      color: 'Brown',
      size: 'One Size',
      material: 'Plastic',
      weight: 150,
    });

    const tshirt = new Product({
      name: 'Classic White T-Shirt',
      price: 19.99,
      stock: 50,
      thumbnail: 'https://via.placeholder.com/150/tshirt',
      description: 'Comfortable cotton t-shirt',
      brand: 'BasicWear',
      category: 'Clothing',
      color: 'White',
      size: 'M',
      material: 'Cotton',
      weight: 200,
    });

    const rhcpConcert = new Event({
      name: 'Red Hot Chili Peppers in Madrid',
      price: 60.0,
      stock: 100,
      thumbnail: 'https://via.placeholder.com/150/concert',
      description: 'Live concert at WiZink Center',
      eventDate: new Date('2025-07-15T20:00:00Z'),
      eventTime: '20:00',
      location: 'Madrid',
      venue: 'WiZink Center',
      artist: 'Red Hot Chili Peppers',
      genre: 'Rock',
      duration: 180,
      ageRestriction: 16,
      seatType: 'General Admission',
    });

    const jazzFestival = new Event({
      name: 'Barcelona Jazz Festival',
      price: 45.0,
      stock: 200,
      thumbnail: 'https://via.placeholder.com/150/jazz',
      description: 'Annual jazz festival featuring multiple artists',
      eventDate: new Date('2025-09-20T19:00:00Z'),
      eventTime: '19:00',
      location: 'Barcelona',
      venue: 'Palau de la Música',
      artist: 'Various Artists',
      genre: 'Jazz',
      duration: 240,
      ageRestriction: 0,
      seatType: 'Reserved Seating',
    });

    await itemRepository.create(sunglasses);
    console.log('✅ Created: Sunglasses Carey');

    await itemRepository.create(tshirt);
    console.log('✅ Created: Classic White T-Shirt');

    await itemRepository.create(rhcpConcert);
    console.log('✅ Created: Red Hot Chili Peppers in Madrid');

    await itemRepository.create(jazzFestival);
    console.log('✅ Created: Barcelona Jazz Festival');

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await app.close();
  }
}

seedItems();
