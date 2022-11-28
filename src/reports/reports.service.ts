import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Report } from './reports.entity';
import { GetEstimateDto } from './dtos/get-estimate-dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report: Report = this.reportsRepository.create(reportDto);

    report.user = user;

    return this.reportsRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.reportsRepository.save(report);
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.reportsRepository
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('mileage - :mileage', 'DESC')
      .setParameters({ mileage })
      .getRawMany();
  }
}
