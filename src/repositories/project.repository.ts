import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {ProjectDataSource} from '../datasources';
import {Project, ProjectRelations, Team} from '../models';
import {TeamRepository} from './team.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly teams: HasManyRepositoryFactory<Team, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.project') dataSource: ProjectDataSource, @repository.getter('TeamRepository') protected teamRepositoryGetter: Getter<TeamRepository>,
  ) {
    super(Project, dataSource);
    this.teams = this.createHasManyRepositoryFactoryFor('teams', teamRepositoryGetter,);
    this.registerInclusionResolver('teams', this.teams.inclusionResolver);
  }
}
