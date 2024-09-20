import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import { /* inject, */ BindingScope, injectable, Provider} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthorizeService implements Provider<Authorizer> {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {

    console.log('Authorization Context:', authorizationCtx);

    if (!authorizationCtx.principals[0]) {
      return AuthorizationDecision.DENY;
    }
    const clientRole = authorizationCtx.principals[0].role;
    const allowedRoles = metadata.allowedRoles;

    console.log('Client Role:', clientRole);
    console.log('Allowed Roles:', allowedRoles);

    return allowedRoles?.includes(clientRole)
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
