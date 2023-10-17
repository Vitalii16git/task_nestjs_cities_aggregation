import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('population')
@ApiTags('Population')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('aggregate')
  @ApiOkResponse({ description: 'Aggregate data from the database' })
  async aggregateData(@Res() res, @Query('city') city: string) {
    const data = await this.appService.aggregateData(res, city);

    return data;
  }

  // ---------------------------------- Endpoints for testing ----------------------------------
  @Post('cities')
  async createCity() {
    return this.appService.insertCityes();
  }

  @Post('residents')
  async createResident() {
    return this.appService.insertResident();
  }

  @Get('getCities')
  async getCities() {
    return this.appService.getCities();
  }

  @Get('getResidents')
  async getResidents() {
    return this.appService.getResidents();
  }
}
