import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {OwnerDataSource} from '../datasources';
import {Owner, OwnerRelations, User, Project} from '../models';
import {UserRepository} from './user.repository';
import {ProjectRepository} from './project.repository';

export class OwnerRepository extends DefaultCrudRepository<
  Owner,
  typeof Owner.prototype.id,
  OwnerRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Owner.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof Owner.prototype.id>;

  constructor(
    @inject('datasources.owner') dataSource: OwnerDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(Owner, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
