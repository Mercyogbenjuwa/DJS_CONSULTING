import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  coverImgUrl: string;

}
