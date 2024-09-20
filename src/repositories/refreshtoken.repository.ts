import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {UserDataSource} from '../datasources';
import {Refreshtoken, RefreshtokenRelations} from '../models';

export class RefreshtokenRepository extends DefaultCrudRepository<
  Refreshtoken,
  typeof Refreshtoken.prototype.id,
  RefreshtokenRelations
> {
  constructor(
    @inject('datasources.usercredentials') dataSource: UserDataSource,
  ) {
    super(Refreshtoken, dataSource);
  }
}
