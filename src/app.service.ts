import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './db/entities/city.entity';
import { Resident } from './db/entities/resident.entity';
import { DatabaseService } from './db/db.service'; // Import your database service
import { Readable } from 'stream';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(City)
    public cityRepository: Repository<City>,
    @InjectRepository(Resident)
    public residentRepository: Repository<Resident>,
    private readonly databaseService: DatabaseService,
  ) {}

  async aggregateData(res, city) {
    const startTime = new Date().getTime();

    const cityAlias = 'c';

    const cityFilter = city
      ? `LEFT JOIN residents r ON r.city_id = ${cityAlias}.id WHERE ${cityAlias}.name ILIKE '%${city}%'`
      : '';

    const cityPopulationQuery = `
      SELECT ${cityAlias}.name AS city, COUNT(*) AS count
      FROM cities ${cityAlias}
      ${cityFilter}
      GROUP BY ${cityAlias}.name
      ORDER BY count DESC;
    `;

    const cityMembersQuery = `
      SELECT ${cityAlias}.name AS city, r.first_name, COUNT(*) AS count
      FROM cities ${cityAlias}
      ${cityFilter}
      GROUP BY ${cityAlias}.name, r.first_name;
    `;

    const [cityPopulation, cityMembers] = await Promise.all([
      this.databaseService.query(cityPopulationQuery, [`%${cityFilter}%`]),
      this.databaseService.query(cityMembersQuery, [`%${cityFilter}%`]),
    ]);

    const citiesPopulation = [];
    const cityMembersAggregated = [];

    // Create a binary tree structure for efficient city aggregation
    const cityTree = {};

    // Aggregate city population
    for (const row of cityPopulation) {
      const city = {
        city: row.city,
        count: row.count,
        members: [],
      };
      cityTree[row.city] = city;
      citiesPopulation.push(city);
    }

    // Aggregate city members and exclude rows with first_name as null
    for (const row of cityMembers) {
      if (cityTree[row.city] && row.first_name !== null) {
        cityTree[row.city].members.push({
          first_name: row.first_name,
          count: row.count,
        });
      }
    }

    cityMembersAggregated.push(...Object.values(cityTree));

    const endTime = new Date().getTime();
    const requestDuration = endTime - startTime;

    const requestData = {
      requestDuration,
      requestData: { city },
      responseData: { citiesPopulation, cityMembersAggregated },
      httpStatus: 200,
    };

    const responseStream = new Readable();
    responseStream.push(JSON.stringify(requestData));
    responseStream.push(null);

    const sendRequest = () => {
      return axios
        .post('http://localhost:8765/logging', requestData)
        .catch((error) => {
          console.error('Error sending request:', error);
        });
    };

    responseStream.pipe(res);
    sendRequest();

    return {
      cities_population: citiesPopulation,
      city_members: cityMembersAggregated,
    };
  }

  // ---------------------------------- insert functions for testing ----------------------------------
  async insertCities() {
    // Insert three example cities
    const city1 = new City();
    city1.name = 'New York';
    city1.description = 'The Big Apple';
    await this.cityRepository.save(city1);

    const city2 = new City();
    city2.name = 'New Some';
    city2.description = 'The City of Angels';
    await this.cityRepository.save(city2);

    const city3 = new City();
    city3.name = 'Chicago';
    city3.description = 'The Windy City';
    await this.cityRepository.save(city3);
  }

  async insertResidents() {
    // Fetch cities from the database (assuming they already exist)
    const newYork = await this.cityRepository.findOne({
      where: { name: 'New York' },
    });
    const newSome = await this.cityRepository.findOne({
      where: { name: 'New Some' },
    });
    const chicago = await this.cityRepository.findOne({
      where: { name: 'Chicago' },
    });

    // Insert three example residents
    const resident1 = new Resident();
    resident1.first_name = 'John';
    resident1.last_name = 'Doe';
    resident1.city = newYork; // Assign the city
    await this.residentRepository.save(resident1);

    const resident2 = new Resident();
    resident2.first_name = 'Jane';
    resident2.last_name = 'Smith';
    resident2.city = newSome; // Assign the city
    await this.residentRepository.save(resident2);

    const resident3 = new Resident();
    resident3.first_name = 'Michael';
    resident3.last_name = 'Johnson';
    resident3.city = chicago; // Assign the city
    await this.residentRepository.save(resident3);

    const resident4 = new Resident();
    resident4.first_name = 'Jane';
    resident4.last_name = 'Smith';
    resident4.city = newYork; // Assign the city
    await this.residentRepository.save(resident4);
  }

  async getCities(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async getResidents(): Promise<Resident[]> {
    return this.residentRepository.find();
  }
}
