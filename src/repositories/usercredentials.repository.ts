import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, juggler, repository} from '@loopback/repository';
import {UserDataSource} from '../datasources';
import {User, Usercredentials, UsercredentialsRelations} from '../models';
import {UserRepository} from './user.repository';

export class UsercredentialsRepository extends DefaultCrudRepository<
  Usercredentials,
  typeof Usercredentials.prototype.id,
  UsercredentialsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Usercredentials.prototype.id>;
  // public readonly user: BelongsToAccessor<User, typeof Usercredentials.prototype.id>;

  constructor(
    @inject(`datasources.${UserDataSource.dataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Usercredentials, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    // this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    // this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
