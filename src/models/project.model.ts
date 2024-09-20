import {Entity, model, property, hasMany} from '@loopback/repository';
import {Team} from './team.model';

@model()
export class Project extends Entity {
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


  //Relation "Project hasMany Teams"
  @hasMany(() => Team)
  teams: Team[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {

}

export type ProjectWithRelations = Project & ProjectRelations;
