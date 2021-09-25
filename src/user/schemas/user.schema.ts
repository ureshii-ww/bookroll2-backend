import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from './role.schema';
import { Club } from '../../club/schemas/club.schema';
import { Review } from '../../review/schemas/review.schema';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {

  @ApiProperty({example: 'username', description: 'Username' })
  @Prop()
  username: string;

  @ApiProperty({example: 'mail@gmail.com', description: 'Email' })
  @Prop()
  email: string;

  @ApiProperty({example: 'password1234', description: 'Password' })
  @Prop()
  password: string;

  @ApiProperty({example: 'dQw4w9WgXcQ', description: 'User\'s url' })
  @Prop()
  url: string;

  @ApiProperty({
    type: mongoose.Schema.Types.ObjectId,
    example: '[606896ba6afd6e0458163ffc, 606896ba6afd6e0458163ffd]',
    description: 'Array of user\'s roles in ObjectId',
    isArray: true})
  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @ApiProperty({
    type: mongoose.Schema.Types.ObjectId,
    example: '606896ba6afd6e0458163ffd',
    description: 'ObjectID of User\'s club'})
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Club' })
  club: Club;

  @ApiProperty({example: '#FFFFFF', description: 'Main user\'s color' })
  @Prop()
  color: string;

  @ApiProperty({example: '😂', description: 'User\s emoji' })
  @Prop()
  emoji: string;

  @ApiProperty({
    type: [mongoose.Types.ObjectId],
    example: '[606896ba6afd6e0458163ffc, 606896ba6afd6e0458163ffd]',
    description: 'Array of user\'s reviews in ObjectId' })
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Review' })
  reviewsList: Review[];
}

export const UserSchema = SchemaFactory.createForClass(User);