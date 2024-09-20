import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Project} from './project.model';

@model()
export class Team extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    //required: true,
  })
  ownerId?: string;

  @property({
    type: 'string',
    //required: true,
  })
  memberIds: string;



  @property({
    type: 'string',
  })
  userId?: string;

  
  //Relation "Team belongsTo Users"
  @belongsTo(() => Project)
  projectId: string;

  //Relation "Team hasMany Users"
  @hasMany(() => User)
  users: User[];


  constructor(data?: Partial<Team>) {
    super(data);
  }
}

export interface TeamRelations {
  // describe navigational properties here
}

export type TeamWithRelations = Team & TeamRelations;
