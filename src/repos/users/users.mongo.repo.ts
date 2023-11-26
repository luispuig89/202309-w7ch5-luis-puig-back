import createDebug from 'debug';
import { Repository } from '../repo';
import { LoginUser, User } from '../../entities/user.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('W7E:users:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.passwd = await Auth.hash(newItem.passwd);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email }).exec();
    if (!result || !(await Auth.compare(loginUser.passwd, result.passwd)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  // eslint-disable-next-line no-unused-vars
  search({ key, value }: { key: string; value: unknown }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async addFriend(id: string, newFriend: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    const friend = await this.getById(newFriend.id!);

    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    if (user.enemies.includes(friend)) {
      user.enemies = user.enemies.filter((enemy) => enemy === friend);
    }

    if (!user.friends.includes(friend)) {
      user.friends.push(friend);
    }

    return user;
  }

  async addEnemy(id: string, newEnemy: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    const enemy = await this.getById(newEnemy.id!);

    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    if (user.friends.includes(enemy)) {
      user.friends = user.friends.filter((friend) => friend === enemy);
    }

    if (!user.enemies.includes(enemy)) {
      user.enemies.push(enemy);
    }

    return user;
  }

  async removeFriend(id: string, newFriend: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    const friend = await this.getById(newFriend.id!);

    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    user.friends = user.friends.filter((item) => item === friend);

    return user;
  }

  async removeEnemy(id: string, newFriend: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    const enemy = await this.getById(newFriend.id!);

    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    user.enemies = user.enemies.filter((item) => item === enemy);

    return user;
  }
}
