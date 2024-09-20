import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody,response} from '@loopback/rest';
import {Team} from '../models';
import {TeamRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class TeamController {
  constructor(
    @repository(TeamRepository)
    public teamRepository : TeamRepository,
  ) {}

  @post('/teams')
  @response(200, {
    description: 'Team model instance',
    content: {'application/json': {schema: getModelSchemaRef(Team)}},
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Team, {
            title: 'NewTeam',

          }),
        },
      },
    })
    team: Team,
  ): Promise<Team> {
    return this.teamRepository.create(team);
  }

  @get('/teams/count')
  @response(200, {
    description: 'Team model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async count(
    @param.where(Team) where?: Where<Team>,
  ): Promise<Count> {
    return this.teamRepository.count(where);
  }

  @get('/teams')
  @response(200, {
    description: 'Array of Team model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Team, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Team) filter?: Filter<Team>,
  ): Promise<Team[]> {
    return this.teamRepository.find(filter);
  }

  @patch('/teams')
  @response(200, {
    description: 'Team PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Team, {partial: true}),
        },
      },
    })
    team: Team,
    @param.where(Team) where?: Where<Team>,
  ): Promise<Count> {
    return this.teamRepository.updateAll(team, where);
  }

  @get('/teams/{id}')
  @response(200, {
    description: 'Team model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Team, {includeRelations: true}),
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Team, {exclude: 'where'}) filter?: FilterExcludingWhere<Team>
  ): Promise<Team> {
    return this.teamRepository.findById(id, filter);
  }

  @patch('/teams/{id}')
  @response(204, {
    description: 'Team PATCH success',
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Team, {partial: true}),
        },
      },
    })
    team: Team,
  ): Promise<void> {
    await this.teamRepository.updateById(id, team);
  }

  @put('/teams/{id}')
  @response(204, {
    description: 'Team PUT success',
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() team: Team,
  ): Promise<void> {
    await this.teamRepository.replaceById(id, team);
  }

  @del('/teams/{id}')
  @response(204, {
    description: 'Team DELETE success',
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.teamRepository.deleteById(id);
  }
}
