import { ISchoolRepository } from "@/lib/interfaces/ISchoolRepository"

export class SchoolService {
  constructor(private readonly _schoolRepository: ISchoolRepository) {}
}
