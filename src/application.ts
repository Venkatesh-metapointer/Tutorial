import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import path from 'path';
import {MySequence} from './sequence';


//Bind JWT Component in the Application
import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent} from './jwt-authentication-component';
import {AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags} from '@loopback/authorization';
import {AuthorizeService} from './services';


export {ApplicationConfig};

export class Tutorial1Application extends BootMixin(RepositoryMixin(RestApplication)) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);


    // ------ADD SNIPPET AT THE BOTTOM ------
    //Mount authentication
    this.component(AuthenticationComponent);

    //Mount JWT component
    this.component(JWTAuthenticationComponent);


    // ------END OF  SNIPPET ------


    

   // ------ Authorization Logic ------

   const optionsA: AuthorizationOptions = {
    precedence: AuthorizationDecision.DENY,
    defaultDecision: AuthorizationDecision.DENY,
  };

  const binding = this.component(AuthorizationComponent);

  this.configure(binding.key).to(optionsA);

  this.bind('authorizationProviders.my-authorizer-provider')
    .toProvider(AuthorizeService)
    .tag(AuthorizationTags.AUTHORIZER);

  // ------ End of Authorization Logic ------





    this.projectRoot = __dirname;

    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
