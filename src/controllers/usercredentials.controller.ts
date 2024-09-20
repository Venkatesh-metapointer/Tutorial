import {authenticate, TokenService} from '@loopback/authentication';
import {TokenServiceBindings, User} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param, post, requestBody} from '@loopback/rest';
import {Usercredentials} from '../models';
import {UsercredentialsRepository, UserRepository} from '../repositories';

export class UsercredentialsController {

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @repository(UsercredentialsRepository)
    public usercredentialsRepository: UsercredentialsRepository,
    @inject('repositories.UserRepository')
    public userRepository: UserRepository,
  ) { }


  // Get - Modified --------------->>>>>>>>>>>>>>>>>>>
  @get('/user/{id}/usercredentials', {
    responses: {
      '200': {
        description: 'User has once Usercredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usercredentials),
          },
        },
      },
      '404': {
        description: 'Usercredentials not found',
      },
    },
  })
  @authenticate('jwt')
  async get(
    @param.path.string('id') id: string,
  ): Promise<Usercredentials> {
    try {
      const userCredentials = await this.userRepository.findCredentials(id);
      if (!userCredentials) {
        throw new HttpErrors.NotFound(`Usercredentials for user with id ${id} not found.`);
      }

      console.log('UserCredentials:', userCredentials);
      return userCredentials;
    }
    catch (error) {
      console.error('Error in get user credentials:', error.message);
      throw new HttpErrors.Unauthorized(`Error in get user credentials: ${error.message}`);
    }
  }


  // Post - Modified --------------->>>>>>>>>>>>>>>>>>>
  @post('/user/{id}/usercredentials', {
    responses: {
      '200': {
        description: 'User Model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usercredentials)}},
      },
      '400': {
        description: 'Invalid Data',
      },
    },
  })
  @authenticate('jwt')
  async createNew(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usercredentials, {
            title: 'NewUsercredentialsInUser',
            exclude: ['id'],
          }),
        },
      },
    }) usercredentials: Omit<Usercredentials, 'id'>,
  ): Promise<Usercredentials> {
    // Ensure the user exists before creating Usercredentials
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpErrors.NotFound(`User with id ${id} not found.`);
    }

    // Create Usercredentials linked to the user
    try {
      return await this.userRepository.usercredentials(id).create(usercredentials);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Error creating user credentials: ${error.message}`);
    }
  }


  // ------------->>>>>>>>>>>>>>


  /*
   @post('/usercredentials')
   @response(200, {
     description: 'Usercredentials model instance',
     content: {'application/json': {schema: getModelSchemaRef(Usercredentials)}},
   })
   async create(
     @requestBody({
       content: {
         'application/json': {
           schema: getModelSchemaRef(Usercredentials, {
             title: 'NewUsercredentials',

           }),
         },
       },
     })
     usercredentials: Usercredentials,
   ): Promise<Usercredentials> {
     return this.usercredentialsRepository.create(usercredentials);
   }

   @get('/usercredentials/count')
   @response(200, {
     description: 'Usercredentials model count',
     content: {'application/json': {schema: CountSchema}},
   })
   async count(
     @param.where(Usercredentials) where?: Where<Usercredentials>,
   ): Promise<Count> {
     return this.usercredentialsRepository.count(where);
   }

   @get('/usercredentials')
   @response(200, {
     description: 'Array of Usercredentials model instances',
     content: {
       'application/json': {
         schema: {
           type: 'array',
           items: getModelSchemaRef(Usercredentials, {includeRelations: true}),
         },
       },
     },
   })
   async find(
     @param.filter(Usercredentials) filter?: Filter<Usercredentials>,
   ): Promise<Usercredentials[]> {
     return this.usercredentialsRepository.find(filter);
   }

   @patch('/usercredentials')
   @response(200, {
     description: 'Usercredentials PATCH success count',
     content: {'application/json': {schema: CountSchema}},
   })
   async updateAll(
     @requestBody({
       content: {
         'application/json': {
           schema: getModelSchemaRef(Usercredentials, {partial: true}),
         },
       },
     })
     usercredentials: Usercredentials,
     @param.where(Usercredentials) where?: Where<Usercredentials>,
   ): Promise<Count> {
     return this.usercredentialsRepository.updateAll(usercredentials, where);
   }

   @get('/usercredentials/{id}')
   @response(200, {
     description: 'Usercredentials model instance',
     content: {
       'application/json': {
         schema: getModelSchemaRef(Usercredentials, {includeRelations: true}),
       },
     },
   })
   async findById(
     @param.path.string('id') id: string,
     @param.filter(Usercredentials, {exclude: 'where'}) filter?: FilterExcludingWhere<Usercredentials>
   ): Promise<Usercredentials> {
     return this.usercredentialsRepository.findById(id, filter);
   }

   @patch('/usercredentials/{id}')
   @response(204, {
     description: 'Usercredentials PATCH success',
   })
   async updateById(
     @param.path.string('id') id: string,
     @requestBody({
       content: {
         'application/json': {
           schema: getModelSchemaRef(Usercredentials, {partial: true}),
         },
       },
     })
     usercredentials: Usercredentials,
   ): Promise<void> {
     await this.usercredentialsRepository.updateById(id, usercredentials);
   }

   @put('/usercredentials/{id}')
   @response(204, {
     description: 'Usercredentials PUT success',
   })
   async replaceById(
     @param.path.string('id') id: string,
     @requestBody() usercredentials: Usercredentials,
   ): Promise<void> {
     await this.usercredentialsRepository.replaceById(id, usercredentials);
   }

   @del('/usercredentials/{id}')
   @response(204, {
     description: 'Usercredentials DELETE success',
   })
   async deleteById(@param.path.string('id') id: string): Promise<void> {
     await this.usercredentialsRepository.deleteById(id);

     }


  */
}


