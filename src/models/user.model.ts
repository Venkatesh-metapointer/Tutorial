import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Team} from './team.model';
import {Usercredentials} from './usercredentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  phoneNumber: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;


  // @property({
  //   type: 'string',
  // })
  // username?: string;

  @property({
    type: 'string',
  })
  role?: string;


  //Relation "User hasOne Usercredentials"
  @hasOne(() => Usercredentials)
  usercredentials: Usercredentials;


  @property({
    type: 'string',
  })
  teamId?: string;


  //Relation "Team hasMany Users"
  @hasMany(() => Team)
  teams: Team[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
