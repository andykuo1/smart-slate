/**
 * @template T
 */
export default class CRUD {
  /**
   * @param {string} key
   * @param {string} name
   * @param {T} data
   * @returns {Promise<string>}
   */
  async create(key, name, data) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @param {string} key
   * @returns {Promise<T>}
   */
  async read(key) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @param {string} key
   * @param {string} name
   * @param {T} data
   */
  async update(key, name, data) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @param {string} key
   */
  async delete(key) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @returns {Promise<Array<{ id?: string, name?: string }>>}
   */
  async list() {
    throw new Error('Unsupported operation.');
  }
}
