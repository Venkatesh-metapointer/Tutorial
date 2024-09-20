import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Usercredentials extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @belongsTo(() => User)
  userId: string;


  constructor(data?: Partial<Usercredentials>) {
    super(data);
  }
}

export interface UsercredentialsRelations {
  // describe navigational properties here
}

export type UsercredentialsWithRelations = Usercredentials & UsercredentialsRelations;
