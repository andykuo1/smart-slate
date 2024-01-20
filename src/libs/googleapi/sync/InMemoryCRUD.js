import CRUD from './CRUD';

function randomKey() {
  return 'key#' + Math.floor(Math.random() * 1_000);
}

/**
 * @extends CRUD<object>
 */
export default class InMemoryCRUD extends CRUD {
  constructor() {
    super();
    /** @type {Record<string, { fileName: string, data: object, time: number }>} */
    this.cache = {};
  }

  /**
   * @override
   * @param {string} key
   * @param {string} name
   * @param {object} data
   */
  async create(key, name, data) {
    key = key || randomKey();
    this.cache[key] = { fileName: name, data, time: Date.now() };
    return key;
  }

  /**
   * @override
   * @param {string} key
   * @returns {Promise<object>}
   */
  async read(key) {
    return this.cache[key].data;
  }

  /**
   * @override
   * @param {string} key
   * @param {string} name
   * @param {object} data
   */
  async update(key, name, data) {
    this.cache[key] = { fileName: name, data, time: Date.now() };
  }

  /**
   * @override
   * @param {string} key
   */
  async delete(key) {
    delete this.cache[key];
  }

  /**
   * @override
   */
  async list() {
    return Object.keys(this.cache).map((key) => ({ id: key, name: key }));
  }
}
