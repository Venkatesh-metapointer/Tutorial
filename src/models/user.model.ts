import {Entity, hasMany, hasOne, model, property, belongsTo} from '@loopback/repository';
import {Team} from './team.model';
import {Usercredentials} from './usercredentials.model';
import {Role} from './role.model';

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

  @property({
    type: 'string',
  })
  username?: string;

  //Relation "User hasOne Usercredentials"
  @hasOne(() => Usercredentials)
  usercredentials: Usercredentials;

  @property({
    type: 'string',
  })
  teamId?: string;

  
  @belongsTo(() => Role,
)
  roleId: string;

  // Relation "Team hasMany Users"
  @hasMany(() => Team)
  teams: Team[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

// Define navigational properties in the UserRelations interface
export interface UserRelations {
  // describe navigational properties here

}

export type UserWithRelations = User & UserRelations;
