import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateQuantityDto {
  @ApiProperty({
    description: 'New quantity (0 to remove item)',
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  quantity: number;
}
