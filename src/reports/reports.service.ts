import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Report } from './reports.entity';

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
}
