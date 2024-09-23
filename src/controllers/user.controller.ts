import {authenticate, TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository, } from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcrypt';
import _ from 'lodash';
import {User} from '../models';
import {RoleRepository, UserRepository} from '../repositories';
import {MyUserService} from '../services';
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private jwtService: TokenService,
    @inject('services.MyUserService')
    private userService: MyUserService,
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(SecurityBindings.USER, {optional: true})
    private userProfile: UserProfile,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) { }

  @post('/signup')
  @response(200, {
    description: 'Create a new user',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })

  async signup(@requestBody(
    {
      description: 'New User Signup',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              phoneNumber: {type: 'number'},
              email: {type: 'string', format: 'email'},
              password: {type: 'string'},
              username: {type: 'string'},
              roleId: {type: 'string'}
            },
            required: ['name', 'phoneNumber', 'email', 'password', 'username', 'roleId'],
          },
        },
      }
    }
  )
  userData: Omit<User, 'id'> & {password: string}): Promise<User> {
    try {
      console.log('Signup request received: ', userData);
      
      if (!userData.email || !userData.password) {
        throw new HttpErrors.BadRequest('Email and password are required');
      }

      const existingUser = await this.userRepository.findOne({
        where: {email: userData.email},
      });
      if (existingUser) {
        console.log('Signup failed; Email already in use:', userData.email);
        throw new HttpErrors.Conflict('User with this Email already exists');
      }

      const passwordHash = await hash(userData.password, await genSalt());
      const userWithoutPassword = _.omit(userData, 'password');
      const savedUser = await this.userRepository.create(userWithoutPassword);



      const userCredentials = await this.userRepository.usercredentials(savedUser.id).create({password: passwordHash});
      if (!userCredentials) {
        throw new HttpErrors.InternalServerError('User credentials repository not found');
      }

      console.log('New User created successfully', savedUser);
      return savedUser;
    }
    catch (error) {
      console.error('Full error during signup:', error);
      throw new HttpErrors.BadRequest(`Error during signup: ${error.message}`);
    }
  }

  @post('/login')
  @response(200, {
    description: 'Generate a JWT token for user',
    content: {'application/json': {schema: {type: 'object', properties: {token: {type: 'string'}}}}}
  })

  async login(@requestBody(
    {
      description: 'User credentials (email and password)',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      }
    }
  ) credentials: {email: string, password: string, roleId: string}): Promise<{token: string}> {
    try {
      console.log('Login attempt with email:', credentials.email);

      const user = await this.userRepository.findOne({
        where: {email: credentials.email},

      });

      if (!user) {
        console.log('Login failed: User not found with email:', credentials.email);
        throw new HttpErrors.Unauthorized('Invalid email or password');
      }

      const validPassword = await this.userService.verifyCredentials(credentials);

      if (!validPassword) {
        console.log('Login failed: Invalid password for email:', credentials.email);
        throw new HttpErrors.Unauthorized('Invalid email or password');
      }

      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      console.log('Login successful, JWT token generated for email:', credentials.email);
      return {token};
    } catch (error) {
      console.error('Login error:', error.message);
      throw new HttpErrors.Unauthorized(`Login failed: ${error.message}`);
    }
  }

  @get('/whoami')
  @response(200, {
    description: 'Get the current user profile',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  @authenticate('jwt')
  async whoami(): Promise<UserProfile> {
    if (!this.userProfile) {
      throw new HttpErrors.Unauthorized('User not authenticated');
    }
    console.log('whoami response:', this.userProfile);
    return this.userProfile;
  }

  /*
   @post('/users')
   @response(200, {
     description: 'Create a new user',
     content: { 'application/json': { schema: getModelSchemaRef(User) } },
   })
   async create(@requestBody() user: User): Promise<User> {
     return this.userRepository.create(user);
   }

   @get('/users/count')
   @response(200, {
     description: 'Count the number of users',
     content: { 'application/json': { schema: CountSchema } },
   })
   async count(@param.where(User) where?: Where<User>): Promise<Count> {
     return this.userRepository.count(where);
   }

   @get('/users')
   @response(200, {
     description: 'Get an array of users',
     content: {
       'application/json': {
         schema: {
           type: 'array',
           items: getModelSchemaRef(User, { includeRelations: true }),
         },
       },
     },
   })
   async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
     return this.userRepository.find(filter);
   }

   @patch('/users')
   @response(200, {
     description: 'Update multiple users',
     content: { 'application/json': { schema: CountSchema } },
   })
   async updateAll(
     @requestBody() user: User,
     @param.where(User) where?: Where<User>,
   ): Promise<Count> {
     return this.userRepository.updateAll(user, where);
   }

   @get('/users/{id}')
   @response(200, {
     description: 'Get a user by ID',
     content: {
       'application/json': {
         schema: getModelSchemaRef(User, { includeRelations: true }),
       },
     },
   })
   async findById(
     @param.path.string('id') id: string,
     @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>,
   ): Promise<User> {
     return this.userRepository.findById(id, filter);
   }

   @patch('/users/{id}')
   @response(204, {
     description: 'Update a user by ID',
   })
   async updateById(
     @param.path.string('id') id: string,
     @requestBody() user: User,
   ): Promise<void> {
     await this.userRepository.updateById(id, user);
   }

   @put('/users/{id}')
   @response(204, {
     description: 'Replace a user by ID',
   })
   async replaceById(
     @param.path.string('id') id: string,
     @requestBody() user: User,
   ): Promise<void> {
     await this.userRepository.replaceById(id, user);
   }

   @del('/users/{id}')
   @response(204, {
     description: 'Delete a user by ID',
   })
   async deleteById(@param.path.string('id') id: string): Promise<void> {
     await this.userRepository.deleteById(id);
   }*/
}
