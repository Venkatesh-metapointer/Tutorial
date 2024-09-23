import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, juggler, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {UserDataSource} from '../datasources';
import { User, UserRelations, Usercredentials, Team, Role} from '../models';
import {UsercredentialsRepository} from './usercredentials.repository';
import {TeamRepository} from './team.repository';
import {RoleRepository} from './role.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly usercredentials: HasOneRepositoryFactory<Usercredentials, typeof User.prototype.id>;
  public readonly teams: HasManyRepositoryFactory<Team, typeof User.prototype.id>;

  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  constructor(
    @inject(`datasources.${UserDataSource.dataSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('usercredentialsRepository')
    protected usercredentialsRepositoryGetter: Getter<UsercredentialsRepository>, @repository.getter('TeamRepository') protected teamRepositoryGetter: Getter<TeamRepository>, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,

  ) {
    super(User, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.teams = this.createHasManyRepositoryFactoryFor('teams', teamRepositoryGetter,);
    this.registerInclusionResolver('teams', this.teams.inclusionResolver);

    this.usercredentials = this.createHasOneRepositoryFactoryFor('usercredentials', usercredentialsRepositoryGetter);
    this.registerInclusionResolver('usercredentials', this.usercredentials.inclusionResolver);
  }


  
  async findCredentials(userId: typeof User.prototype.id): Promise<Usercredentials | undefined> {
    try {
      return await this.usercredentials(userId).get();
    }
    catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') return undefined;
      throw err;
    }
  }


}
