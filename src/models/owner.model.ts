import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Project} from './project.model';

@model()
export class Owner extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;


  //Relation "Owner belongsTo User"
  @belongsTo(() => User)
  userId: string;


  //Relation "Owner belongsTo Project"
  @belongsTo(() => Project)
  projectId: string;

  constructor(data?: Partial<Owner>) {
    super(data);
  }
}

export interface OwnerRelations {
  // describe navigational properties here
}

export type OwnerWithRelations = Owner & OwnerRelations;
