import { ICreate } from "../interfaces/SchedulesInterface";
import { getHours, isBefore, startOfHour } from "date-fns";
import { SchedulesRepository } from "../repositories/ServicesRepository";
class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }
  async create({ name, phone, date, user_id }: ICreate) {
    const dateFormatted = new Date(date);

    const hourStart = startOfHour(dateFormatted);

    const hour = getHours(hourStart);
    if (hour <= 8 || hour >= 20) {
      throw new Error("Criar Horário entre 9 e 19.");
    }

    if (isBefore(hourStart, new Date())) {
      throw new Error("Não é permitido agendar data antiga");
    }

    const checkIsAvailable = await this.schedulesRepository.find(
      hourStart,
      user_id
    );

    if (checkIsAvailable) {
      throw new Error("A data agendada não está disponível");
    }
    const create = await this.schedulesRepository.create({
      name,
      phone,
      date: hourStart,
      user_id,
    });
    return create;
  }
  async index(date: Date) {
    const result = await this.schedulesRepository.findAll(date);

    return result;
  }
  async update(id: string, date: Date, user_id: string) {
    // console.log(
    //   '🚀 ~ file: SchedulesService.ts:45 ~ SchedulesService ~ update ~ date:',
    //   date,
    // );
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);

    if (isBefore(hourStart, new Date())) {
      throw new Error(" Não é permitido agendar data antiga");
    }

    const checkIsAvailable = await this.schedulesRepository.find(
      hourStart,
      user_id
    );

    if (checkIsAvailable) {
      throw new Error("A data agendada não está disponível");
    }

    const result = await this.schedulesRepository.update(id, date);
    return result;
  }
  async delete(id: string) {
    const checkExists = await this.schedulesRepository.findById(id);

    if (!checkExists) {
      throw new Error("Agendamento não existe");
    }

    const result = await this.schedulesRepository.delete(id);

    return result;
  }
}

export { SchedulesService };
