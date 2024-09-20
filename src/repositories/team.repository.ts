import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {TeamDataSource} from '../datasources';
import {Team, TeamRelations, User, Project} from '../models';
import {UserRepository} from './user.repository';
import {ProjectRepository} from './project.repository';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {

  public readonly users: HasManyRepositoryFactory<User, typeof Team.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof Team.prototype.id>;

  constructor(
    @inject('datasources.team') dataSource: TeamDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(Team, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
